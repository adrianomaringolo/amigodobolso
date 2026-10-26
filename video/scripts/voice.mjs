#!/usr/bin/env node
/**
 * Narração do vídeo do produto com o ElevenLabs, com o tempo de cada palavra.
 *
 *   node video/scripts/voice.mjs                     # todas as cenas → video/voz/
 *   node video/scripts/voice.mjs --only 2,5          # só essas cenas
 *   node video/scripts/voice.mjs --voice-id <id>     # outra voz (sobrescreve narracao.json)
 *   node video/scripts/voice.mjs --model eleven_v3   # outro modelo
 *   node video/scripts/voice.mjs --out <dir> --only 1,2   # amostras de voz noutra pasta
 *   node video/scripts/voice.mjs --sotaque "[Brazilian Portuguese accent]"  # tag antes de cada fala (eleven_v3)
 *
 * Usa o endpoint /with-timestamps: além do mp3, grava cena-NN.json com o
 * início e o fim de cada palavra. É isso que faz a legenda bater com a fala
 * sem adivinhar por silêncio.
 *
 * Chave: ELEVENLABS_API_KEY no ambiente, em video/.env ou no .env dos reels
 * do portfolio (só precisa de text_to_speech).
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

for (const envPath of [
  path.join(ROOT, '.env'),
  path.join(os.homedir(), 'Projects/personal/adrianomaringolo.dev/instagram-reels/.env'),
]) {
  if (!fs.existsSync(envPath)) continue;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) { console.error('ELEVENLABS_API_KEY não definida.'); process.exit(1); }

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'narracao.json'), 'utf8'));
const voiceId = opt('--voice-id') || cfg.voice_id;
const model = opt('--model') || cfg.model;
const only = opt('--only')?.split(',').map(Number);
const sotaque = opt('--sotaque') ?? cfg.sotaque ?? '';
const outDir = opt('--out') ? path.resolve(opt('--out')) : path.join(ROOT, 'voz');
fs.mkdirSync(outDir, { recursive: true });

// Caracteres com tempo → palavras com tempo (a pontuação fica grudada na palavra).
function words(alignment) {
  const { characters: ch, character_start_times_seconds: st, character_end_times_seconds: en } = alignment;
  const out = [];
  let cur = null;
  ch.forEach((c, i) => {
    if (/\s/.test(c)) { if (cur) out.push(cur); cur = null; return; }
    if (!cur) cur = { w: '', start: st[i], end: en[i] };
    cur.w += c;
    cur.end = en[i];
  });
  if (cur) out.push(cur);
  // tags de direção do eleven_v3 ([calmly]) e reticências são para a voz, não para a legenda
  // (uma tag pode ter várias palavras: [Brazilian Portuguese accent])
  let dentro = false;
  return out
    .filter(w => {
      const era = dentro || w.w.startsWith('[');
      dentro = era && !w.w.endsWith(']');
      return !era;
    })
    .map(w => ({ ...w, w: w.w.replace(/\.\.\.|…/g, '') }))
    .filter(w => w.w)
    .map(w => ({ ...w, start: +w.start.toFixed(3), end: +w.end.toFixed(3) }));
}

console.log(`\n🎙️  voz ${voiceId} · ${model}\n`);
for (const [i, cena] of cfg.cenas.entries()) {
  if (only && !only.includes(i + 1)) continue;
  const name = `cena-${String(i + 1).padStart(2, '0')}`;
  // só o eleven_v3 entende as tags de direção; os outros modelos as leriam em voz alta
  const text = model === 'eleven_v3' ? `${sotaque} ${cena.text}`.trim() : cena.text.replace(/\[[^\]]*\]\s*/g, '');
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: model, language_code: 'pt', voice_settings: { ...cfg.voice_settings, ...(model === 'eleven_v3' ? {} : { speed: 0.88 }) } }),
  });
  if (!res.ok) { console.error(`  ❌  ${name}: ${res.status} ${await res.text()}`); process.exitCode = 1; continue; }
  const data = await res.json();
  fs.writeFileSync(path.join(outDir, `${name}.mp3`), Buffer.from(data.audio_base64, 'base64'));
  fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify({ text: cena.text.replace(/\[[^\]]*\]\s*/g, ''), words: words(data.alignment) }, null, 2));
  console.log(`  ✅  ${name}  ${cena.text}`);
}
console.log(`\n  Saída: ${outDir}\n`);
