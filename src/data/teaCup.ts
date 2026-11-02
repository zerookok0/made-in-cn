import type { DetailedProduct, ProductImage } from '../types'

const IMAGE_DIR = 'products/9564/'

const galleryFiles = [
  {
    file: '1-1.jpg',
    alt: 'Hand holding the lacquer maple leaf Fu Lu tea cup with tea',
  },
  {
    file: '1-3.jpg',
    alt: 'Top view of amber tea inside the pale celadon cup on a lacquer tray',
  },
  {
    file: '1-5.jpg',
    alt: 'The pale celadon interior of the handmade tea cup held in one hand',
  },
  {
    file: '1-6.jpg',
    alt: 'The tea cup presented inside its fitted wooden gift box',
  },
  {
    file: '1-4.jpg',
    alt: 'The signed base and deep green lacquer finish of the tea cup',
  },
  {
    file: '1-7.jpg',
    alt: 'The lacquer tea cup and teapot on a matching lacquer tray, with size reference',
  },
  {
    file: '1-2.jpg',
    alt: 'Lacquer maple leaf tea cup with amber tea in the celadon interior',
  },
]

const gallery: ProductImage[] = galleryFiles.map(({ file, alt }) => ({
  full: `${IMAGE_DIR}${file}`,
  thumb: `${IMAGE_DIR}thumbs/${file}`,
  alt,
}))

export const TEA_CUP: DetailedProduct = {
  id: '9564',
  name: 'Fu Lu Lacquer Tea Cup',
  subtitle: 'Master Lin Jianjun · Handmade lacquer · Celadon',
  price: 22890,
  currency: 'VND',
  image: `${IMAGE_DIR}1-1.jpg`,
  accent: '#b77e00',
  badge: 'Heritage',
  gallery,
  copy: {
    en: {
      eyebrow: 'Master Lin Jianjun · Dehua, China',
      title: 'Master Lin Jianjun Handmade Lacquer Maple Leaf Fu Lu Tea Cup',
      subtitle:
        'Fu Lu Cup · Floating Lacquer Maple Leaf · Celadon | Gift Box & Certificate Included',
      specs: [
        { label: 'Origin', value: 'Dehua County, China' },
        { label: 'Craftsmanship', value: 'Traditional Lacquer Art' },
        { label: 'Material', value: 'Celadon Porcelain' },
        { label: 'Handmade', value: 'Yes' },
      ],
      description: [
        'Alongside cloisonné enamel and porcelain, lacquerware is celebrated as one of China’s Three Great Traditional Crafts. Often described as a precious black gem and an Eastern treasure, this ancient art represents the refinement and heritage of Chinese craftsmanship.',
        'In 2006, traditional lacquer decoration techniques were officially recognized as part of China’s National Intangible Cultural Heritage.',
        'From selecting raw materials and shaping the base to applying decorative lacquer finishes, each piece undergoes dozens of intricate processes. The craftsmanship requires exceptional precision and patience, with lengthy natural drying and curing periods. As a result, completing a single lacquerware piece can take several months.',
      ],
      note:
        'Every cup is finished by hand. The floating maple leaf pattern, lacquer tones and subtle surface variations are unique to each piece. Gift box and certificate included. The teapot and tray in styling images are not included.',
    },
    vi: {
      eyebrow: 'Nghệ nhân Lin Jianjun · Đức Hóa, Trung Quốc',
      title: 'Chén Trà Phúc Lộc Lá Phong Sơn Mài Thủ Công – Nghệ Nhân Lin Jianjun',
      subtitle:
        'Chén Phúc Lộc · Lá Phong Sơn Mài Loang Màu · Sứ Thanh Hoa | Kèm Hộp Quà & Chứng Nhận',
      specs: [
        { label: 'Xuất xứ', value: 'Huyện Đức Hóa, Trung Quốc' },
        { label: 'Kỹ thuật chế tác', value: 'Nghệ thuật sơn mài truyền thống' },
        { label: 'Chất liệu', value: 'Sứ men thanh hoa' },
        { label: 'Chế tác thủ công', value: 'Có' },
      ],
      description: [
        'Sơn mài, cùng với pháp lam và đồ sứ, được tôn vinh là một trong ba tinh hoa thủ công truyền thống của Trung Hoa. Được ví như “viên ngọc đen quý giá” và “báu vật phương Đông”, nghệ thuật sơn mài thể hiện chiều sâu văn hóa cùng sự tinh xảo trong nghệ thuật chế tác thủ công Trung Hoa.',
        'Năm 2006, kỹ thuật trang trí sơn mài truyền thống chính thức được công nhận là Di sản Văn hóa Phi vật thể cấp Quốc gia của Trung Quốc.',
        'Từ khâu tuyển chọn nguyên liệu, tạo hình cốt sản phẩm đến hoàn thiện từng lớp sơn và họa tiết trang trí, mỗi tác phẩm đều phải trải qua hàng chục công đoạn tỉ mỉ. Quy trình chế tác đòi hỏi sự chính xác, kiên nhẫn và thời gian hong khô, xử lý tự nhiên kéo dài. Vì vậy, để hoàn thiện một tác phẩm sơn mài có thể cần đến vài tháng.',
      ],
      note:
        'Mỗi chén đều được hoàn thiện thủ công. Họa tiết lá phong loang màu, sắc sơn mài và những biến đổi bề mặt nhỏ là duy nhất trên từng tác phẩm. Sản phẩm đi kèm hộp quà và chứng nhận. Ấm trà và khay trong ảnh chỉ dùng để minh họa, không nằm trong bộ sản phẩm.',
    },
  },
}
