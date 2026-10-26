/* global gsap */
// Uma timeline GSAP, pausada. Cada movimento começa na palavra da narração que
// fala dele (TIMELINE, gerado por scripts/build.mjs): trocar a voz ou o texto e
// rodar o build de novo já ressincroniza tudo. As coordenadas das telas são em
// px CSS da captura (celular 390 de largura, computador 1440; build/telas/caixas.json).

const T = window.TIMELINE;
const params = new URLSearchParams(location.search);
if (params.get('captions') === '0') document.documentElement.classList.add('no-captions');

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// o plano do método (alvos fixos do método Dolfyn); renda de exemplo, a mesma da conta fictícia
const RENDA = 5400;
const PLANO = [
  ['shopping-cart', 'Necessidades Essenciais', 55, '#09659c'],
  ['piggy-bank', 'Tranquilidade Financeira', 10, '#16324f'],
  ['heart', 'Fazer Pelo Outro', 5, '#be2f26'],
  ['smile', 'Diversão', 10, '#f28e38'],
  ['calendar-arrow-up', 'Compras de Longo Prazo', 10, '#f0a017'],
  ['graduation-cap', 'Desenvolvimento Pessoal', 10, '#5b93bf'],
];
const brl = (v) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
const icon = (n) => `<svg viewBox="0 0 24 24">${window.ICONS[n]}</svg>`;
$('.plan__bar').innerHTML = PLANO.map(([, , p, c]) => `<i style="flex:${p};background:${c}"></i>`).join('');
$('.plan__rows').innerHTML = PLANO.map(([ic, n, p, c]) =>
  `<li><span class="ic" style="background:${c}">${icon(ic)}</span><span>${n}</span><span class="pct">${p}%</span><span class="val">${brl(RENDA * p / 100)}</span></li>`).join('');
$$('.tile').forEach((t) => { $('.tile__ic', t).innerHTML = icon(t.dataset.i); });

window.__ready = Promise.all([document.fonts.ready, ...$$('img').map((i) => i.decode().catch(() => {}))]).then(() => { build(); return true; });

