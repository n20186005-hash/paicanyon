export const siteConfig = {
  // 多语言名称（站点名 / 当地名）
  name: {
    th: 'ปายแคนยอน',
    en: 'Pai Canyon',
    zh: '拜县大峡谷',
  },
  nameLocal: 'ปายแคนยอน', // 当地（泰文）名称
  domain: 'https://paicanyon.com',

  phone: '+66861137373',
  phoneDisplay: '+66 86 113 7373',

  rating: 4.5,
  reviewCount: '8,288',

  // 实际坐标（用于天气 / 日落 API 与地图嵌入）—— 拜县大峡谷（Pai Canyon，Mae Hi, Pai）
  coords: { lat: 19.3533, lng: 98.4428 },

  // 统一 Google Maps 链接（首屏 / 照片 / 评价 / 页脚 共 4 处 + JSON-LD sameAs）
  mapsUrl: 'https://maps.app.goo.gl/DiyqAjPXo86mCB5c9',

  // 地图嵌入（MapSection iframe，使用用户提供的 Pai Canyon Google Maps 嵌入代码）
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.4530480024287!2d98.4525156!3d19.3061375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da80e8f3eba0f9%3A0x83dbe124b195aec2!2z5ouc5Y6_5aSn5bOh6LC3!5e0!3m2!1szh-CN!2sus!4v1784646680558!5m2!1szh-CN!2sus',

  // 结构化数据 sameAs（权威资料页）
  sameAs: [
    'https://maps.app.goo.gl/DiyqAjPXo86mCB5c9',
    'https://en.wikipedia.org/wiki/Pai_district',
  ],

  address: '8F43+F22, Mae Hi, Pai District, Mae Hong Son 58130, Thailand',
  plusCode: '8F43+F22',

  // 画廊图片前缀（配合 public/gallery/pai-canyon-1..N.jpg）
  galleryPrefix: 'pai-canyon-',

  // 社交 / 资料链接（科普站占位，上线前请替换为官方或可运营账号）
  socialLinks: [
    {
      name: 'Tourism Thailand',
      href: 'https://www.tourismthailand.org/',
      icon: 'globe',
    },
    {
      name: 'Mae Hong Son',
      href: 'https://www.tourismthailand.org/Destinations/mae-hong-son',
      icon: 'tree',
    },
    {
      name: 'Google Maps',
      href: 'https://maps.app.goo.gl/DiyqAjPXo86mCB5c9',
      icon: 'map',
    },
  ],

  // 资料来源（页脚引用，需与页脚 per-language name 结构一致）
  sources: [
    {
      name: { th: 'การท่องเที่ยวแห่งประเทศไทย', en: 'Tourism Authority of Thailand', zh: '泰国国家旅游局' },
      url: 'https://www.tourismthailand.org/',
    },
    {
      name: { th: 'วิกิพีเดีย – อำเภอปาย', en: 'Wikipedia — Pai District', zh: '维基百科 – 拜县' },
      url: 'https://en.wikipedia.org/wiki/Pai_district',
    },
    {
      name: { th: 'จังหวัดแม่ฮ่องสอน', en: 'Mae Hong Son Province', zh: '夜丰颂府' },
      url: 'https://www.maehongson.go.th/',
    },
  ],
};
