/**
 * Pai Canyon — 实体唯一数据源（Single Source of Truth）
 *
 * 变量对照（SEO 实体绑定配置表）：
 *   DOMAIN_NAME           = paicanyon.com
 *   ATTRACTION_FULL_NAME  = Pai Canyon
 *   ATTRACTION_SHORT_NAME = Pai Canyon
 *   CITY_NAME             = Pai
 *   STATE_PROVINCE        = Mae Hong Son
 *   COUNTRY_NAME          = Thailand
 *   COUNTRY_CODE_2LETTER  = TH
 *   POSTAL_CODE           = 58130
 *   LATITUDE / LONGITUDE  = 19.3061375 / 98.4525156
 *   MAPS_SHARE_URL        = https://maps.app.goo.gl/DiyqAjPXo86mCB5c9
 *   MAPS_EMBED_SRC        = mapsEmbedSrc
 *   NEARBY_LANDMARK_1     = Pai Town (Walking Street)
 *   NEARBY_LANDMARK_2     = Tha Pai Hot Spring
 *   GOVT_TOURISM_URL      = https://www.tourismthailand.org/
 */
export const siteConfig = {
  // 多语言名称（站点名 / 当地名）
  name: {
    th: 'ปายแคนยอน',
    en: 'Pai Canyon',
    zh: '拜县大峡谷',
  },
  nameLocal: 'ปายแคนยอน', // 当地（泰文）名称
  domain: 'https://paicanyon.com',

  /** 官方全称 / 常用俗称 / 别名（用于 JSON-LD alternateName 与正文等位声明） */
  fullName: 'Pai Canyon',
  shortName: 'Pai Canyon',
  alternateNames: {
    en: ['Pai Canyon', 'Kong Lan', 'Pai Pai Canyon'],
    th: ['ปายแคนยอน', 'คองหลาน', 'ปายแคนยอน ปาย'],
    // 拜縣大峽谷 = traditional variant (GSC query ranking ~8.0, separate from simplified)
    zh: ['拜县大峡谷', '拜縣大峽谷', 'Pai Canyon', 'คองหลาน（Kong Lan）'],
  },

  /** 行政区划（面包屑 / PostalAddress / 正文语义绑定） */
  city: 'Pai',
  state: 'Mae Hong Son',
  country: 'Thailand',
  countryCode: 'TH',
  postalCode: '58130',
  streetAddress: '8F43+F22, Mae Hi, Pai District',

  phone: '+66861137373',
  phoneDisplay: '+66 86 113 7373',

  /** 最新 Google 地图数据：4.5 分 / 8,368 条评价（同步时间 2026 年 9 月） */
  rating: 4.5,
  reviewCount: '8,368',
  reviewSyncLabel: '2026-09',

  /** 实际坐标（Google Maps 嵌入中心点）—— 拜县大峡谷（Pai Canyon，Mae Hi, Pai） */
  coords: { lat: 19.3061375, lng: 98.4525156 },

  // 统一 Google Maps 链接（首屏 / 照片 / 评价 / 页脚 共 4 处 + JSON-LD hasMap / sameAs）
  mapsUrl: 'https://maps.app.goo.gl/DiyqAjPXo86mCB5c9',

  // 地图嵌入（MapSection iframe，使用官方 Google Maps 提供的 Pai Canyon 嵌入代码）
  mapsEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6530.707630129212!2d98.4525156!3d19.3061375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da80e8f3eba0f9%3A0x83dbe124b195aec2!2sPai%20Canyon!5e1!3m2!1sen!2s!4v1789370482059!5m2!1sen!2s',
  /** 兼容旧字段命名 */
  googleMapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6530.707630129212!2d98.4525156!3d19.3061375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da80e8f3eba0f9%3A0x83dbe124b195aec2!2sPai%20Canyon!5e1!3m2!1sen!2s!4v1789370482059!5m2!1sen!2s',

  /** 当地政府 / 官方旅游局（GOVT_TOURISM_URL） */
  govtTourismUrl: 'https://www.tourismthailand.org/',

  // 结构化数据 sameAs（权威资料页）
  sameAs: [
    'https://maps.app.goo.gl/DiyqAjPXo86mCB5c9',
    'https://www.tourismthailand.org/',
    'https://en.wikipedia.org/wiki/Pai_district',
  ],

  address: '8F43+F22, Mae Hi, Pai District, Mae Hong Son 58130, Thailand',
  plusCode: '8F43+F22',

  /** 开放时间：每日 06:00–19:00（户外自然景点，免费进入） */
  openingHours: { opens: '06:00', closes: '19:00' },

  /** 周边核心地标（用于正文语义集群） */
  nearbyLandmarks: [
    { name: 'Pai Town', url: 'https://www.tourismthailand.org/Destinations/mae-hong-son' },
    { name: 'Tha Pai Hot Spring', url: 'https://www.tourismthailand.org/Destinations/mae-hong-son' },
  ],

  /** 内容最后更新日期（E-E-A-T） */
  lastUpdated: '2026-09-14',

  /** 时区（天气 / 日出日落 / 时间显示统一使用） */
  timeZone: 'Asia/Bangkok',

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
    {
      name: {
        th: 'Google Maps — รีวิวผู้ใช้',
        en: 'Google Maps — user reviews',
        zh: 'Google 地图 — 用户评价',
      },
      url: 'https://maps.app.goo.gl/DiyqAjPXo86mCB5c9',
    },
  ],
};