function build() {
// ── Tempo: cena e palavra ──────────────────────────────────────────────────
const scene = (id) => T.scenes.find((s) => s.id === id);
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
/** início da palavra `needle` (a n-ésima) dentro da cena; palavra curta só casa inteira */
function W(id, needle, nth = 0) {
  const n = norm(needle);
  const hits = scene(id).words.filter((w) => (n.length <= 3 ? norm(w.w) === n : norm(w.w).startsWith(n)));
  if (!hits[nth]) throw new Error(`palavra "${needle}" não está na cena ${id}`);
  return hits[nth].start;
}
const S = (id) => scene(id).start;

gsap.defaults({ ease: 'power2.out', duration: 0.8 });
const tl = gsap.timeline({ paused: true });

// ── Peças ──────────────────────────────────────────────────────────────────
const phone = $('.phone');
const win = $('.win');
const sheet = $('.sheet');
const tint = $('.sheet__tint');
const brand = $('.brand');
const scr = (n) => $(`.scr[data-s="${n}"]`);
const dscr = (n) => $(`.dscr[data-s="${n}"]`);
const POSE = {
  phone: { x: 1290, y: 86, scale: 0.95 },
  phoneMapa: { x: 1500, y: 236, scale: 0.78 },
  win: { x: 720, y: 150, scale: 1 },
};

gsap.set(['.s-head', '.brand', '.flags', '.flags__kicker', '.flag', '.copy', '.copy li', '.plan', '.plan__rows li', '.stamp',
  '.legend .lg', '.tiles .tile', '.win', '.phone', '.scr', '.dscr', '.s-end', '.end-logo', '.end-name', '.end-line', '.end-url', '.end-project', '.end-credit'], { autoAlpha: 0 });
gsap.set('.hw', { autoAlpha: 0, y: 30 });
gsap.set(sheet, { y: 1200 });
gsap.set('.plan__bar i', { scaleX: 0 });

// a trama do campo azul desliza devagar o vídeo inteiro
tl.to('.field__hatch', { x: 180, duration: T.total, ease: 'none' }, 0);

/** troca a tela visível de um aparelho, com uma fusão curta */
const current = new Map();
function showScreen(box, el, at, dur = 0.4) {
  const prev = current.get(box);
  tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur, ease: 'power1.inOut', immediateRender: false }, at);
  if (prev && prev !== el) tl.set(prev, { autoAlpha: 0 }, at + dur);
  current.set(box, el);
}
function scrollTo(el, y, at, dur = 1.3) {
  tl.to($('.page', el), { y: -y, duration: dur, ease: 'power2.inOut' }, at);
}
/** contorno de destaque: aparece no primeiro retângulo e desliza para os seguintes */
const ringOn = new Set();
function ring(el, [x, y, w, h], at, dur = 0.6) {
  const r = $('.ring', el);
  const pad = r.classList.contains('ring--d') ? 8 : 5;
  const box = { left: x - pad, top: y - pad, width: w + 2 * pad, height: h + 2 * pad };
  if (!ringOn.has(r)) {
    tl.set(r, box, at);
    tl.fromTo(r, { autoAlpha: 0, scale: 1.05 }, { autoAlpha: 1, scale: 1, duration: 0.45, immediateRender: false }, at);
    ringOn.add(r);
  } else tl.to(r, { ...box, duration: dur, ease: 'power2.inOut' }, at);
}
function ringOff(el, at) {
  const r = $('.ring', el);
  tl.to(r, { autoAlpha: 0, duration: 0.3 }, at);
  ringOn.delete(r);
}
/** toque no celular, em coordenadas da tela */
function tap(x, y, at) {
  tl.set('.tap', { left: x, top: y }, at);
  tl.fromTo('.tap', { autoAlpha: 0.95, scale: 0.35 }, { autoAlpha: 0, scale: 1.5, duration: 0.6, ease: 'power1.out', immediateRender: false }, at);
}
function copyIn(id, at) {
  const c = $(`.copy[data-c="${id}"]`);
  tl.fromTo(c, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.8, immediateRender: false }, at);
  return c;
}
function item(c, i, at) {
  tl.fromTo($$('li', c)[i], { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.55, immediateRender: false }, at);
}
function out(els, at, dy = -16) { tl.to(els, { autoAlpha: 0, y: `+=${dy}`, duration: 0.5, ease: 'power1.in' }, at); }

// ── 1 · O mês acabou… pra onde foi o seu dinheiro? ─────────────────────────
tl.set('.s-head', { autoAlpha: 1 }, 0);
const hw = $$('.hw');
const HEAD = [['O', 0], ['mes', 0], ['acabou', 0], ['pra', 0], ['onde', 0], ['foi', 0], ['o', 1], ['seu', 0], ['dinheiro', 0]];
HEAD.forEach(([n, k], i) => tl.to(hw[i], { autoAlpha: 1, y: 0, duration: 0.6 }, W('pergunta', n, k) - 0.1));
tl.fromTo('.hw--hot', { scale: 1 }, { scale: 1.06, duration: 0.35, yoyo: true, repeat: 1, ease: 'power1.inOut', immediateRender: false }, W('pergunta', 'dinheiro') + 0.5);

// as despesas do mês (da conta fictícia) entram e vão sumindo pra cima
const BILLS = [
  ['Aluguel', '− R$ 1.500,00', 140, 120, -3],
  ['Mercado do mês', '− R$ 620,00', 1380, 140, 3],
  ['Cinema e pizza', '− R$ 210,00', 90, 760, 2],
  ['Show no sábado', '− R$ 260,00', 1430, 760, -3],
  ['Conta de luz', '− R$ 180,00', 760, 70, 1],
  ['Notebook (2/6)', '− R$ 350,00', 120, 440, -2],
  ['Passagens', '− R$ 300,00', 1500, 450, 2],
  ['Curso de inglês', '− R$ 150,00', 740, 860, -1],
];
const bills = BILLS.map(([t, v, x, y, r]) => {
  const b = document.createElement('div');
  b.className = 'bill';
  b.innerHTML = `<span>${t}</span><b>${v}</b>`;
  gsap.set(b, { left: x, top: y, rotation: r, autoAlpha: 0, y: 40 });
  $('.bills').appendChild(b);
  return b;
});
const b0 = W('pergunta', 'acabou') - 0.2;
bills.forEach((b, i) => {
  tl.to(b, { autoAlpha: 1, y: 0, duration: 0.7 }, b0 + i * 0.32);
  // o dinheiro vai embora: sobe e some
  tl.to(b, { autoAlpha: 0, y: -120, rotation: `+=${i % 2 ? 5 : -5}`, duration: 1.6, ease: 'power1.in' }, W('pergunta', 'foi') + i * 0.12);
});
tl.to('.s-head', { autoAlpha: 0, y: -30, duration: 0.6, ease: 'power1.in' }, S('marca') - 0.4);

