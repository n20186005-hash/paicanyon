/**
 * Weather presentation + visit-advice engine for Pai Canyon.
 *
 * Pure and isomorphic: used at build time (server-side render of the current
 * reading) and in the browser (refresh every 30 minutes), so both paths always
 * produce identical copy.
 */
import { weatherMapFor } from '../i18n/weather';

export type WeatherPayload = {
  current?: Record<string, any>;
  hourly?: Record<string, any>;
  daily?: Record<string, any>;
  alerts?: any[];
};

export type WeatherDay = { name: string; icon: string; range: string; prob: string; label: string };

export type WeatherView = {
  ready: boolean;
  icon: string;
  temp: string;
  condition: string;
  feels: string;
  humidity: string;
  wind: string;
  prob: string;
  uv: string;
  sun: string;
  updated: string;
  umbrella: string;
  dress: string;
  plan: string;
  gear: string[];
  risks: string[];
  calm: boolean;
  days: WeatherDay[];
};

const HEAVY = [63, 65, 66, 67, 81, 82, 95, 96, 99];
const WET = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];

const num = (v: any): number | null => (typeof v === 'number' && !isNaN(v) ? v : null);
const round = (v: any): string => (num(v) == null ? '—' : String(Math.round(num(v) as number)));
const has = (list: number[], v: number | null): boolean => v != null && list.indexOf(v) >= 0;

export function kindOf(code: number | null): string {
  if (code == null) return 'partly';
  if (code <= 1) return 'clear';
  if (code === 2) return 'partly';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 67) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 80 && code <= 82) return 'showers';
  return 'thunder';
}

export function iconFor(code: number | null): string {
  if (code == null) return '🌡️';
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 95) return '⛈️';
  return '🌡️';
}

/** Peak rain probability over the next few hours. */
function rainSoon(hourly: Record<string, any> | undefined, hours = 6): number | null {
  const times: string[] = (hourly && hourly.time) || [];
  const probs: any[] = (hourly && hourly.precipitation_probability) || [];
  if (!times.length) return null;
  const from = Date.now() - 30 * 60000;
  let start = times.findIndex((t) => new Date(t).getTime() >= from);
  if (start < 0) start = 0;
  const slice = probs.slice(start, start + hours).filter((v) => num(v) != null) as number[];
  return slice.length ? Math.max.apply(null, slice) : null;
}

function uvWord(uv: number | null, w: Record<string, any>): string {
  if (uv == null) return '—';
  if (uv < 3) return w.uvLow;
  if (uv < 6) return w.uvModerate;
  if (uv < 8) return w.uvHigh;
  if (uv < 11) return w.uvVeryHigh;
  return w.uvExtreme;
}

/** Umbrella verdict: the one question most visitors actually ask. */
function umbrellaVerdict(next: number | null, wet: boolean, heavy: boolean, w: Record<string, any>): string {
  if (heavy || wet || (next != null && next >= 50)) return w.umbrellaYes;
  if (next != null && next >= 30) return w.umbrellaMaybe;
  return w.umbrellaNo;
}

/** Clothing: one, most actionable line. */
function dressAdvice(x: Record<string, any>, a: Record<string, any>): string {
  if (x.thunder || x.heavy) return a.dStorm;
  if (x.wet || x.rainSoon60) return a.dRain;
  if (x.cold) return a.dCold;
  if (x.hot) return a.dHot;
  if (x.swing) return a.dLayers;
  if (x.wind) return a.dWind;
  return a.dMild;
}

/** Plan for the visit: one line, ordered by what would ruin the trip. */
function planAdvice(x: Record<string, any>, a: Record<string, any>): string {
  if (x.thunder) return a.pThunder;
  if (x.heavy) return a.pHeavy;
  if (x.wet || x.rainSoon60) return a.pChance;
  if (x.fog) return a.pFog;
  if (x.cloudSea) return a.pCloudSea;
  if (x.hot) return a.pHot;
  if (x.wind) return a.pWind;
  if (x.kind === 'overcast') return a.pOvercast;
  if (x.kind === 'clear' || x.kind === 'partly') return a.pClear;
  return a.pDefault;
}

/** Items to carry: only what this specific day justifies, capped at four. */
function gearAdvice(x: Record<string, any>, a: Record<string, any>): string[] {
  const out: string[] = [];
  if (x.heavy || x.thunder) out.push(a.gRaincoat);
  else if (x.wet || x.rainSoon60) out.push(a.gRain);
  out.push(a.gShoes);
  if (x.uvHigh || x.kind === 'clear' || x.kind === 'partly') out.push(a.gSun);
  if (x.hot || (x.tmax != null && x.tmax >= 28)) out.push(a.gWater);
  if (x.swing || x.cold || (x.tmin != null && x.tmin <= 18)) out.push(a.gWarm);
  if (x.kind === 'clear' || x.kind === 'partly' || x.kind === 'overcast' || x.kind === 'fog') out.push(a.gTorch);
  return out.slice(0, 4);
}

/** Risks: alerts first, then the conditions that matter on an unfenced ridge. */
function riskAdvice(d: WeatherPayload, x: Record<string, any>, a: Record<string, any>): string[] {
  const out: string[] = [];
  const alerts: any[] = (d.alerts || []).slice(0, 2);
  for (const al of alerts) {
    const name = al && (al.event || al.headline);
    if (name) out.push(String(a.rAlert).replace('{event}', name));
  }
  if (x.thunder) out.push(a.rThunder);
  if (x.heavy) out.push(a.rRain);
  if (x.gale) out.push(a.rGale);
  if (x.fog) out.push(a.rFog);
  if (x.tmax != null && x.tmax >= 38) out.push(a.rHeat);
  return out.slice(0, 3);
}

