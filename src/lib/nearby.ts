import type { Lang } from '../i18n/ui';

export const nearby = {
  'pai-memorial-bridge': {
    name: ['Tha Pai Memorial Bridge', 'สะพานประวัติศาสตร์ท่าปาย', '拜县纪念桥'],
    query: 'Tha Pai Memorial Bridge Pai Mae Hong Son Thailand',
    history: [
      'The bridge is associated with wartime transport routes in Pai. Interpretive accounts distinguish the original wartime crossing from subsequent structures and repairs; read the signs at the bridge rather than assuming every visible beam dates to World War II.',
      'สะพานแห่งนี้เกี่ยวข้องกับเส้นทางขนส่งในช่วงสงคราม โครงสร้างที่เห็นในปัจจุบันผ่านการเปลี่ยนแปลงและซ่อมแซม จึงควรอ่านป้ายประวัติศาสตร์ ณ สถานที่',
      '这座桥与战时交通运输历史有关，但今天可见的结构经过变迁和修复，不宜把每根构件都视为二战原物。建议阅读桥旁历史说明。',
    ],
    observe: [
      'Compare the bridge spans, riverbank setting and historic information boards. Photograph the whole crossing from a safe approach rather than standing in traffic or crossing a restricted section.',
      'สังเกตช่วงสะพาน ทิวทัศน์ริมแม่น้ำ และป้ายข้อมูล ถ่ายภาพจากจุดที่ปลอดภัยโดยไม่กีดขวางการจราจรหรือเข้าเขตห้าม',
      '可观察桥跨结构、河岸环境与历史展板；适合从安全引道拍摄桥梁全景，不应站在车道上或进入限制区域。',
    ],
  },
  'tha-pai-hot-spring': {
    name: ['Tha Pai Hot Spring', 'น้ำพุร้อนท่าปาย', '塔帕伊温泉'],
    query: 'Tha Pai Hot Spring Pai Mae Hong Son Thailand',
    history: [
      'The hot spring belongs to the forested geothermal landscape south of Pai. Natural hot-water channels can be extremely hot: follow onsite temperature and bathing-zone instructions, not assumptions from photographs.',
      'น้ำพุร้อนอยู่ในพื้นที่ป่าที่มีความร้อนใต้พิภพทางใต้ของปาย น้ำร้อนธรรมชาติบางจุดร้อนจัด ให้ปฏิบัติตามป้ายอุณหภูมิและเขตอนุญาต',
      '温泉位于拜县南部森林地热环境中。天然热水道可能温度很高，请遵照现场温度和可泡汤区域标识，不能凭照片判断安全。',
    ],
    observe: [
      'Look for steam, mineral-stained rocks and the transition from warm-water channels to shaded forest. Photograph only from permitted paths and protect devices from spray and moisture.',
      'ชมไอน้ำ สีแร่บนหิน และลำธารท่ามกลางป่า ถ่ายภาพจากทางที่อนุญาตและระวังความชื้นกับอุปกรณ์',
      '观察蒸汽、矿物沉积颜色以及热水道与森林的过渡；拍摄应站在许可步道上，并注意湿气。',
    ],
  },
  'pai-walking-street': {
    name: ['Pai Walking Street', 'ถนนคนเดินปาย', '拜县步行街'],
    query: 'Pai Walking Street Pai Mae Hong Son Thailand',
    history: [
      'Pai town developed from a mountain district centre into a traveller-oriented evening hub. Its Walking Street reflects current local food, crafts and visitor culture rather than being a preserved historic monument.',
      'ถนนคนเดินสะท้อนการเปลี่ยนแปลงของเมืองปายจากศูนย์กลางอำเภอภูเขาสู่แหล่งท่องเที่ยวยามค่ำคืน ที่นี่เป็นย่านกิจกรรมร่วมสมัยไม่ใช่โบราณสถาน',
      '拜县从山区地方城镇发展为旅行者聚集地，步行街体现当代饮食、手作与旅游文化，并非一座原样保存的古迹。',
    ],
    observe: [
      'Compare food stalls, small craft displays and the surrounding low-rise streetscape. Ask before photographing vendors closely and keep the pedestrian route open.',
      'สังเกตร้านอาหาร งานหัตถกรรม และอาคารเตี้ยริมถนน ขออนุญาตก่อนถ่ายภาพผู้ขายระยะใกล้และไม่กีดขวางทางเดิน',
      '适合观察小吃摊、手工艺品及低层街景；近距离拍摄摊主前应先征求同意，避免堵塞人流。',
    ],
  },
} as const;

export const nearbyCopy = (values: readonly [string, string, string], lang: Lang) => values[{ en: 0, th: 1, zh: 2 }[lang]];
export const nearbyMap = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
