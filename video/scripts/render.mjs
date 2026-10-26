#!/usr/bin/env node
/**
 * Renderiza a composição GSAP quadro a quadro e junta com o áudio.
 *
 *   node video/scripts/render.mjs                  # output/amigodobolso.mp4 (legenda queimada)
 *   node video/scripts/render.mjs --clean          # output/amigodobolso-limpo.mp4 (sem legenda, para usar o .vtt)
 *   node video/scripts/render.mjs --snap 2,9.5,23  # só PNGs desses instantes + grade, para revisar
 *   node video/scripts/render.mjs --fps 30
 *
 * Não grava a tela: posiciona a timeline (window.__seek) e fotografa. O vídeo
 * sai idêntico a cada render, sem quadro perdido, em qualquer máquina.
 */

import fs from 'fs';
import path from 'path';
import { spawn, spawnSync } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';
import { chromium } from '@playwright/test';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'output');
fs.mkdirSync(OUT, { recursive: true });

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const clean = args.includes('--clean');
const fps = parseInt(opt('--fps') || '30', 10);
const snap = opt('--snap')?.split(',').map(Number);

const url = pathToFileURL(path.join(ROOT, 'index.html')).href + (clean ? '?captions=0' : '');
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', e => { console.error('Erro na página:', e.message); process.exitCode = 1; });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => window.__ready);
const total = await page.evaluate(() => window.__total);

if (snap) {
  const dir = path.join(OUT, 'snapshots');
  fs.mkdirSync(dir, { recursive: true });
  const files = [];
  for (const t of snap) {
    await page.evaluate(t => window.__seek(t), t);
    const f = path.join(dir, `t-${t.toFixed(2)}.png`);
    await page.screenshot({ path: f });
    files.push(f);
  }
  await browser.close();
  // grade de 3 colunas, na ordem dos instantes pedidos
  const cols = Math.min(3, files.length);
  const inputs = files.flatMap(f => ['-i', f]);
  const labeled = files.map((f, i) => `[${i}:v]scale=640:-1[v${i}]`);
  const rows = Math.ceil(files.length / cols);
  const pad = Array.from({ length: rows * cols - files.length }, (_, i) => `color=c=white:s=640x360:d=1[p${i}]`);
  const all = [...files.map((_, i) => `[v${i}]`), ...pad.map((_, i) => `[p${i}]`)].join('');
  const layout = Array.from({ length: rows * cols }, (_, i) => `${(i % cols) * 640}_${Math.floor(i / cols) * 360}`).join('|');
  const filter = [...labeled, ...pad, `${all}xstack=inputs=${rows * cols}:layout=${layout}`].join(';');
  spawnSync('ffmpeg', ['-y', ...inputs, '-filter_complex', filter, '-frames:v', '1', path.join(dir, 'grid.png')], { stdio: 'ignore' });
  console.log(`\n📸  ${files.length} quadros → ${path.join(dir, 'grid.png')}\n`);
  process.exit();
}

const name = clean ? 'amigodobolso-limpo' : 'amigodobolso';
const out = path.join(OUT, `${name}.mp4`);
const audio = path.join(ROOT, 'build', 'audio.m4a');
const frames = Math.round(total * fps);

const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
  '-i', audio, '-map', '0:v', '-map', '1:a',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-tune', 'animation',
  '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'ignore', 'pipe'] });
let ffErr = '';
ff.stderr.on('data', d => { ffErr = (ffErr + d).slice(-3000); });

const t0 = Date.now();
for (let i = 0; i < frames; i++) {
  await page.evaluate(t => window.__seek(t), i / fps);
  const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % fps === 0) process.stdout.write(`\r  ${name}: ${(i / fps).toFixed(0)}s / ${total.toFixed(0)}s`);
}
ff.stdin.end();
await browser.close();
const code = await new Promise(r => ff.on('close', r));
if (code !== 0) { console.error('\nffmpeg falhou:\n' + ffErr); process.exit(1); }
console.log(`\r  ✅  ${out}  (${frames} quadros, ${((Date.now() - t0) / 1000).toFixed(0)}s)\n`);