/** Everything the UI needs, already localised and ready to paint. */
export function buildView(
  d: WeatherPayload | null,
  w: Record<string, any>,
  opts: { locale: string; timeZone: string; lang: string; now?: Date }
): WeatherView {
  const empty: WeatherView = {
    ready: false,
    icon: '🌤️',
    temp: '—',
    condition: '—',
    feels: '—',
    humidity: '—',
    wind: '—',
    prob: '—',
    uv: '—',
    sun: '—',
    updated: '—',
    umbrella: w.loading,
    dress: '',
    plan: '',
    gear: [],
    risks: [],
    calm: false,
    days: [],
  };
  if (!d || !d.current || !d.daily) return empty;

  const map = weatherMapFor(opts.lang);
  const a = w.advice;
  const cur = d.current;
  const daily = d.daily as Record<string, any>;
  const now = opts.now || new Date();

  const code = num(cur.weather_code);
  const kind = kindOf(code);
  const todayCode = num(daily.weather_code?.[0]);
  const todayKind = kindOf(todayCode);
  const tmax = num(daily.temperature_2m_max?.[0]);
  const tmin = num(daily.temperature_2m_min?.[0]);
  const uv = num(daily.uv_index_max?.[0]);
  const uvProb = num(daily.precipitation_probability_max?.[0]);
  const winMax = num(daily.wind_speed_10m_max?.[0]);
  const wind = num(cur.wind_speed_10m);
  const gust = num(cur.wind_gusts_10m);
  const next = rainSoon(d.hourly);

  // Local hour decides whether the early-morning valley cloud tip still applies.
  const hourNow = Number(
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hour12: false, timeZone: opts.timeZone }).format(now)
  );
  const humidity = num(cur.relative_humidity_2m);

  const x: Record<string, any> = {
    kind,
    tmax,
    tmin,
    thunder: kind === 'thunder' || todayKind === 'thunder',
    heavy: has(HEAVY, code) || has(HEAVY, todayCode),
    wet: has(WET, code) || has(WET, todayCode),
    rainSoon60: next != null && next >= 60,
    fog: kind === 'fog' || todayKind === 'fog',
    hot: (tmax != null && tmax >= 32) || num(cur.apparent_temperature) != null && (num(cur.apparent_temperature) as number) >= 33,
    cold: tmax != null && tmax <= 10,
    swing: tmax != null && tmin != null && tmax - tmin > 8,
    wind: (wind != null && wind >= 29) || (winMax != null && winMax >= 39),
    cloudSea: (kind === 'clear' || kind === 'partly') && humidity != null && humidity >= 85 && hourNow < 10,
    gale: (wind != null && wind >= 50) || (winMax != null && winMax >= 50) || (gust != null && gust >= 62),
    uvHigh: uv != null && uv >= 5,
  };

  const timeFmt = new Intl.DateTimeFormat(opts.locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: opts.timeZone,
  });
  const clock = (iso: any) => {
    const t = new Date(iso);
    return isNaN(t.getTime()) ? '—' : timeFmt.format(t);
  };
  const dayFmt = new Intl.DateTimeFormat(opts.locale, { weekday: 'short', timeZone: opts.timeZone });

  const dayCount = Math.min(7, (daily.time || []).length);
  const days: WeatherDay[] = [];
  for (let i = 0; i < dayCount; i++) {
    const code_i = num(daily.weather_code?.[i]);
    days.push({
      name: i === 0 ? w.today : i === 1 ? w.tomorrow : dayFmt.format(new Date(daily.time[i] + 'T12:00:00')),
      icon: iconFor(code_i),
      range: round(daily.temperature_2m_max?.[i]) + '° / ' + round(daily.temperature_2m_min?.[i]) + '°',
      prob: daily.precipitation_probability_max?.[i] == null ? '—' : round(daily.precipitation_probability_max[i]) + '%',
      label: (map[code_i == null ? 3 : code_i] || map[3]).s,
    });
  }

  const entry = map[code == null ? 2 : code] || map[2];
  const risks = riskAdvice(d, x, a);
  // Only reassure the visitor on a genuinely uneventful day — never next to rain advice.
  const calm = risks.length === 0 && !x.wet && !x.heavy && !x.rainSoon60;

  return {
    ready: true,
    icon: iconFor(code),
    temp: round(cur.temperature_2m),
    condition: entry.t,
    feels: round(cur.apparent_temperature) + ' °C',
    humidity: round(cur.relative_humidity_2m) + ' %',
    wind: round(cur.wind_speed_10m) + ' km/h',
    prob: uvProb == null ? '—' : round(uvProb) + ' %',
    uv: uvWord(uv, w),
    sun: (daily.sunrise && daily.sunrise[0] ? clock(daily.sunrise[0]) : '—') + ' / ' + (daily.sunset && daily.sunset[0] ? clock(daily.sunset[0]) : '—'),
    updated: w.updated + ' ' + timeFmt.format(now),
    umbrella: umbrellaVerdict(next, x.wet, x.heavy, w),
    dress: dressAdvice(x, a),
    plan: planAdvice(x, a),
    gear: gearAdvice(x, a),
    risks,
    calm,
    days,
  };
}
