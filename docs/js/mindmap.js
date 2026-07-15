// ════════════════════════════════════════════════════════════
// mindmap.js — Vẽ mindmap bằng Mind-Elixir + xuất ảnh
// Thử CDN trước; nếu mạng chặn thì tự dùng bản kèm theo trong _vendor/.
// ════════════════════════════════════════════════════════════

const VER = '5.13.0';
const SOURCES = [
  { js: `https://cdn.jsdelivr.net/npm/mind-elixir@${VER}/dist/MindElixir.js`,
    css: `https://cdn.jsdelivr.net/npm/mind-elixir@${VER}/dist/MindElixir.css` },
  { js: '/_vendor/MindElixir.js', css: '/_vendor/MindElixir.css' }, // dự phòng offline
];

let MindElixir = null;
let instance = null;
let loadPromise = null;

function addCss(href) {
  if ([...document.querySelectorAll('link[data-me-css]')].some(l => l.href.includes(href))) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute('data-me-css', '1');
  document.head.appendChild(link);
}

export async function ensureLibrary() {
  if (MindElixir) return MindElixir;
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    let lastErr;
    for (const src of SOURCES) {
      try {
        const mod = await import(src.js);
        addCss(src.css);
        MindElixir = mod.default || mod.MindElixir || mod;
        return MindElixir;
      } catch (e) { lastErr = e; }
    }
    throw lastErr;
  })();
  return loadPromise;
}

const THEME = {
  name: 'opex',
  palette: ['#b8893b', '#5e6f53', '#8f6627', '#5c5246', '#a3552b', '#6b7a8f'],
  cssVar: {
    '--main-color': '#2b2622', '--main-bgcolor': '#f4f0e6',
    '--color': '#2b2622', '--bgcolor': '#efe9da',
    '--root-color': '#ffffff', '--root-bgcolor': '#b8893b',
    '--root-border-color': '#8f6627',
    '--main-radius': '12px', '--topic-padding': '8px',
    '--line-color': '#b8893b', '--line-width': '2px',
    '--selected': '#5e6f53',
    '--panel-color': '#2b2622', '--panel-bgcolor': '#f4f0e6',
  },
};

export async function renderMindmap(containerId, mindData) {
  try {
    await ensureLibrary();
  } catch (e) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = `<div style="padding:40px;text-align:center;color:var(--ink-faint);font-style:italic;font-family:var(--font-display)">
      Chưa tải được thư viện mindmap. Cần mạng ở lần đầu, hoặc xem ở chế độ Cây.</div>`;
    return null;
  }
  const el = document.getElementById(containerId);
  if (!el) return null;
  el.innerHTML = '';

  instance = new MindElixir({
    el: '#' + containerId,
    direction: MindElixir.SIDE ?? 2,
    draggable: true, contextMenu: false, toolBar: true,
    nodeMenu: false, keypress: true, editable: false,
  });
  instance.theme = THEME;
  instance.init(mindData);
  setTimeout(() => { try { instance.toCenter(); } catch {} }, 60);
  return instance;
}

export function recenter() { if (instance) { try { instance.toCenter(); } catch {} } }

export async function exportImage(containerId, filename) {
  const node = document.getElementById(containerId);
  if (!node || typeof html2canvas === 'undefined') return false;
  recenter();
  const canvas = await html2canvas(node, { backgroundColor: '#f4f0e6', scale: 2, useCORS: true });
  const link = document.createElement('a');
  link.download = (filename || 'mindmap') + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  return true;
}