// ── 2 · A marca e as bandeiras ─────────────────────────────────────────────
const bw = brand.offsetWidth, bh = brand.offsetHeight;
gsap.set(brand, { x: (1920 - bw) / 2, y: 300 });
tl.fromTo(brand, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 1.0, immediateRender: false }, W('marca', 'Amigo') - 0.3);
tl.set('.flags', { autoAlpha: 1 }, W('marca', 'conta') - 0.4);
tl.fromTo('.flags__kicker', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, immediateRender: false }, W('marca', 'conta') - 0.4);
$$('.flag').forEach((f, i) => {
  const at = W('marca', 'bandeiras') - 0.15 + i * 0.22;
  tl.fromTo(f, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'back.out(1.6)', immediateRender: false }, at);
  // o pano tremula um pouco enquanto está no ar
  tl.fromTo($('.cloth', f), { skewY: 0, scaleX: 1 }, { skewY: 6, scaleX: 0.93, duration: 0.55, ease: 'sine.inOut', yoyo: true, repeat: 5, immediateRender: false }, at + 0.3);
});
tl.to('.flags', { autoAlpha: 0, y: 40, duration: 0.6, ease: 'power1.in' }, S('metodo') - 0.4);

// a folha de papel sobe e a marca vai para o canto, em tinta
tl.to(sheet, { y: -20, duration: 1.2, ease: 'power3.inOut' }, S('metodo') - 0.3);
tl.to(brand, { x: 150, y: 54, scale: 0.4, color: '#16324f', duration: 1.2, ease: 'power3.inOut' }, S('metodo') - 0.3);

