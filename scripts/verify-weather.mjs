import fs from 'node:fs';

const text = (html, id) => {
  const re = new RegExp('id="' + id + '"[^>]*>([\\s\\S]*?)<\\/', 'm');
  const m = html.match(re);
  if (!m) return '(none)';
  return m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};

for (const lang of ['en', 'zh', 'th']) {
  const html = fs.readFileSync('dist/' + lang + '/index.html', 'utf8');
  const seed = html.match(/id="wx-seed"[^>]*>([\s\S]*?)<\/script>/);
  const payload = seed ? JSON.parse(seed[1]) : null;
  console.log('=== ' + lang + ' | seed ' + (payload && payload.current ? 'OK' : 'NULL'));
  if (payload && payload.current) {
    console.log('   api temp ' + payload.current.temperature_2m + ' code ' + payload.current.weather_code +
      ' | daily max ' + payload.daily.temperature_2m_max[0] + ' min ' + payload.daily.temperature_2m_min[0] +
      ' uv ' + payload.daily.uv_index_max[0] + ' prob ' + payload.daily.precipitation_probability_max[0] +
      ' | alerts ' + JSON.stringify((payload.alerts || []).map((a) => a.event)));
  }
  console.log('   rendered: temp ' + text(html, 'w-temp') + ' | cond ' + text(html, 'w-cond') + ' | uv ' + text(html, 'w-uv') +
    ' | rain ' + text(html, 'w-rain') + ' | sun ' + text(html, 'w-sun') + ' | updated ' + text(html, 'w-updated'));
  console.log('   umbrella: ' + text(html, 'w-umbrella'));
  console.log('   dress: ' + text(html, 'w-dress'));
  console.log('   plan: ' + text(html, 'w-plan'));
  console.log('   risk block hidden: ' + /id="w-risk-wrap" class="hidden"/.test(html) +
    ' | calm line hidden: ' + /id="w-risk-clear" class="hidden"/.test(html));
  const gear = html.match(/id="w-gear"[^>]*>([\s\S]*?)<\/ul>/);
  console.log('   gear: ' + (gear ? gear[1].replace(/<[^>]+>/g, '  ').replace(/\s+/g, ' ').trim() : '(none)'));
  const days = html.match(/id="w-days"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/);
  console.log('   day cards: ' + (days ? (days[1].match(/text-2xl my-2/g) || []).length : 0));
  console.log('   leak check (api/key/free wording): ' +
    /Open-Meteo|OpenMeteo|no API key|免费的 API|无需密钥/.test(html));
}
