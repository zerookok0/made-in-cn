import type { CommitResult, RepoConfig, RepoFile } from './types'

const API = 'https://api.github.com'

export class GitHubError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'GitHubError'
    this.status = status
  }
}

function headers(cfg: RepoConfig): Record<string, string> {
  return {
    Authorization: `Bearer ${cfg.token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function repoPath(cfg: RepoConfig, suffix = ''): string {
  return `/repos/${cfg.owner}/${cfg.repo}${suffix}`
}

function branchPath(branch: string): string {
  return branch
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
}

function filePath(path: string): string {
  return path
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
}

async function request<T>(cfg: RepoConfig, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      ...headers(cfg),
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers as Record<string, string> | undefined),
    },
  })

  if (!res.ok) {
    let message = res.statusText

    try {
      const body = (await res.json()) as { message?: string }
      if (body?.message) message = body.message
    } catch {
      /* keep statusText */
    }

    if (res.status === 401) message = 'GitHub Token 无效或已过期。'
    if (res.status === 403) message = `GitHub 拒绝访问：${message}`
    if (res.status === 404) message = '找不到仓库或文件，或 Token 没有该仓库权限。'

    throw new GitHubError(res.status, message)
  }

  return (await res.json()) as T
}

export function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  return bytesToBase64(bytes)
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''

  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }

  return btoa(binary)
}

function fromBase64Utf8(base64: string): string {
  const binary = atob(base64.replace(/\s/g, ''))
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export async function verifyRepo(
  cfg: RepoConfig,
): Promise<{ fullName: string; canPush: boolean }> {
  const data = await request<{ full_name: string; permissions?: { push?: boolean } }>(
    cfg,
    repoPath(cfg),
  )

  return { fullName: data.full_name, canPush: Boolean(data.permissions?.push) }
}

export async function fetchContentFile(
  cfg: RepoConfig,
  path: string,
): Promise<{ text: string; sha: string } | null> {
  const res = await fetch(
    `${API}${repoPath(cfg, `/contents/${filePath(path)}`)}?ref=${encodeURIComponent(cfg.branch)}`,
    { headers: headers(cfg) },
  )

  if (res.status === 404) return null

  if (!res.ok) {
    let message = res.statusText

    try {
      const body = (await res.json()) as { message?: string }
      if (body?.message) message = body.message
    } catch {
      /* keep statusText */
    }

    throw new GitHubError(res.status, message)
  }

  const data = (await res.json()) as {
    type?: string
    content?: string
    encoding?: string
    download_url?: string
    sha: string
  }

  if (data.type && data.type !== 'file') {
    throw new GitHubError(422, `${path} 不是单个文件。`)
  }

  if (data.content && data.encoding === 'base64') {
    return { text: fromBase64Utf8(data.content), sha: data.sha }
  }

  if (data.download_url) {
    const raw = await fetch(data.download_url)
    if (!raw.ok) throw new GitHubError(raw.status, `无法下载 ${path}`)
    return { text: await raw.text(), sha: data.sha }
  }

  return { text: '', sha: data.sha }
}

interface GitRef {
  object: { sha: string }
}

interface GitCommit {
  tree: { sha: string }
}

interface GitBlob {
  sha: string
}

interface GitTree {
  sha: string
}

interface GitCommitResult {
  sha: string
}

export async function commitFiles(
  cfg: RepoConfig,
  message: string,
  files: RepoFile[],
): Promise<CommitResult> {
  if (!files.length) {
    throw new GitHubError(400, '没有需要提交的文件。')
  }

  let lastError: unknown = null

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const ref = await request<GitRef>(
        cfg,
        repoPath(cfg, `/git/ref/heads/${branchPath(cfg.branch)}`),
      )
      const parent = await request<GitCommit>(
        cfg,
        repoPath(cfg, `/git/commits/${ref.object.sha}`),
      )

      const blobs = await Promise.all(
        files.map((file) =>
          request<GitBlob>(cfg, repoPath(cfg, '/git/blobs'), {
            method: 'POST',
            body: JSON.stringify({ content: file.base64, encoding: 'base64' }),
          }),
        ),
      )

      const tree = await request<GitTree>(cfg, repoPath(cfg, '/git/trees'), {
        method: 'POST',
        body: JSON.stringify({
          base_tree: parent.tree.sha,
          tree: files.map((file, index) => ({
            path: file.path,
            mode: '100644',
            type: 'blob',
            sha: blobs[index].sha,
          })),
        }),
      })

      const commit = await request<GitCommitResult>(cfg, repoPath(cfg, '/git/commits'), {
        method: 'POST',
        body: JSON.stringify({
          message,
          tree: tree.sha,
          parents: [ref.object.sha],
        }),
      })

      await request(cfg, repoPath(cfg, `/git/refs/heads/${branchPath(cfg.branch)}`), {
        method: 'PATCH',
        body: JSON.stringify({ sha: commit.sha, force: false }),
      })

      return {
        sha: commit.sha,
        url: `https://github.com/${cfg.owner}/${cfg.repo}/commit/${commit.sha}`,
      }
    } catch (error) {
      lastError = error

      if (error instanceof GitHubError && (error.status === 409 || error.status === 422)) {
        continue
      }

      throw error
    }
  }

  throw lastError instanceof Error ? lastError : new GitHubError(500, '提交失败，请重试。')
}