// ── 3 · O método: seis categorias, cada uma com o seu alvo ─────────────────
let c = copyIn('metodo', S('metodo') + 0.5);
tl.fromTo('.plan', { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power3.out', immediateRender: false }, W('metodo', 'renda') - 0.3);
tl.to('.plan__bar i', { scaleX: 1, duration: 0.7, stagger: 0.16, ease: 'power2.inOut' }, W('metodo', 'seis') - 0.1);
tl.fromTo('.plan__rows li', { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.16, immediateRender: false }, W('metodo', 'seis'));
tl.to('.plan__rows .pct', { color: '#f28e38', scale: 1.18, duration: 0.3, stagger: 0.09, yoyo: true, repeat: 1, ease: 'power1.inOut' }, W('metodo', 'alvo') - 0.1);
tl.fromTo('.stamp', { autoAlpha: 0, scale: 1.7, rotation: -14 }, { autoAlpha: 1, scale: 1, rotation: -7, duration: 0.45, ease: 'power3.in', immediateRender: false }, W('metodo', 'planilha') - 0.05);
out([c, '.plan'], S('lancar') - 0.45);

// ── 4 · Lançar: o valor, a descrição, a categoria… e pronto ────────────────
tl.fromTo(tint, { autoAlpha: 0, x: 200 }, { autoAlpha: 1, x: 0, duration: 1.0, ease: 'power3.out', immediateRender: false }, S('lancar') - 0.3);
gsap.set(phone, POSE.phone);
showScreen(phone, scr('lancamentos'), S('lancar') - 0.1, 0.01);
tl.fromTo(phone, { autoAlpha: 0, y: POSE.phone.y + 140 }, { autoAlpha: 1, y: POSE.phone.y, duration: 1.1, ease: 'power3.out', immediateRender: false }, S('lancar') - 0.1);
c = copyIn('lancar', S('lancar') + 0.3);
ring(scr('lancamentos'), [16, 263, 358, 44], W('lancar', 'lanca') - 0.1);
tap(195, 285, W('lancar', 'entra'));
ringOff(scr('lancamentos'), W('lancar', 'entra'));
showScreen(phone, scr('form'), W('lancar', 'entra') + 0.2, 0.3);
tl.fromTo($('.page', scr('form')), { y: 80 }, { y: 0, duration: 0.6, ease: 'power3.out', immediateRender: false }, W('lancar', 'entra') + 0.2);
item(c, 0, W('lancar', 'valor'));
ring(scr('form'), [33, 119, 324, 64], W('lancar', 'valor'));
item(c, 1, W('lancar', 'descricao'));
ring(scr('form'), [33, 199, 324, 40], W('lancar', 'descricao'));
item(c, 2, W('lancar', 'categoria'));
tap(195, 325, W('lancar', 'categoria') - 0.25);
showScreen(phone, scr('categorias'), W('lancar', 'categoria'), 0.3);
ring(scr('categorias'), [38, 360, 316, 36], W('lancar', 'categoria') + 0.3);
tap(195, 378, W('lancar', 'pronto') - 0.75);
ringOff(scr('categorias'), W('lancar', 'pronto') - 0.7);
showScreen(phone, scr('preenchido'), W('lancar', 'pronto') - 0.6, 0.25);
tap(195, 737, W('lancar', 'pronto') - 0.1);
showScreen(phone, scr('salvo'), W('lancar', 'pronto') + 0.15, 0.35);
out(c, S('bandeiras') - 0.4);

// ── 5 · As bandeiras ───────────────────────────────────────────────────────
showScreen(phone, scr('inicio'), S('bandeiras') - 0.2, 0.45);
c = copyIn('bandeiras', S('bandeiras') + 0.1);
ring(scr('inicio'), [17, 180, 356, 192], W('bandeiras', 'bandeira') - 0.1);
const FLAGS = [
  ['azul', 300, [16, 437, 358, 165], '#09659c'],
  ['amarela', 640, [16, 941, 358, 165], '#f0a017'],
  ['vermelha', 640, [16, 1109, 358, 165], '#be2f26'],
];
FLAGS.forEach(([w, y, box, cor], i) => {
  const at = W('bandeiras', w);
  if (i < 2) scrollTo(scr('inicio'), y, at - 0.5, 1.1);
  ring(scr('inicio'), box, at + 0.1);
  tl.fromTo($$('.legend .lg')[i], { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.6, immediateRender: false }, at);
  tl.to(tint, { backgroundColor: cor, duration: 0.6, ease: 'power1.inOut' }, at);
});
ringOff(scr('inicio'), S('relatorios') - 0.5);
out([c, '.legend'], S('relatorios') - 0.45);
tl.to(phone, { autoAlpha: 0, x: POSE.phone.x + 160, duration: 0.7, ease: 'power1.in' }, S('relatorios') - 0.5);
tl.to(tint, { autoAlpha: 0, x: 200, duration: 0.8, ease: 'power1.in' }, S('relatorios') - 0.4);

// ── 6 · Relatórios: computador, e o celular junto ──────────────────────────
gsap.set(win, POSE.win);
showScreen(win, dscr('relatorios'), S('relatorios') - 0.2, 0.01);
tl.fromTo(win, { autoAlpha: 0, x: POSE.win.x + 120 }, { autoAlpha: 1, x: POSE.win.x, duration: 1.1, ease: 'power3.out', immediateRender: false }, S('relatorios') - 0.2);
c = copyIn('relatorios', S('relatorios') + 0.2);
item(c, 0, W('relatorios', 'mes'));
ring(dscr('relatorios'), [232, 335, 976, 71], W('relatorios', 'mes'));
item(c, 1, W('relatorios', 'ano'));
ring(dscr('relatorios'), [883, 181, 325, 36], W('relatorios', 'ano'));
item(c, 2, W('relatorios', 'categoria'));
scrollTo(dscr('relatorios'), 250, W('relatorios', 'categoria') - 0.3, 1.2);
ring(dscr('relatorios'), [232, 426, 976, 335], W('relatorios', 'categoria') + 0.3, 0.8);
ringOff(dscr('relatorios'), W('relatorios', 'celular') + 0.2);
showScreen(phone, scr('mapa'), W('relatorios', 'celular') - 0.4, 0.01);
tl.fromTo(phone, { autoAlpha: 0, x: POSE.phoneMapa.x, y: POSE.phoneMapa.y + 140, scale: POSE.phoneMapa.scale },
  { autoAlpha: 1, y: POSE.phoneMapa.y, duration: 1.1, ease: 'power3.out', immediateRender: false }, W('relatorios', 'celular') - 0.4);
tl.to(win, { x: POSE.win.x - 90, duration: 1.1, ease: 'power3.inOut' }, W('relatorios', 'celular') - 0.4);
out([c, win, phone], S('extras') - 0.45, -24);

// ── 7 · E tem mais ─────────────────────────────────────────────────────────
c = copyIn('extras', S('extras') + 0.1);
['pendentes', 'parcelas', 'etiquetas', 'Dica'].forEach((w, i) => {
  tl.fromTo($$('.tiles .tile')[i], { autoAlpha: 0, y: 60, rotation: i % 2 ? 2 : -2 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.7, ease: 'back.out(1.5)', immediateRender: false }, W('extras', w) - 0.15);
});
tl.to('.tiles .tile', { y: -10, duration: 1.2, stagger: 0.15, yoyo: true, repeat: 1, ease: 'sine.inOut' }, W('extras', 'aprender'));
out([c, '.tiles'], S('fecho') - 0.5, -20);
tl.to(sheet, { y: 1200, duration: 1.1, ease: 'power3.inOut' }, S('fecho') - 0.5);
tl.to(brand, { autoAlpha: 0, duration: 0.4 }, S('fecho') - 0.5);

// ── 8 · Fecho ──────────────────────────────────────────────────────────────
tl.set('.s-end', { autoAlpha: 1 }, S('fecho'));
const nome = W('fecho', 'Amigo');
tl.fromTo('.end-logo', { autoAlpha: 0, scale: 0.85, rotation: -20 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.1, ease: 'back.out(1.4)', immediateRender: false }, nome - 0.5);
tl.fromTo('.end-name', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, immediateRender: false }, nome - 0.2);
tl.fromTo('.end-url', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)', immediateRender: false }, W('fecho', 'gratis') - 0.1);
tl.fromTo('.end-line', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, immediateRender: false }, W('fecho', 'descubra') - 0.2);
tl.fromTo('.end-project', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, immediateRender: false }, W('fecho', 'projeto') - 0.15);
tl.fromTo('.end-credit', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 1.4, ease: 'power1.out' }, T.cues[T.cues.length - 1].end + 0.2);

