/**
 * Branch coverage for the weather advice engine (npm run test:weather).
 * Compiles src/lib/weather.ts to .tmp, runs synthetic weather days through
 * buildView() and checks the copy that each condition produces.
 */
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const require = createRequire(import.meta.url);

execFileSync(
  process.execPath,
  [
    'node_modules/typescript/bin/tsc',
    'src/lib/weather.ts',
    '--outDir',
    '.tmp',
    '--module',
    'commonjs',
    '--target',
    'es2022',
    '--moduleResolution',
    'node',
    '--skipLibCheck',
    '--esModuleInterop',
  ],
  { stdio: 'inherit' }
);
fs.writeFileSync('.tmp/package.json', '{ "type": "commonjs" }\n', 'utf8');

const { buildView } = require('../.tmp/lib/weather.js');
const w = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8')).weather;

const opts = { locale: 'en-GB', timeZone: 'Asia/Bangkok', lang: 'en' };
const day = (o) => ({
  current: {
    temperature_2m: o.temp,
    apparent_temperature: o.feels ?? o.temp,
    relative_humidity_2m: o.humidity ?? 70,
    weather_code: o.code,
    wind_speed_10m: o.wind ?? 5,
    wind_gusts_10m: o.gust ?? 8,
  },
  hourly: {
    time: Array.from({ length: 12 }, (_, i) => new Date(Date.now() + i * 3600000).toISOString()),
    precipitation_probability: Array.from({ length: 12 }, () => o.next ?? 5),
  },
  daily: {
    time: Array.from({ length: 7 }, (_, i) => new Date(Date.now() + i * 86400000).toISOString().slice(0, 10)),
    weather_code: Array.from({ length: 7 }, () => o.code),
    temperature_2m_max: Array.from({ length: 7 }, () => o.tmax),
    temperature_2m_min: Array.from({ length: 7 }, () => o.tmin),
    precipitation_probability_max: Array.from({ length: 7 }, () => o.prob ?? 10),
    uv_index_max: Array.from({ length: 7 }, () => o.uv ?? 4),
    wind_speed_10m_max: Array.from({ length: 7 }, () => o.wind ?? 10),
    sunrise: Array.from({ length: 7 }, (_, i) => new Date(Date.now() + i * 86400000).toISOString().slice(0, 10) + 'T06:00'),
    sunset: Array.from({ length: 7 }, (_, i) => new Date(Date.now() + i * 86400000).toISOString().slice(0, 10) + 'T18:10'),
  },
  alerts: o.alerts || [],
});

const cases = [
  { name: 'thunderstorm', data: day({ code: 95, temp: 27, tmax: 28, tmin: 24, uv: 3, prob: 90, next: 85 }), expect: { dress: 'dStorm', plan: 'pThunder', risks: ['rThunder', 'rRain'], calm: false } },
  { name: 'heavy rain', data: day({ code: 65, temp: 23, tmax: 24, tmin: 22, uv: 2, prob: 95, next: 90 }), expect: { dress: 'dStorm', plan: 'pHeavy', risks: ['rRain'], calm: false } },
  { name: 'light drizzle', data: day({ code: 51, temp: 26, tmax: 29, tmin: 23, uv: 5, prob: 70, next: 65 }), expect: { dress: 'dRain', plan: 'pChance', risks: [], calm: false } },
  { name: 'clear and hot', data: day({ code: 0, temp: 34, tmax: 36, tmin: 27, uv: 9, prob: 5, next: 0 }), expect: { dress: 'dHot', plan: 'pHot', risks: [], calm: true } },
  { name: 'fog', data: day({ code: 45, temp: 21, tmax: 27, tmin: 19, uv: 3, prob: 20, next: 10 }), expect: { dress: 'dMild', plan: 'pFog', risks: ['rFog'], calm: false } },
  { name: 'gale', data: day({ code: 3, temp: 25, tmax: 28, tmin: 24, uv: 4, wind: 58, gust: 75, prob: 20, next: 10 }), expect: { dress: 'dWind', plan: 'pWind', risks: ['rGale'], calm: false } },
  { name: 'cold snap', data: day({ code: 3, temp: 8, tmax: 9, tmin: 4, uv: 2, prob: 10, next: 5 }), expect: { dress: 'dCold', plan: 'pOvercast', risks: [], calm: true } },
  { name: 'settled clear', data: day({ code: 1, temp: 26, tmax: 30, tmin: 21, uv: 7, prob: 10, next: 5 }), expect: { dress: 'dLayers', plan: 'pClear', risks: [], calm: true } },
  {
    name: 'valley cloud morning',
    data: day({ code: 1, temp: 19, tmax: 30, tmin: 18, uv: 6, humidity: 92, prob: 10, next: 5 }),
    now: new Date('2026-09-14T06:30:00+07:00'),
    expect: { dress: 'dLayers', plan: 'pCloudSea', risks: [], calm: true },
  },
  {
    name: 'same day at noon',
    data: day({ code: 1, temp: 30, tmax: 33, tmin: 18, uv: 9, humidity: 92, prob: 10, next: 5 }),
    now: new Date('2026-09-14T12:30:00+07:00'),
    expect: { dress: 'dHot', plan: 'pHot', risks: [], calm: true },
  },
  {
    name: 'official alert',
    data: day({ code: 63, temp: 24, tmax: 26, tmin: 23, prob: 88, next: 80, alerts: [{ event: 'Heavy Rain Warning' }] }),
    expect: { dress: 'dStorm', plan: 'pHeavy', risks: ['rAlert', 'rRain'], calm: false },
  },
];

let failed = 0;
for (const c of cases) {
  const v = buildView(c.data, w, c.now ? { ...opts, now: c.now } : opts);
  const keys = (t) => Object.entries(w.advice).filter(([, text]) => text && text === t).map(([k]) => k);
  const got = {
    dress: keys(v.dress).join('|'),
    plan: keys(v.plan).join('|'),
    risks: v.risks.map((r) => (r.includes('Heavy Rain Warning') ? 'rAlert' : keys(r).join('|'))),
    calm: v.calm,
  };
  const ok =
    got.dress === c.expect.dress &&
    got.plan === c.expect.plan &&
    got.calm === c.expect.calm &&
    JSON.stringify(got.risks) === JSON.stringify(c.expect.risks);
  if (!ok) failed++;
  console.log(
    (ok ? 'PASS ' : 'FAIL ') + c.name.padEnd(16) +
    ' dress=' + got.dress + ' plan=' + got.plan + ' calm=' + got.calm + ' risks=[' + got.risks.join(',') + ']' +
    ' gear=' + v.gear.length + ' umbrella="' + v.umbrella.slice(0, 28) + '…"'
  );
  if (!ok) console.log('      expected ' + JSON.stringify(c.expect));
}
console.log(failed ? `\n${failed} case(s) failed` : '\nall advice branches behave as designed');
fs.rmSync('.tmp', { recursive: true, force: true });
process.exit(failed ? 1 : 0);
