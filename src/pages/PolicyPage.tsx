import { AppLink } from '../components/AppLink'
import { site } from '../data/site'
import { useI18n } from '../i18n'
import { useDocumentMeta } from '../lib/router'

type PolicyKind = 'shipping' | 'privacy' | 'terms'

interface PolicySection {
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

interface PolicyCopy {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  title: string
  intro: string
  updated: string
  sections: PolicySection[]
  contactTitle: string
  contactBody: string
  contactCta: string
  shopCta: string
}

const COPY: Record<PolicyKind, Record<'en' | 'vi', PolicyCopy>> = {
  shipping: {
    en: {
      metaTitle: 'Shipping & returns | MADE IN CN',
      metaDescription: 'Thirty-day no-reason returns and exchanges. No extra fees, and we cover return shipping.',
      eyebrow: 'Policies',
      title: 'Shipping & returns',
      intro: 'Thirty days. No reason needed. We cover the return shipping.',
      updated: 'Last updated 3 November 2026',
      sections: [
        {
          title: '30-day returns and exchanges',
          paragraphs: [
            'You may return or exchange any item within 30 days of delivery, for any reason. There is no restocking fee, handling fee or service fee.',
            'Return shipping is on us. We will arrange a prepaid return label where possible, or reimburse the reasonable cost of a tracked return service.',
          ],
        },
        {
          title: 'Before you send it back',
          bullets: [
            `Email ${site.email} with your order number and the item you want to return or exchange.`,
            'Please keep the item unused and in its original packaging, with any certificate, accessories and gift box.',
            'If the item arrived damaged or faulty, include a photo so we can resolve it quickly.',
          ],
        },
        {
          title: 'Refunds and exchanges',
          paragraphs: [
            'Once the return arrives and is checked, we will issue the refund to the original payment method within 5–10 business days. Your bank may need a little longer to show it.',
            'Exchanges depend on stock. If the replacement you want is unavailable, you can choose a refund instead.',
          ],
        },
        {
          title: 'Shipping',
          paragraphs: [
            'Orders are packed by hand. Where the carrier offers tracking, we will send the tracking details when your parcel is dispatched. Delivery time depends on the destination and carrier.',
            'If tracking stops moving, or the parcel arrives damaged, contact us and we will investigate, replace or refund the order.',
          ],
        },
      ],
      contactTitle: 'Start a return',
      contactBody: 'Send us your order number and a short note. We will reply with the next step and arrange the return shipping.',
      contactCta: 'Email us',
      shopCta: 'Back to the shop',
    },
    vi: {
      metaTitle: 'Giao hàng & đổi trả | MADE IN CN',
      metaDescription: 'Đổi trả trong 30 ngày, không cần lý do. Không phát sinh thêm phí, chúng tôi chịu chi phí vận chuyển trả hàng.',
      eyebrow: 'Chính sách',
      title: 'Giao hàng & đổi trả',
      intro: '30 ngày. Không cần lý do. Chúng tôi chịu chi phí vận chuyển trả hàng.',
      updated: 'Cập nhật lần cuối: 3 tháng 11, 2026',
      sections: [
        {
          title: 'Đổi trả trong 30 ngày',
          paragraphs: [
            'Bạn có thể trả hàng hoặc đổi sản phẩm trong vòng 30 ngày kể từ khi nhận hàng, với bất kỳ lý do gì. Không có phí nhập lại, phí xử lý hay phí dịch vụ.',
            'Chi phí vận chuyển trả hàng do chúng tôi chịu. Chúng tôi sẽ sắp xếp nhãn trả hàng trả trước khi có thể, hoặc hoàn lại chi phí hợp lý của dịch vụ vận chuyển có theo dõi.',
          ],
        },
        {
          title: 'Trước khi gửi trả',
          bullets: [
            `Gửi email đến ${site.email} kèm mã đơn hàng và sản phẩm bạn muốn trả hoặc đổi.`,
            'Vui lòng giữ sản phẩm chưa sử dụng, còn nguyên bao bì, kèm chứng nhận, phụ kiện và hộp quà nếu có.',
            'Nếu sản phẩm bị hỏng hoặc lỗi khi nhận, hãy gửi kèm ảnh để chúng tôi xử lý nhanh hơn.',
          ],
        },
        {
          title: 'Hoàn tiền và đổi hàng',
          paragraphs: [
            'Sau khi nhận và kiểm tra hàng trả, chúng tôi sẽ hoàn tiền về phương thức thanh toán ban đầu trong vòng 5–10 ngày làm việc. Ngân hàng của bạn có thể cần thêm thời gian để hiển thị khoản tiền.',
            'Việc đổi hàng phụ thuộc vào tồn kho. Nếu sản phẩm thay thế không còn, bạn có thể chọn hoàn tiền.',
          ],
        },
        {
          title: 'Giao hàng',
          paragraphs: [
            'Đơn hàng được đóng gói thủ công. Khi đơn vị vận chuyển có hỗ trợ theo dõi, chúng tôi sẽ gửi mã theo dõi khi đơn được giao cho họ. Thời gian giao phụ thuộc vào điểm đến và đơn vị vận chuyển.',
            'Nếu mã theo dõi không cập nhật hoặc kiện hàng đến bị hỏng, hãy liên hệ với chúng tôi để được kiểm tra, thay thế hoặc hoàn tiền.',
          ],
        },
      ],
      contactTitle: 'Bắt đầu trả hàng',
      contactBody: 'Gửi mã đơn hàng và một ghi chú ngắn. Chúng tôi sẽ phản hồi bước tiếp theo và sắp xếp vận chuyển trả hàng.',
      contactCta: 'Gửi email',
      shopCta: 'Quay lại cửa hàng',
    },
  },
  privacy: {
    en: {
      metaTitle: 'Privacy | MADE IN CN',
      metaDescription: 'How MADE IN CN collects, uses and protects your personal information.',
      eyebrow: 'Policies',
      title: 'Privacy',
      intro: 'What we collect, why we collect it, and how to ask us to delete it.',
      updated: 'Last updated 3 November 2026',
      sections: [
        {
          title: 'What we collect',
          paragraphs: [
            'When you place an order or contact us, we may receive your name, email address, phone number, shipping and billing address, order details and the content of your messages.',
            'Payments are handled by our WooCommerce store and its payment providers. We receive confirmation of payment, but we do not store full card numbers on this site.',
            'This site stores your cart and language preference in your browser. We also use ipapi.co to estimate your country from your IP address so we can choose the most useful language. We do not use advertising trackers on this site.',
          ],
        },
        {
          title: 'How we use it',
          bullets: [
            'To prepare, ship and support your order.',
            'To handle returns, exchanges and warranty requests.',
            'To answer questions and send updates you ask for.',
            'To keep records required by law and prevent fraud.',
            'To remember your language and cart between visits.',
          ],
        },
        {
          title: 'Who we share it with',
          paragraphs: [
            'We share only what is needed with the services that run the shop: our WooCommerce host, payment providers, delivery carriers and IT support. They may process data in other countries.',
            'We may also disclose information when required by law or to protect our customers, our rights or the safety of others. We do not sell your personal data.',
          ],
        },
        {
          title: 'Cookies and local storage',
          paragraphs: [
            'We use local storage and small cookies for your cart, language choice and approximate-country cache. They keep the shop working and remember your preferences. You can clear them in your browser at any time.',
          ],
        },
        {
          title: 'How long we keep it',
          paragraphs: [
            'We keep order and payment records for as long as needed to fulfil the order, handle returns and meet legal, tax and accounting requirements. Support messages are kept only as long as needed to resolve the request.',
          ],
        },
        {
          title: 'Your choices',
          paragraphs: [
            'Depending on where you live, you may ask to access, correct, delete or restrict the use of your personal information, or object to certain processing. Email us and we will respond within the time required by applicable law.',
            'Nothing in this policy limits rights you have under mandatory consumer or privacy law.',
          ],
        },
      ],
      contactTitle: 'Privacy questions',
      contactBody: 'Ask us what we hold, request a correction, or ask us to delete your data.',
      contactCta: 'Contact us',
      shopCta: 'Back to the shop',
    },
    vi: {
      metaTitle: 'Quyền riêng tư | MADE IN CN',
      metaDescription: 'Cách MADE IN CN thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.',
      eyebrow: 'Chính sách',
      title: 'Quyền riêng tư',
      intro: 'Chúng tôi thu thập gì, vì sao thu thập và cách yêu cầu xóa dữ liệu.',
      updated: 'Cập nhật lần cuối: 3 tháng 11, 2026',
      sections: [
        {
          title: 'Thông tin chúng tôi thu thập',
          paragraphs: [
            'Khi bạn đặt hàng hoặc liên hệ, chúng tôi có thể nhận tên, email, số điện thoại, địa chỉ giao hàng và thanh toán, chi tiết đơn hàng và nội dung tin nhắn của bạn.',
            'Thanh toán được xử lý bởi cửa hàng WooCommerce và các nhà cung cấp thanh toán. Chúng tôi nhận xác nhận thanh toán nhưng không lưu toàn bộ số thẻ trên trang này.',
            'Trang này lưu giỏ hàng và lựa chọn ngôn ngữ trong trình duyệt của bạn. Chúng tôi cũng dùng ipapi.co để ước lượng quốc gia từ địa chỉ IP nhằm chọn ngôn ngữ phù hợp. Trang không dùng công cụ theo dõi quảng cáo.',
          ],
        },
        {
          title: 'Cách chúng tôi sử dụng',
          bullets: [
            'Chuẩn bị, gửi hàng và hỗ trợ đơn hàng.',
            'Xử lý trả hàng, đổi hàng và yêu cầu bảo hành.',
            'Trả lời câu hỏi và gửi cập nhật khi bạn yêu cầu.',
            'Lưu hồ sơ theo quy định pháp luật và ngăn ngừa gian lận.',
            'Ghi nhớ ngôn ngữ và giỏ hàng giữa các lần truy cập.',
          ],
        },
        {
          title: 'Chia sẻ với ai',
          paragraphs: [
            'Chúng tôi chỉ chia sẻ thông tin cần thiết với các dịch vụ vận hành cửa hàng: máy chủ WooCommerce, nhà cung cấp thanh toán, đơn vị vận chuyển và hỗ trợ kỹ thuật. Các bên này có thể xử lý dữ liệu ở quốc gia khác.',
            'Chúng tôi có thể tiết lộ thông tin khi pháp luật yêu cầu hoặc để bảo vệ khách hàng, quyền lợi của chúng tôi hoặc an toàn của người khác. Chúng tôi không bán dữ liệu cá nhân.',
          ],
        },
        {
          title: 'Cookie và lưu trữ cục bộ',
          paragraphs: [
            'Chúng tôi dùng lưu trữ cục bộ và cookie nhỏ cho giỏ hàng, lựa chọn ngôn ngữ và bộ nhớ quốc gia ước lượng. Chúng giúp cửa hàng hoạt động và ghi nhớ tùy chọn của bạn. Bạn có thể xóa chúng trong trình duyệt bất cứ lúc nào.',
          ],
        },
        {
          title: 'Thời gian lưu giữ',
          paragraphs: [
            'Chúng tôi lưu hồ sơ đơn hàng và thanh toán trong thời gian cần thiết để hoàn tất đơn, xử lý trả hàng và đáp ứng yêu cầu pháp lý, thuế, kế toán. Tin nhắn hỗ trợ chỉ được lưu trong thời gian cần thiết để giải quyết yêu cầu.',
          ],
        },
        {
          title: 'Quyền của bạn',
          paragraphs: [
            'Tùy nơi bạn sinh sống, bạn có thể yêu cầu truy cập, chỉnh sửa, xóa hoặc hạn chế việc sử dụng thông tin cá nhân, hoặc phản đối một số hoạt động xử lý. Hãy gửi email và chúng tôi sẽ phản hồi trong thời hạn pháp luật yêu cầu.',
            'Không nội dung nào trong chính sách này giới hạn quyền của bạn theo pháp luật bảo vệ người tiêu dùng hoặc quyền riêng tư bắt buộc.',
          ],
        },
      ],
      contactTitle: 'Câu hỏi về quyền riêng tư',
      contactBody: 'Hỏi chúng tôi đang lưu gì, yêu cầu chỉnh sửa hoặc yêu cầu xóa dữ liệu.',
      contactCta: 'Liên hệ',
      shopCta: 'Quay lại cửa hàng',
    },
  },
  terms: {
    en: {
      metaTitle: 'Terms of use | MADE IN CN',
      metaDescription: 'The terms that apply when you browse or order from MADE IN CN.',
      eyebrow: 'Policies',
      title: 'Terms of use',
      intro: 'The short version: shop with confidence, and please use the site fairly.',
      updated: 'Last updated 3 November 2026',
      sections: [
        {
          title: 'About this site',
          paragraphs: [
            'This site is operated by MADE IN CN Studio. By browsing or ordering, you agree to these terms and to our Privacy and Shipping & returns policies. If you do not agree, please do not use the site.',
          ],
        },
        {
          title: 'Products and availability',
          paragraphs: [
            'Many pieces are made by hand or in small batches. Colour, grain, surface and small dimensions may vary slightly from the photographs; these variations are part of the object, not a defect.',
            'Product availability can change. If an item becomes unavailable after you order, we will contact you to arrange an alternative or a refund.',
          ],
        },
        {
          title: 'Prices, currency and payment',
          paragraphs: [
            'Prices are shown in Vietnamese dong (VND). Payment is completed on our WooCommerce checkout through the payment methods offered there. We may correct obvious pricing errors before an order is accepted.',
            'Your order is accepted when we confirm it. If payment cannot be completed or an order is refused, we will not charge you for that order.',
          ],
        },
        {
          title: 'Shipping, returns and exchanges',
          paragraphs: [
            'We ship with tracking. Delivery times vary by destination and carrier.',
            'You may return or exchange an item within 30 days of delivery for any reason. There is no extra fee, and we cover return shipping. See our Shipping & returns policy for the steps.',
          ],
        },
        {
          title: 'Independent collectibles',
          paragraphs: [
            'Pokémon-themed pieces are independent, fan-made collectibles. They are not official Pokémon Center products and are not endorsed by or affiliated with Nintendo, Creatures or GAME FREAK. Character and trademark rights belong to their respective owners.',
          ],
        },
        {
          title: 'Site content and acceptable use',
          paragraphs: [
            'The text, photographs, layout and brand assets on this site are owned by us or used with permission. You may share links to the site, but you may not copy or resell its content without written permission.',
            'Please do not misuse the site, attempt to disrupt it, scrape it at scale, or use it for unlawful purposes.',
          ],
        },
        {
          title: 'Liability and consumer rights',
          paragraphs: [
            'We work to keep the site accurate and available, but it is provided as is. To the extent permitted by law, we are not liable for indirect or consequential loss arising from use of the site.',
            'Nothing in these terms excludes or limits liability that cannot be excluded by law, or any mandatory rights you have as a consumer. If an item is faulty or not as described, you are entitled to the remedies provided by applicable consumer law.',
          ],
        },
        {
          title: 'Changes and contact',
          paragraphs: [
            'We may update these terms from time to time. The date at the top shows the latest version. Questions? Email us and we will be glad to help.',
          ],
        },
      ],
      contactTitle: 'Questions about these terms',
      contactBody: 'Write to us and we will explain anything that is unclear.',
      contactCta: 'Contact us',
      shopCta: 'Back to the shop',
    },
    vi: {
      metaTitle: 'Điều khoản sử dụng | MADE IN CN',
      metaDescription: 'Các điều khoản áp dụng khi bạn truy cập hoặc đặt hàng tại MADE IN CN.',
      eyebrow: 'Chính sách',
      title: 'Điều khoản sử dụng',
      intro: 'Tóm lại: hãy mua sắm an tâm và sử dụng trang web một cách công bằng.',
      updated: 'Cập nhật lần cuối: 3 tháng 11, 2026',
      sections: [
        {
          title: 'Về trang web này',
          paragraphs: [
            'Trang này do MADE IN CN Studio vận hành. Khi truy cập hoặc đặt hàng, bạn đồng ý với các điều khoản này cùng chính sách Quyền riêng tư và Giao hàng & đổi trả. Nếu không đồng ý, vui lòng không sử dụng trang.',
          ],
        },
        {
          title: 'Sản phẩm và tình trạng còn hàng',
          paragraphs: [
            'Nhiều sản phẩm được làm thủ công hoặc theo lô nhỏ. Màu sắc, vân, bề mặt và kích thước có thể chênh lệch nhẹ so với ảnh; đây là đặc điểm của sản phẩm thủ công, không phải lỗi.',
            'Tình trạng còn hàng có thể thay đổi. Nếu sản phẩm hết hàng sau khi bạn đặt, chúng tôi sẽ liên hệ để sắp xếp lựa chọn thay thế hoặc hoàn tiền.',
          ],
        },
        {
          title: 'Giá, tiền tệ và thanh toán',
          paragraphs: [
            'Giá được hiển thị bằng đồng Việt Nam (VND). Thanh toán được hoàn tất tại trang thanh toán WooCommerce bằng các phương thức được cung cấp tại đó. Chúng tôi có thể sửa lỗi giá rõ ràng trước khi chấp nhận đơn.',
            'Đơn hàng được chấp nhận khi chúng tôi xác nhận. Nếu không thể hoàn tất thanh toán hoặc đơn bị từ chối, bạn sẽ không bị tính phí cho đơn đó.',
          ],
        },
        {
          title: 'Giao hàng, trả hàng và đổi hàng',
          paragraphs: [
            'Chúng tôi gửi hàng kèm mã theo dõi. Thời gian giao phụ thuộc vào điểm đến và đơn vị vận chuyển.',
            'Bạn có thể trả hoặc đổi sản phẩm trong vòng 30 ngày kể từ khi nhận, với bất kỳ lý do gì. Không phát sinh thêm phí và chúng tôi chịu chi phí vận chuyển trả hàng. Xem chính sách Giao hàng & đổi trả để biết các bước.',
          ],
        },
        {
          title: 'Sản phẩm sưu tầm độc lập',
          paragraphs: [
            'Các sản phẩm chủ đề Pokémon là đồ sưu tầm độc lập do người hâm mộ làm. Đây không phải sản phẩm chính thức của Pokémon Center và không được Nintendo, Creatures hay GAME FREAK bảo trợ hoặc liên kết. Quyền nhân vật và nhãn hiệu thuộc về chủ sở hữu tương ứng.',
          ],
        },
        {
          title: 'Nội dung trang và sử dụng hợp lý',
          paragraphs: [
            'Văn bản, hình ảnh, bố cục và tài sản thương hiệu trên trang thuộc quyền sở hữu của chúng tôi hoặc được sử dụng với sự cho phép. Bạn có thể chia sẻ liên kết, nhưng không được sao chép hoặc bán lại nội dung nếu không có sự đồng ý bằng văn bản.',
            'Vui lòng không lạm dụng trang, gây gián đoạn, thu thập dữ liệu quy mô lớn hoặc dùng trang cho mục đích trái pháp luật.',
          ],
        },
        {
          title: 'Trách nhiệm và quyền người tiêu dùng',
          paragraphs: [
            'Chúng tôi cố gắng giữ thông tin chính xác và trang hoạt động ổn định, nhưng trang được cung cấp nguyên trạng. Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm cho thiệt hại gián tiếp phát sinh từ việc sử dụng trang.',
            'Không nội dung nào trong các điều khoản này loại trừ hoặc giới hạn trách nhiệm không thể loại trừ theo pháp luật, hoặc các quyền bắt buộc của bạn với tư cách người tiêu dùng. Nếu sản phẩm bị lỗi hoặc không đúng mô tả, bạn có quyền theo các biện pháp bảo vệ của pháp luật áp dụng.',
          ],
        },
        {
          title: 'Thay đổi và liên hệ',
          paragraphs: [
            'Chúng tôi có thể cập nhật các điều khoản này theo thời gian. Ngày ở đầu trang cho biết phiên bản mới nhất. Có câu hỏi? Hãy gửi email, chúng tôi sẵn lòng hỗ trợ.',
          ],
        },
      ],
      contactTitle: 'Câu hỏi về điều khoản',
      contactBody: 'Hãy viết cho chúng tôi nếu có điều gì chưa rõ.',
      contactCta: 'Liên hệ',
      shopCta: 'Quay lại cửa hàng',
    },
  },
}

export function PolicyPage({ kind }: { kind: PolicyKind }) {
  const { locale } = useI18n()
  const content = COPY[kind][locale]

  useDocumentMeta(content.metaTitle, content.metaDescription)

  return (
    <article className="policy-page">
      <header className="policy-hero">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className="policy-intro">{content.intro}</p>
        <p className="policy-updated">{content.updated}</p>
      </header>

      <div className="policy-content">
        {content.sections.map((section) => (
          <section className="policy-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets && (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <aside className="policy-contact">
          <div>
            <h2>{content.contactTitle}</h2>
            <p>{content.contactBody}</p>
          </div>
          <div className="policy-contact-actions">
            <a className="btn btn-primary" href={`mailto:${site.email}`}>
              {content.contactCta}
            </a>
            <AppLink className="btn btn-ghost" href="/shop">
              {content.shopCta}
            </AppLink>
          </div>
        </aside>
      </div>
    </article>
  )
}
