import { AppLink } from '../components/AppLink'
import { resolveImage } from '../data/images'
import { site } from '../data/site'
import { useI18n } from '../i18n'
import { useDocumentMeta } from '../lib/router'

const CRAFT = {
  en: {
    eyebrow: 'Our craft',
    title1: 'Made here.',
    title2: 'Chosen with care.',
    lede: 'MADE IN CN is a small edit of objects from Chinese workshops. We work directly with the people who make them, and we show the material, the process and the hand behind each piece.',
    ctaShop: 'Shop the edit',
    ctaTalk: 'Talk to us',
    imageAlt: 'Hand holding a lacquer maple leaf tea cup',
    caption: 'Master Lin Jianjun · Dehua, China',
    howEyebrow: 'How we choose',
    howTitle1: 'Three tests.',
    howTitle2: 'No shortcuts.',
    steps: [
      { number: '01', title: 'Trace the maker', body: 'We start with a person and a place — a resin studio in Shenzhen, a lacquer workshop in Dehua — not an anonymous listing.' },
      { number: '02', title: 'Read the material', body: 'Crystal resin, black walnut, celadon, natural lacquer. We ask what it is, how it ages, and what the hand leaves behind.' },
      { number: '03', title: 'Keep the proof', body: 'Certificates, maker names and process notes travel with the object. “Made in China” becomes a fact you can trace.' },
    ],
    makers: [
      {
        eyebrow: 'Shenzhen · resin studio',
        title: 'The lamp makers',
        body: 'A small team pours crystal resin around hand-painted figures, fits a warm LED core, and tests every angle before packing. Their collector lamps are built in short runs, not on a production line.',
        image: '/images/products/pikachu/pikachu-detail-04.jpg',
        alt: 'Pikachu lamp packaging and accessories',
      },
      {
        eyebrow: 'Dehua · lacquer workshop',
        title: 'Master Lin Jianjun',
        body: 'In Dehua, Master Lin floats a maple leaf through layer after layer of natural lacquer. Each cup cures for months, then meets a pale celadon interior. The certificate carries his name and the piece’s place.',
        image: '/images/products/9564/1-6.jpg',
        alt: 'Lacquer tea cup in a fitted gift box',
      },
    ],
    materialEyebrow: 'Material notes',
    materialTitle1: 'What you are',
    materialTitle2: 'holding.',
    materials: [
      { title: 'Crystal resin', body: 'Hand-poured in layers for depth, clarity and a warm diffusion of light.' },
      { title: 'Black walnut', body: 'Natural grain, finished by hand. No two frames catch the light the same way.' },
      { title: 'Dehua celadon', body: 'A pale, quiet glaze with a long history in Chinese tea ware.' },
      { title: 'Natural lacquer', body: 'Built up slowly, cured naturally, and polished until the surface holds the leaf.' },
    ],
    closingEyebrow: 'MADE IN CN',
    closingTitle1: 'Made here.',
    closingTitle2: 'Kept for years.',
    closingBody: 'Start with an object that has a maker, a material and a reason to stay.',
    closingCta1: 'Shop the edit',
    closingCta2: 'Meet the tea cup',
  },
  vi: {
    eyebrow: 'Nghề làm',
    title1: 'Làm ở đây.',
    title2: 'Chọn bằng tay.',
    lede: 'MADE IN CN là một tuyển chọn nhỏ từ các xưởng Trung Quốc. Chúng tôi làm việc trực tiếp với người làm, và cho thấy chất liệu, quy trình cùng dấu tay phía sau mỗi món đồ.',
    ctaShop: 'Xem tuyển chọn',
    ctaTalk: 'Liên hệ',
    imageAlt: 'Bàn tay nâng chén trà sơn mài lá phong',
    caption: 'Nghệ nhân Lin Jianjun · Đức Hóa, Trung Quốc',
    howEyebrow: 'Cách chúng tôi chọn',
    howTitle1: 'Ba bài kiểm tra.',
    howTitle2: 'Không đường tắt.',
    steps: [
      { number: '01', title: 'Truy nguyên người làm', body: 'Chúng tôi bắt đầu từ một con người và một nơi chốn — xưởng resin ở Thâm Quyến, xưởng sơn mài ở Đức Hóa — không phải một trang bán hàng vô danh.' },
      { number: '02', title: 'Đọc chất liệu', body: 'Resin pha lê, gỗ óc chó đen, sứ thanh hóa, sơn mài tự nhiên. Chúng tôi hỏi đó là gì, theo thời gian sẽ thế nào, và bàn tay để lại dấu gì.' },
      { number: '03', title: 'Giữ bằng chứng', body: 'Chứng nhận, tên người làm và ghi chép quy trình đi cùng món đồ. “Made in China” trở thành một sự thật có thể truy nguyên.' },
    ],
    makers: [
      {
        eyebrow: 'Thâm Quyến · xưởng resin',
        title: 'Những người làm đèn',
        body: 'Một nhóm nhỏ rót resin pha lê quanh các nhân vật sơn tay, lắp lõi LED ấm và kiểm tra mọi góc trước khi đóng gói. Đèn sưu tầm được làm theo lô ngắn, không phải dây chuyền hàng loạt.',
        image: '/images/products/pikachu/pikachu-detail-04.jpg',
        alt: 'Hộp và phụ kiện của đèn Pikachu',
      },
      {
        eyebrow: 'Đức Hóa · xưởng sơn mài',
        title: 'Nghệ nhân Lin Jianjun',
        body: 'Tại Đức Hóa, nghệ nhân Lin thả một chiếc lá phong qua từng lớp sơn mài tự nhiên. Mỗi chén ủ trong nhiều tháng, rồi gặp lòng men thanh hóa nhạt. Chứng nhận mang tên ông và nơi chốn của tác phẩm.',
        image: '/images/products/9564/1-6.jpg',
        alt: 'Chén trà sơn mài trong hộp quà vừa vặn',
      },
    ],
    materialEyebrow: 'Ghi chú chất liệu',
    materialTitle1: 'Điều bạn đang',
    materialTitle2: 'cầm trên tay.',
    materials: [
      { title: 'Resin pha lê', body: 'Rót tay từng lớp để tạo chiều sâu, độ trong và ánh sáng khuếch tán ấm.' },
      { title: 'Gỗ óc chó đen', body: 'Vân tự nhiên, hoàn thiện bằng tay. Không khung nào bắt sáng giống khung nào.' },
      { title: 'Sứ thanh hóa Đức Hóa', body: 'Lớp men nhạt, tĩnh, có lịch sử lâu đời trong trà cụ Trung Hoa.' },
      { title: 'Sơn mài tự nhiên', body: 'Xây từng lớp chậm rãi, ủ tự nhiên và đánh bóng cho đến khi bề mặt giữ được chiếc lá.' },
    ],
    closingEyebrow: 'MADE IN CN',
    closingTitle1: 'Làm ở đây.',
    closingTitle2: 'Giữ được nhiều năm.',
    closingBody: 'Bắt đầu từ một món đồ có người làm, có chất liệu và có lý do để ở lại.',
    closingCta1: 'Xem tuyển chọn',
    closingCta2: 'Xem chiếc chén',
  },
} as const

