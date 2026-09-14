/**
 * WMO weather interpretation codes -> short human labels, per language.
 * `t` = full sentence label, `s` = short label for chips and summaries.
 */
export const WEATHER_CODES: Record<number, Record<string, { t: string; s: string }>> = {
  0: { th: { t: 'ท้องฟ้าโปร่งใส', s: 'แดดจัด' }, en: { t: 'Clear sky', s: 'Sunny' }, zh: { t: '晴空', s: '晴' } },
  1: { th: { t: 'โปร่งโล่ง', s: 'ส่วนใหญ่โปร่ง' }, en: { t: 'Mainly clear', s: 'Mostly clear' }, zh: { t: '少云', s: '少云' } },
  2: { th: { t: 'มีเมฆบางส่วน', s: 'มีเมฆบางส่วน' }, en: { t: 'Partly cloudy', s: 'Partly cloudy' }, zh: { t: '局部多云', s: '局部多云' } },
  3: { th: { t: 'เมฆมาก', s: 'เมฆมาก' }, en: { t: 'Overcast', s: 'Overcast' }, zh: { t: '阴', s: '阴' } },
  45: { th: { t: 'หมอก', s: 'หมอก' }, en: { t: 'Fog', s: 'Fog' }, zh: { t: '雾', s: '雾' } },
  48: { th: { t: 'หมอกแข็ง', s: 'หมอก' }, en: { t: 'Rime fog', s: 'Fog' }, zh: { t: '雾凇', s: '雾' } },
  51: { th: { t: 'ฝนปรอยเล็กน้อย', s: 'ฝนปรอย' }, en: { t: 'Light drizzle', s: 'Drizzle' }, zh: { t: '小毛毛雨', s: '毛毛雨' } },
  53: { th: { t: 'ฝนปรอยปานกลาง', s: 'ฝนปรอย' }, en: { t: 'Drizzle', s: 'Drizzle' }, zh: { t: '毛毛雨', s: '毛毛雨' } },
  55: { th: { t: 'ฝนปรอยหนัก', s: 'ฝนปรอย' }, en: { t: 'Dense drizzle', s: 'Drizzle' }, zh: { t: '浓毛毛雨', s: '毛毛雨' } },
  61: { th: { t: 'ฝนตกเล็กน้อย', s: 'ฝนตก' }, en: { t: 'Light rain', s: 'Rain' }, zh: { t: '小雨', s: '雨' } },
  63: { th: { t: 'ฝนตกปานกลาง', s: 'ฝนตก' }, en: { t: 'Rain', s: 'Rain' }, zh: { t: '中雨', s: '雨' } },
  65: { th: { t: 'ฝนตกหนัก', s: 'ฝนตก' }, en: { t: 'Heavy rain', s: 'Rain' }, zh: { t: '大雨', s: '雨' } },
  71: { th: { t: 'หิมะตกเล็กน้อย', s: 'หิมะ' }, en: { t: 'Light snow', s: 'Snow' }, zh: { t: '小雪', s: '雪' } },
  73: { th: { t: 'หิมะตกปานกลาง', s: 'หิมะ' }, en: { t: 'Snow', s: 'Snow' }, zh: { t: '中雪', s: '雪' } },
  75: { th: { t: 'หิมะตกหนัก', s: 'หิมะ' }, en: { t: 'Heavy snow', s: 'Snow' }, zh: { t: '大雪', s: '雪' } },
  80: { th: { t: 'ฝนตกเป็นระยะ', s: 'ฝนตก' }, en: { t: 'Rain showers', s: 'Showers' }, zh: { t: '阵雨', s: '阵雨' } },
  81: { th: { t: 'ฝนตกเป็นระยะปานกลาง', s: 'ฝนตก' }, en: { t: 'Rain showers', s: 'Showers' }, zh: { t: '阵雨', s: '阵雨' } },
  82: { th: { t: 'ฝนตกเป็นระยะหนัก', s: 'ฝนตก' }, en: { t: 'Violent showers', s: 'Showers' }, zh: { t: '强阵雨', s: '阵雨' } },
  95: { th: { t: 'พายุฝนฟ้าคะนอง', s: 'ฟ้าคะนอง' }, en: { t: 'Thunderstorm', s: 'Storm' }, zh: { t: '雷阵雨', s: '雷雨' } },
  96: { th: { t: 'พายุฝนฟ้าคะนองลูกเห็บ', s: 'ฟ้าคะนอง' }, en: { t: 'Thunderstorm', s: 'Storm' }, zh: { t: '雷阵雨', s: '雷雨' } },
  99: { th: { t: 'พายุฝนฟ้าคะนองลูกเห็บหนัก', s: 'ฟ้าคะนอง' }, en: { t: 'Severe thunderstorm', s: 'Storm' }, zh: { t: '强雷阵雨', s: '雷雨' } },
};

/** Localised weather-code map for one language, ready to ship to the client. */
export function weatherMapFor(lang: string): Record<string, { t: string; s: string }> {
  return Object.fromEntries(Object.entries(WEATHER_CODES).map(([k, v]) => [k, v[lang] ?? v.en]));
}
