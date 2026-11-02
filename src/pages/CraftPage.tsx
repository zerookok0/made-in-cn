import { AppLink } from '../components/AppLink'
import { resolveImage } from '../data/images'
import { site } from '../data/site'
import { useDocumentMeta } from '../lib/router'

const steps = [
  {
    number: '01',
    title: 'Trace the maker',
    body: 'We start with a person and a place — a resin studio in Shenzhen, a lacquer workshop in Dehua — not an anonymous listing.',
  },
  {
    number: '02',
    title: 'Read the material',
    body: 'Crystal resin, black walnut, celadon, natural lacquer. We ask what it is, how it ages, and what the hand leaves behind.',
  },
  {
    number: '03',
    title: 'Keep the proof',
    body: 'Certificates, maker names and process notes travel with the object. “Made in China” becomes a fact you can trace.',
  },
]

export function CraftPage() {
  useDocumentMeta(
    `Our craft — ${site.brand}`,
    'How MADE IN CN chooses objects: traceable makers, honest materials, and small-batch production in China.',
  )

  return (
    <div className="craft-page">
      <section className="craft-hero">
        <div className="craft-hero-copy">
          <p className="eyebrow">Our craft</p>
          <h1>
            Made here.<br />
            <em>Chosen with care.</em>
          </h1>
          <p>
            MADE IN CN is a small edit of objects from Chinese workshops. We work directly with the people who make them,
            and we show the material, the process and the hand behind each piece.
          </p>
          <div className="craft-hero-actions">
            <AppLink className="btn btn-primary" href="/shop">Shop the edit</AppLink>
            <AppLink className="btn btn-ghost" href={`mailto:${site.email}`}>Talk to us</AppLink>
          </div>
        </div>
        <div className="craft-hero-media">
          <img src={resolveImage('/images/products/9564/1-1.jpg')} alt="Hand holding a lacquer maple leaf tea cup" />
          <span className="craft-caption">Master Lin Jianjun · Dehua, China</span>
        </div>
      </section>

      <section className="craft-principles">
        <div className="section-head">
          <div>
            <p className="eyebrow">How we choose</p>
            <h2>Three tests. <em>No shortcuts.</em></h2>
          </div>
        </div>
        <div className="craft-steps">
          {steps.map((step) => (
            <article className="craft-step" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="craft-makers">
        <div className="craft-maker-card">
          <img src={resolveImage('/images/products/pikachu/pikachu-detail-04.jpg')} alt="Pikachu lamp packaging and accessories" loading="lazy" />
          <div>
            <p className="eyebrow">Shenzhen · resin studio</p>
            <h2>The lamp makers</h2>
            <p>
              A small team pours crystal resin around hand-painted figures, fits a warm LED core, and tests every angle
              before packing. Their collector lamps are built in short runs, not on a production line.
            </p>
          </div>
        </div>
        <div className="craft-maker-card">
          <img src={resolveImage('/images/products/9564/1-6.jpg')} alt="Lacquer tea cup in a fitted gift box" loading="lazy" />
          <div>
            <p className="eyebrow">Dehua · lacquer workshop</p>
            <h2>Master Lin Jianjun</h2>
            <p>
              In Dehua, Master Lin floats a maple leaf through layer after layer of natural lacquer. Each cup cures for
              months, then meets a pale celadon interior. The certificate carries his name and the piece’s place.
            </p>
          </div>
        </div>
      </section>

      <section className="craft-materials">
        <div>
          <p className="eyebrow">Material notes</p>
          <h2>What you are <em>holding.</em></h2>
        </div>
        <div className="craft-material-list">
          <div><strong>Crystal resin</strong><span>Hand-poured in layers for depth, clarity and a warm diffusion of light.</span></div>
          <div><strong>Black walnut</strong><span>Natural grain, finished by hand. No two frames catch the light the same way.</span></div>
          <div><strong>Dehua celadon</strong><span>A pale, quiet glaze with a long history in Chinese tea ware.</span></div>
          <div><strong>Natural lacquer</strong><span>Built up slowly, cured naturally, and polished until the surface holds the leaf.</span></div>
        </div>
      </section>

      <section className="closing craft-closing">
        <p className="eyebrow">MADE IN CN</p>
        <h2>Made here. <em>Kept for years.</em></h2>
        <p>Start with an object that has a maker, a material and a reason to stay.</p>
        <div className="closing-actions">
          <AppLink className="btn btn-primary" href="/shop">Shop the edit</AppLink>
          <AppLink className="btn btn-ghost" href="/collection/fu-lu-cup">Meet the tea cup</AppLink>
        </div>
      </section>
    </div>
  )
}