export function CraftPage() {
  const { locale, t } = useI18n()
  const copy = CRAFT[locale]

  useDocumentMeta(t('meta.craftTitle'), t('meta.craftDesc'))

  return (
    <div className="craft-page">
      <section className="craft-hero">
        <div className="craft-hero-copy">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>
            {copy.title1}<br />
            <em>{copy.title2}</em>
          </h1>
          <p>{copy.lede}</p>
          <div className="craft-hero-actions">
            <AppLink className="btn btn-primary" href="/shop">{copy.ctaShop}</AppLink>
            <AppLink className="btn btn-ghost" href={`mailto:${site.email}`}>{copy.ctaTalk}</AppLink>
          </div>
        </div>
        <div className="craft-hero-media">
          <img src={resolveImage('/images/products/9564/1-1.jpg')} alt={copy.imageAlt} />
          <span className="craft-caption">{copy.caption}</span>
        </div>
      </section>

      <section className="craft-principles">
        <div className="section-head">
          <div>
            <p className="eyebrow">{copy.howEyebrow}</p>
            <h2>{copy.howTitle1} <em>{copy.howTitle2}</em></h2>
          </div>
        </div>
        <div className="craft-steps">
          {copy.steps.map((step) => (
            <article className="craft-step" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="craft-makers">
        {copy.makers.map((maker) => (
          <div className="craft-maker-card" key={maker.title}>
            <img src={resolveImage(maker.image)} alt={maker.alt} loading="lazy" />
            <div>
              <p className="eyebrow">{maker.eyebrow}</p>
              <h2>{maker.title}</h2>
              <p>{maker.body}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="craft-materials">
        <div>
          <p className="eyebrow">{copy.materialEyebrow}</p>
          <h2>{copy.materialTitle1} <em>{copy.materialTitle2}</em></h2>
        </div>
        <div className="craft-material-list">
          {copy.materials.map((material) => (
            <div key={material.title}>
              <strong>{material.title}</strong>
              <span>{material.body}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="closing craft-closing">
        <p className="eyebrow">{copy.closingEyebrow}</p>
        <h2>{copy.closingTitle1} <em>{copy.closingTitle2}</em></h2>
        <p>{copy.closingBody}</p>
        <div className="closing-actions">
          <AppLink className="btn btn-primary" href="/shop">{copy.closingCta1}</AppLink>
          <AppLink className="btn btn-ghost" href="/collection/fu-lu-cup">{copy.closingCta2}</AppLink>
        </div>
      </section>
    </div>
  )
}
