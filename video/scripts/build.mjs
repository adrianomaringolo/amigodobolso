#!/usr/bin/env node
/**
 * Monta a timeline do vídeo a partir da narração já gerada (voice.mjs):
 *
 *   build/timeline.js   início de cada cena e de cada palavra, em segundos absolutos,
 *                       mais os blocos da legenda — é o que a cena GSAP lê
 *   build/audio.m4a     voz nas posições certas + trilha bem baixa por baixo
 *   output/amigodobolso.pt-BR.vtt   legenda para o <track> do <video>
 *
 *   node video/scripts/build.mjs
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.join(ROOT, '..');
const BUILD = path.join(ROOT, 'build');
const OUT = path.join(ROOT, 'output');
fs.mkdirSync(BUILD, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'narracao.json'), 'utf8'));

const probe = f => parseFloat(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).stdout.toString());

// ── Cenas e palavras em tempo absoluto ───────────────────────────────────────
let t = cfg.lead;
const scenes = cfg.cenas.map((c, i) => {
  const name = `cena-${String(i + 1).padStart(2, '0')}`;
  const mp3 = path.join(ROOT, 'voz', `${name}.mp3`);
  let { words } = JSON.parse(fs.readFileSync(path.join(ROOT, 'voz', `${name}.json`), 'utf8'));
  // a legenda usa a pontuação de leitura (as reticências da voz viram vírgula ou nada)
  if (c.legenda) {
    const lw = c.legenda.split(' ');
    if (lw.length === words.length) words = words.map((w, i) => ({ ...w, w: lw[i] }));
    else console.warn(`⚠️  ${c.id}: legenda com ${lw.length} palavras, fala com ${words.length}; usando a fala`);
  }
  const audio = probe(mp3);
  const start = t;
  const dur = audio + cfg.gap + (c.hold || 0);
  t += dur;
  return {
    id: c.id, start: +start.toFixed(3), dur: +dur.toFixed(3), audio: +audio.toFixed(3), mp3,
    words: words.map(w => ({ w: w.w, start: +(start + w.start).toFixed(3), end: +(start + w.end).toFixed(3) })),
  };
});
const total = +(t + cfg.tail).toFixed(3);

// ── Blocos de legenda: uma linha, quebrando onde a fala respira ─────────────
// Corta em orações (pontuação) e junta as vizinhas enquanto couber numa linha;
// atravessar o fim de uma frase só se o bloco ficar curto.
const MAX = 56, SHORT = 42;
const text = ws => ws.map(x => x.w).join(' ');
const captions = [];
for (const s of scenes) {
  const clauses = [];
  let cur = [];
  for (const w of s.words) { cur.push(w); if (/[.,:;!?]$/.test(w.w)) { clauses.push(cur); cur = []; } }
  if (cur.length) clauses.push(cur);
  // oração que não cabe numa linha: corta na palavra mais perto do meio
  for (let k = 0; k < clauses.length; k++) {
    const c = clauses[k];
    if (text(c).length <= MAX) continue;
    let best = 1, diff = Infinity;
    for (let j = 1; j < c.length; j++) {
      const d = Math.abs(text(c.slice(0, j)).length - text(c.slice(j)).length);
      if (d < diff) { diff = d; best = j; }
    }
    clauses.splice(k, 1, c.slice(0, best), c.slice(best));
    k--;
  }
  let block = [];
  for (const c of clauses) {
    const joined = text([...block, ...c]).length;
    const endsSentence = block.length && /[.:!?]$/.test(block[block.length - 1].w);
    if (block.length && (joined > MAX || (endsSentence && joined > SHORT))) { captions.push(block); block = []; }
    block = [...block, ...c];
  }
  if (block.length) captions.push(block);
}
const cues = captions.map((ws, i) => {
  const next = captions[i + 1];
  const start = ws[0].start - 0.08;
  // fica até a próxima entrar, mas não atravessa um silêncio longo
  const end = Math.min(next ? next[0].start - 0.1 : total, ws[ws.length - 1].end + 0.9);
  return { start: +start.toFixed(3), end: +end.toFixed(3), words: ws };
});

fs.writeFileSync(path.join(BUILD, 'timeline.js'),
  `window.TIMELINE = ${JSON.stringify({ total, scenes: scenes.map(({ mp3, ...s }) => s), cues }, null, 2)};\n`);

// ── VTT ──────────────────────────────────────────────────────────────────────
const ts = s => {
  const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, sec = (s % 60).toFixed(3).padStart(6, '0');
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${sec}`;
};
fs.writeFileSync(path.join(OUT, 'amigodobolso.pt-BR.vtt'),
  'WEBVTT\n\n' + cues.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.words.map(w => w.w).join(' ')}\n`).join('\n'));

// ── Ícones Lucide (os mesmos do app), inline ────────────────────────────────
const ICONS = ['shopping-cart', 'piggy-bank', 'heart', 'smile', 'calendar-arrow-up', 'graduation-cap', 'clock',
  'calendar-range', 'tag', 'smartphone', 'monitor', 'chart-column', 'flag', 'plus', 'check', 'table'];
const icons = {};
for (const name of ICONS) {
  const src = fs.readFileSync(path.join(ROOT, '..', 'node_modules/lucide-react/dist/esm/icons', `${name}.js`), 'utf8');
  const node = JSON.parse(src.match(/const __iconNode = (\[[\s\S]*?\]);/)[1]
    .replace(/(\w+):/g, '"$1":').replace(/"(\w+)":\s*"/g, '"$1": "'));
  icons[name] = node.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== 'key')
    .map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
}
fs.writeFileSync(path.join(BUILD, 'icons.js'), `window.ICONS = ${JSON.stringify(icons)};\n`);

// ── Áudio: voz posicionada + trilha bem baixa, com fade ────────────────────
const music = path.resolve(ROOT, cfg.music.file.replace(/^~/, process.env.HOME));
// o TTS às vezes termina a fala com amostra alta: sem rampa, vira estalo no corte
const SUAVE = 'afade=t=in:d=0.02,areverse,afade=t=in:d=0.18,areverse';
const inputs = scenes.flatMap(s => ['-i', s.mp3]);
const voiceChains = scenes.map((s, i) => `[${i}:a]${SUAVE},adelay=${Math.round(s.start * 1000)}:all=1,aresample=44100[v${i}]`);
const mi = scenes.length;
const vol = cfg.music?.volume ?? 0.22;
const filter = [
  ...voiceChains,
  `${scenes.map((_, i) => `[v${i}]`).join('')}amix=inputs=${scenes.length}:normalize=0,apad=whole_dur=${total},asplit[vsc][vmix]`,
  `[${mi}:a]atrim=start=${cfg.music?.start ?? 0}:duration=${total},asetpts=PTS-STARTPTS,volume=${vol},afade=t=in:d=1.2,afade=t=out:st=${(total - 2.2).toFixed(2)}:d=2.2[bed]`,
  `[bed][vsc]sidechaincompress=threshold=0.04:ratio=4:attack=60:release=500[ducked]`,
  `[ducked][vmix]amix=inputs=2:normalize=0,alimiter=limit=0.95[out]`,
].join(';');
const r = spawnSync('ffmpeg', ['-y', ...inputs, '-i', music, '-filter_complex', filter, '-map', '[out]',
  '-t', String(total), '-c:a', 'aac', '-b:a', '192k', path.join(BUILD, 'audio.m4a')], { stdio: ['ignore', 'ignore', 'pipe'] });
if (r.status !== 0) { console.error(r.stderr.toString().slice(-2000)); process.exit(1); }

console.log(`\n⏱  ${total}s · ${scenes.length} cenas · ${cues.length} legendas`);
for (const s of scenes) console.log(`   ${s.start.toFixed(2).padStart(6)}s  ${s.id.padEnd(10)} ${s.dur.toFixed(2)}s`);
console.log('');