// ── Legenda: o bloco inteiro aparece, cada palavra acende quando é dita ────
const cap = $('.cap');
gsap.set('.captions', { autoAlpha: 0 });
let shown = -1;
function renderCap(i) {
  if (i === shown) return;
  shown = i;
  cap.innerHTML = i < 0 ? '' : T.cues[i].words.map((w) => `<span class="cw">${w.w}</span>`).join(' ');
}
// legenda é derivada do tempo: recalculada a cada quadro, para frente ou para trás
function updateCaptions(t) {
  const i = T.cues.findIndex((q) => t >= q.start && t < q.end);
  gsap.set('.captions', { autoAlpha: i < 0 ? 0 : 1 });
  renderCap(i);
  if (i < 0) return;
  T.cues[i].words.forEach((w, j) => {
    const k = gsap.utils.clamp(0, 1, (t - w.start + 0.04) / 0.22);
    cap.children[j].style.opacity = String(0.45 + 0.55 * k);
  });
}

tl.to({}, { duration: 0.001 }, T.total - 0.001);

window.__total = T.total;
window.__seek = (t) => { tl.time(t, false); updateCaptions(t); };
}

window.__ready.then(() => {
  if (params.has('play')) {
    const audio = new Audio('build/audio.m4a');
    const t0 = parseFloat(params.get('t') || '0');
    audio.currentTime = t0;
    audio.play().catch(() => {});
    const start = performance.now() - t0 * 1000;
    gsap.ticker.add(() => window.__seek(Math.min(T.total, (performance.now() - start) / 1000)));
  } else {
    window.__seek(parseFloat(params.get('t') || '0'));
  }
});
