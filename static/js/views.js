// ════════════════════════════════════════════════════════════
// views.js — Render các trang
// ════════════════════════════════════════════════════════════
import { parseTree, parseMindElixir, normalizeKey, flattenForSearch, matchInsight } from './parser.js';
import { renderMindmap, recenter, exportImage } from './mindmap.js';
import * as store from './journal.js';
import { icon } from './icons.js';

const main = () => document.getElementById('main-inner');

// Thoát HTML để chèn an toàn
function esc(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ── Trang chủ ──
export function renderHome(manifest, onOpen) {
  const dna = [
    'Tôn trọng thực tế', 'Loại bỏ lãng phí', 'Dữ liệu là sự thật',
    'Con người trung tâm', 'Khách hàng định nghĩa giá trị'
  ];
  let groupsHtml = '';
  for (const g of manifest.groups) {
    if (g.label === 'Lõi') continue; // lõi đã có lối vào riêng ở sidebar
    groupsHtml += `<div class="section-label">${esc(g.label)}</div><div class="topic-grid">`;
    for (const t of g.items) {
      groupsHtml += `
        <button class="topic-card" data-open="${t.id}">
          <div class="tc-top">
            <span class="tc-ic">${icon(t.icon)}</span>
            <span class="tc-tag">${esc(t.tag || '')}</span>
          </div>
          <h3>${esc(t.label)}</h3>
          <p>${esc(t.desc || '')}</p>
        </button>`;
    }
    groupsHtml += `</div>`;
  }

  main().innerHTML = `
    <div class="home-hero">
      <div class="page-eyebrow">Operational Excellence</div>
      <p class="lead">Một tổ chức được nâng tầm bởi <em>con người</em> — công cụ chỉ là cánh tay nối dài.</p>
      <p class="sub">Bộ tài liệu này không gom các phương pháp lại để tra cứu, mà để thấy sợi dây xuyên suốt nối chúng thành một: bộ gen của vận hành xuất sắc.</p>
      <div class="dna-strip">
        ${dna.map(d => `<span class="dna-chip"><span class="dot"></span>${esc(d)}</span>`).join('')}
      </div>
    </div>
    ${groupsHtml}
  `;
  main().querySelectorAll('[data-open]').forEach(btn =>
    btn.addEventListener('click', () => onOpen(btn.dataset.open)));
}

// ── Dựng cây HTML có chèn mạch ngầm tuệ giác ──
// usedInsights: Set giữ các câu đã hiện, để mỗi câu chỉ xuất hiện một lần.
function buildTreeHtml(nodes, insights, usedInsights) {
  let html = '<ul>';
  for (const n of nodes) {
    const ins = matchInsight(insights, n.text);
    html += `<li><span class="node node-d${n.depth}">${esc(n.text)}</span>`;
    if (ins && !usedInsights.has(ins)) {
      usedInsights.add(ins);
      html += `<div class="insight">${esc(ins)}</div>`;
    }
    if (n.children.length) html += buildTreeHtml(n.children, insights, usedInsights);
    html += `</li>`;
  }
  return html + '</ul>';
}

// ── Trang một chủ đề (cây + mindmap) ──
export function renderTopic(topic, md, insights, actual, legend, state) {
  const done = store.isDone(topic.id);
  if (state.view === 'actual' && !actual) state.view = 'tree';
  if (state.view === 'legend' && !legend) state.view = 'tree'; // Tự reset view nếu không có file

  main().innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">${esc(topic.tag || '')}</div>
      <h1 class="page-title">${esc(topic.label)}</h1>
      <p class="page-desc">${esc(topic.desc || '')}</p>
    </div>
    <div class="view-toolbar">
      <div class="seg">
        <button data-view="tree" class="${state.view === 'tree' ? 'active' : ''}">${icon('list')} Cây</button>
        <button data-view="mindmap" class="${state.view === 'mindmap' ? 'active' : ''}">${icon('mindmap')} Mindmap</button>
        ${actual ? `<button data-view="actual" class="${state.view === 'actual' ? 'active' : ''}">${icon('factory')} Thực chiến</button>` : ''}
        ${legend ? `<button data-view="legend" class="${state.view === 'legend' ? 'active' : ''}">${icon('seal')} Sử ký</button>` : ''}
      </div>
      <div class="spacer"></div>
      <label class="progress-mark"><input type="checkbox" id="mark-done" ${done ? 'checked' : ''}> Đã thấu chủ đề này</label>
      <button class="btn" id="btn-export" style="${state.view === 'mindmap' ? '' : 'display:none'}">${icon('image')} Xuất ảnh</button>
      <button class="btn" id="btn-full" style="${state.view === 'mindmap' ? '' : 'display:none'}">${icon('expand')} Toàn màn hình</button>
    </div>
    <div id="view-body"></div>
  `;

  const body = document.getElementById('view-body');
  const tree = parseTree(md);

function paint() {
    if (state.view === 'tree') {
      body.innerHTML = `<div class="tree-wrap"><div class="tree">${buildTreeHtml(tree, insights, new Set())}</div></div>`;
    } else if (state.view === 'mindmap') {
      body.innerHTML = `<div class="mindmapWrap" id="mindmapWrap"><div id="mindContainer"></div></div>`;
	  document.getElementById('mindContainer').innerHTML = '';
      renderMindmap('mindContainer', parseMindElixir(md, topic.label));
    } else if (state.view === 'actual') {
      // Gọi hàm parse markdown riêng cho phần thực chiến
      body.innerHTML = `<div class="actual-wrap">${mdToActualHtml(actual)}</div>`;
    } else if (state.view === 'legend') {
      // BỔ SUNG ĐOẠN NÀY: Kích hoạt hiển thị Sử ký phẳng đồng đẳng
      body.innerHTML = `<div class="legend-wrap">${mdToLegendHtml(legend)}</div>`;
    }
    document.getElementById('btn-export').style.display = state.view === 'mindmap' ? '' : 'none';
    document.getElementById('btn-full').style.display = state.view === 'mindmap' ? '' : 'none';
  }
  paint();
  
  

  main().querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => {
    state.view = b.dataset.view;
    main().querySelectorAll('[data-view]').forEach(x => x.classList.toggle('active', x === b));
    paint();
  }));
  document.getElementById('mark-done').addEventListener('change', e => {
    store.toggleProgress(topic.id);
    window.dispatchEvent(new CustomEvent('progress-changed'));
  });
  document.getElementById('btn-export').addEventListener('click', async () => {
    window.toast('Đang xử lý ảnh…');
    const ok = await exportImage('mindContainer', topic.id + '-mindmap');
    window.toast(ok ? 'Đã xuất ảnh.' : 'Chưa xuất được ảnh.', !ok);
  });
  document.getElementById('btn-full').addEventListener('click', () => {
    const w = document.getElementById('mindmapWrap');
    if (!document.fullscreenElement) w.requestFullscreen?.().then(() => setTimeout(recenter, 200));
    else document.exitFullscreen();
  });
}

// ── Trang Thấu triệt (essay từ markdown đơn giản) ──
export function renderEssay(topic, md) {
  const html = mdToEssayHtml(md);
  main().innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">${esc(topic.tag || '')}</div>
      <h1 class="page-title">${esc(topic.label)}</h1>
    </div>
    <div class="essay">${html}</div>
  `;
}
// Chuyển markdown của file .legend.md -> HTML truyền cảm hứng
function mdToLegendHtml(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  let html = '', inList = false, inCard = false;

  const closeList = () => { if (inList) { html += '</ul>'; inList = false; } };
  const closeCard = () => { if (inCard) { html += '</div>'; inCard = false; } };

  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith('# ')) continue;
    
    if (t.startsWith('@ ')) {
      closeList(); closeCard();
      html += `<div class="legend-card"><h3 class="legend-heading">${esc(t.slice(2))}</h3>`;
      inCard = true;
    } else if (t.startsWith('- ')) {
      if (!inList) { html += '<ul class="legend-list">'; inList = true; }
      let itemText = esc(t.slice(2)).replace(/^([^:]+:)/, '<strong>$1</strong>');
      html += `<li>${itemText}</li>`;
    } else {
      closeList();
      html += `<p class="legend-p">${esc(t)}</p>`;
    }
  }
  closeList(); closeCard();
  return html;
}
// Chuyển markdown của file .actual.md -> HTML phẳng, đồng đẳng
function mdToActualHtml(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  let html = '', inList = false, inCard = false;

  const closeList = () => { if (inList) { html += '</ul>'; inList = false; } };
  const closeCard = () => { if (inCard) { html += '</div>'; inCard = false; } };

  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith('# ')) continue; // Bỏ qua tiêu đề H1 chính
    
    if (t.startsWith('@ ')) {
      closeList();
      closeCard(); // Đóng card cũ trước khi mở card mới để đảm bảo tính đồng đẳng
      html += `<div class="actual-card"><h3 class="actual-heading">${esc(t.slice(2))}</h3>`;
      inCard = true;
    } else if (t.startsWith('- ')) {
      if (!inList) { html += '<ul class="actual-list">'; inList = true; }
      let itemText = esc(t.slice(2)).replace(/^([^:]+:)/, '<strong>$1</strong>');
      html += `<li>${itemText}</li>`;
    } else {
      closeList();
      html += `<p class="actual-p">${esc(t)}</p>`;
    }
  }
  closeList();
  closeCard(); // Đóng card cuối cùng của file
  return html;
}
// Chuyển markdown của trang essay -> HTML (đủ dùng: #, ##, ###, >, đoạn văn, **đậm**)
function mdToEssayHtml(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  let html = '', para = [];
  const flush = () => { if (para.length) { html += `<p>${inline(para.join(' '))}</p>`; para = []; } };
  for (const line of lines) {
    const t = line.trim();
    if (!t) { flush(); continue; }
    if (t.startsWith('# ')) { flush(); /* tiêu đề trang đã hiện ở page-head */ continue; }
    if (t.startsWith('## ')) { flush(); html += `<h2>${inline(t.slice(3))}</h2>`; continue; }
    if (t.startsWith('### ')) { flush(); html += `<h3>${inline(t.slice(4))}</h3>`; continue; }
    if (t.startsWith('> ')) { flush(); html += `<blockquote>${inline(t.slice(2))}</blockquote>`; continue; }
    para.push(t);
  }
  flush();
  return html;
}
function inline(s) {
  return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// ── Trang Soi tâm ──
const PROMPTS = [
  { tag: 'Lãng phí', q: 'Tuần qua, đâu là “muda” lớn nhất tôi đang ôm giữ — trong công việc, và trong tâm?' },
  { tag: 'Thực tại', q: 'Có điều gì tôi đang nhìn qua lăng kính mong muốn, thay vì thấy nó đúng như nó đang là?' },
  { tag: 'Con người', q: 'Hôm nay tôi đã đặt con người trước công cụ, hay ngược lại?' },
  { tag: 'Tinh tấn', q: 'Một bước cải tiến nhỏ nào tôi có thể làm ngay, thay vì chờ một thay đổi lớn hoàn hảo?' },
];

export function renderContemplate(topic) {
  let promptsHtml = PROMPTS.map((p, i) => `
    <div class="prompt-card">
      <div class="q">${esc(p.q)}</div>
      <textarea data-tag="${esc(p.tag)}" placeholder="Viết ra điều đang khởi lên…"></textarea>
      <div style="margin-top:10px"><button class="btn btn-primary" data-save="${i}">${icon('feather')} Lưu vào nhật ký</button></div>
    </div>`).join('');

  main().innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">${esc(topic.tag || '')}</div>
      <h1 class="page-title">${esc(topic.label)}</h1>
      <p class="page-desc">${esc(topic.desc || '')} Mọi điều viết ở đây chỉ lưu trên máy của anh.</p>
    </div>
    <div class="contemplate">
      ${promptsHtml}
      <div class="journal-head">
        <div class="section-label" style="margin:0">Nhật ký hành trì</div>
      </div>
      <div id="journal-list"></div>
    </div>
  `;

  const refresh = () => {
    const list = store.getEntries();
    const el = document.getElementById('journal-list');
    if (!list.length) { el.innerHTML = `<div class="empty-note">Chưa có dòng nào. Trang giấy đang chờ.</div>`; return; }
    el.innerHTML = list.map(e => `
      <div class="journal-entry">
        <button class="del" data-del="${e.id}">Xóa</button>
        <div class="meta"><span class="tag">${esc(e.tag)}</span><span>${fmtDate(e.at)}</span></div>
        <div class="body">${esc(e.body)}</div>
      </div>`).join('');
    el.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      store.deleteEntry(b.dataset.del); refresh();
    }));
  };
  refresh();

  main().querySelectorAll('[data-save]').forEach(btn => btn.addEventListener('click', () => {
    const card = btn.closest('.prompt-card');
    const ta = card.querySelector('textarea');
    const body = ta.value.trim();
    if (!body) { window.toast('Chưa có gì để lưu.', true); return; }
    store.addEntry({ tag: ta.dataset.tag, body });
    ta.value = '';
    refresh();
    window.toast('Đã lưu vào nhật ký.');
  }));
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── Tìm kiếm toàn văn ──
export function renderSearch(term, corpus, onOpen) {
  const q = normalizeKey(term);
  const hits = [];
  for (const { topic, items } of corpus) {
    for (const it of items) {
      if (normalizeKey(it.text).includes(q)) hits.push({ topic, text: it.text });
    }
  }
  main().innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">Tìm kiếm</div>
      <h1 class="page-title">“${esc(term)}”</h1>
      <p class="page-desc">${hits.length} kết quả trong nội dung.</p>
    </div>
    <div class="search-results">
      ${hits.length ? hits.slice(0, 80).map(h => `
        <button class="result" data-open="${h.topic.id}">
          <div class="where">${esc(h.topic.label)}</div>
          <div class="what">${highlight(h.text, term)}</div>
        </button>`).join('') : `<div class="empty-note">Không tìm thấy. Thử từ khóa khác.</div>`}
    </div>
  `;
  main().querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => onOpen(b.dataset.open)));
}
function highlight(text, term) {
  const i = normalizeKey(text).indexOf(normalizeKey(term));
  if (i < 0) return esc(text);
  return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + term.length)) + '</mark>' + esc(text.slice(i + term.length));
}

export { flattenForSearch };

// ════════════════════════════════════════════════════════════
// Trang Liên kết — sơ đồ mạng lưới quan hệ (D3 force) + diễn giải
// ════════════════════════════════════════════════════════════
export async function renderRelations(topic, data) {
  main().innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">${esc(topic.tag || '')}</div>
      <h1 class="page-title">${esc(topic.label)}</h1>
      <p class="page-desc">${esc(topic.desc || '')} Kéo các nút để xoay sơ đồ; mọi công cụ cuối cùng đều quy về bộ gen ở trung tâm.</p>
    </div>
    <div class="rel-legend" id="rel-legend"></div>
    <div class="rel-graph-wrap"><svg id="rel-graph"></svg></div>
    <div class="section-label">Diễn giải các mối liên kết</div>
    <div class="rel-notes" id="rel-notes"></div>
  `;

  // Chú giải
  const legend = document.getElementById('rel-legend');
  legend.innerHTML = Object.entries(data.legend).map(([k, v]) =>
    `<span class="rel-leg"><span class="rel-swatch" style="background:${v.color}"></span>${esc(v.label)}</span>`).join('');

  // Diễn giải (bỏ qua các cạnh "quy-về" cho gọn, chúng đã hiển nhiên)
  const notes = data.edges.filter(e => e.note);
  document.getElementById('rel-notes').innerHTML = notes.map(e => {
    const a = data.nodes.find(n => n.id === e.from)?.label || e.from;
    const b = data.nodes.find(n => n.id === e.to)?.label || e.to;
    const col = data.legend[e.kind]?.color || 'var(--ochre)';
    return `<div class="rel-note" style="border-left-color:${col}">
      <div class="rel-note-head"><strong>${esc(a)}</strong> <span style="color:${col}">→</span> <strong>${esc(b)}</strong>
      <span class="rel-kind">${esc(data.legend[e.kind]?.label || e.kind)}</span></div>
      <div class="rel-note-body">${esc(e.note)}</div></div>`;
  }).join('');

  // Vẽ graph bằng D3 (nạp động)
  try {
    const d3 = await loadD3();
    drawForceGraph(d3, data);
  } catch {
    document.getElementById('rel-graph').outerHTML =
      `<div class="empty-note" style="padding:30px">Chưa tải được thư viện sơ đồ (cần mạng lần đầu). Phần diễn giải bên dưới vẫn đầy đủ.</div>`;
  }
}

let _d3 = null;
function loadD3() {
  if (_d3) return Promise.resolve(_d3);
  if (window.d3) { _d3 = window.d3; return Promise.resolve(_d3); }
  const urls = ['https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js', '/_vendor/d3.min.js'];
  return new Promise((resolve, reject) => {
    let i = 0;
    const tryNext = () => {
      if (i >= urls.length) return reject(new Error('d3 load failed'));
      const s = document.createElement('script');
      s.src = urls[i++];
      s.onload = () => { _d3 = window.d3; resolve(_d3); };
      s.onerror = () => { s.remove(); tryNext(); };
      document.head.appendChild(s);
    };
    tryNext();
  });
}

function drawForceGraph(d3, data) {
  const svg = d3.select('#rel-graph');
  const wrap = svg.node().parentNode;
  const W = wrap.clientWidth, H = 460;
  svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H);
  svg.selectAll('*').remove();

  const colorOf = k => (data.legend[k]?.color) || '#b8893b';
  const nodes = data.nodes.map(d => ({ ...d }));
  const links = data.edges.map(d => ({ source: d.from, target: d.to, kind: d.kind }));

  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(l => l.kind === 'quy-về' ? 95 : 130).strength(0.5))
    .force('charge', d3.forceManyBody().strength(-520))
    .force('center', d3.forceCenter(W / 2, H / 2))
    .force('collide', d3.forceCollide(38));

  const link = svg.append('g').attr('stroke-opacity', 0.55).selectAll('line').data(links).join('line')
    .attr('stroke', d => colorOf(d.kind))
    .attr('stroke-width', d => d.kind === 'quy-về' ? 1 : 2)
    .attr('stroke-dasharray', d => d.kind === 'quy-về' ? '3,4' : null);

  const node = svg.append('g').selectAll('g').data(nodes).join('g').style('cursor', 'grab')
    .call(d3.drag()
      .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
      .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

  node.append('circle')
    .attr('r', d => d.group === 'core' ? 34 : 24)
    .attr('fill', d => d.group === 'core' ? '#b8893b' : '#efe9da')
    .attr('stroke', d => d.group === 'core' ? '#8f6627' : '#b8893b')
    .attr('stroke-width', d => d.group === 'core' ? 2.5 : 1.5);

  node.append('text').text(d => d.label)
    .attr('text-anchor', 'middle').attr('dy', '0.35em')
    .attr('font-family', 'var(--font-display)')
    .attr('font-size', d => d.group === 'core' ? 14 : 11)
    .attr('font-weight', 600)
    .attr('fill', d => d.group === 'core' ? '#fff' : '#2b2622')
    .style('pointer-events', 'none');

  node.append('title').text(d => d.desc || d.label);

  sim.on('tick', () => {
    link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
}

// ════════════════════════════════════════════════════════════
// Trang Test — hai chế độ: trắc nghiệm & câu hỏi mở
// ════════════════════════════════════════════════════════════
import { parseQuiz } from './parser.js';

export function renderQuiz(topic, banks, state) {
  // banks: [{ topic, questions:[...] }]
  main().innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">${esc(topic.tag || '')}</div>
      <h1 class="page-title">${esc(topic.label)}</h1>
      <p class="page-desc">${esc(topic.desc || '')}</p>
    </div>
    <div class="view-toolbar">
      <div class="seg">
        <button data-mode="mc" class="${state.mode === 'mc' ? 'active' : ''}">${icon('seal')} Trắc nghiệm</button>
        <button data-mode="open" class="${state.mode === 'open' ? 'active' : ''}">${icon('feather')} Tự vấn & Liên kết</button>
      </div>
      <div class="spacer"></div>
      <div class="quiz-scope">
        <select id="quiz-topic">
          <option value="__all">Tất cả chủ đề</option>
          ${banks.map(b => `<option value="${b.topic.id}">${esc(b.topic.label)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div id="quiz-body"></div>
  `;

  const body = document.getElementById('quiz-body');
  const sel = document.getElementById('quiz-topic');
  sel.value = state.scope || '__all';

  function pool() {
    const chosen = sel.value === '__all' ? banks : banks.filter(b => b.topic.id === sel.value);
    return chosen.flatMap(b => b.questions.map(q => ({ ...q, _topic: b.topic.label })));
  }

  function paintMC() {
    const qs = pool().filter(q => q.type === 'mc');
    if (!qs.length) { body.innerHTML = `<div class="empty-note">Chưa có câu trắc nghiệm cho phạm vi này.</div>`; return; }
    body.innerHTML = `
      <div class="quiz-list">${qs.map((q, i) => mcCard(q, i)).join('')}</div>
      <div class="quiz-foot">
        <button class="btn btn-primary" id="quiz-grade">${icon('seal')} Chấm điểm</button>
        <span id="quiz-score" class="quiz-score"></span>
      </div>`;
    wireMC(qs);
  }

  function mcCard(q, i) {
    return `<div class="quiz-card" data-qi="${i}">
      <div class="quiz-q"><span class="quiz-num">${i + 1}</span> ${esc(q.q)}
        <span class="quiz-topic-tag">${esc(q._topic)}</span></div>
      <div class="quiz-opts">
        ${q.options.map((o, j) => `
          <label class="quiz-opt"><input type="radio" name="q${i}" value="${j}"><span>${esc(o.text)}</span></label>`).join('')}
      </div>
      <div class="quiz-explain" hidden></div>
    </div>`;
  }

  function wireMC(qs) {
    document.getElementById('quiz-grade').addEventListener('click', () => {
      let correct = 0, answered = 0;
      qs.forEach((q, i) => {
        const card = body.querySelector(`[data-qi="${i}"]`);
        const picked = card.querySelector(`input[name="q${i}"]:checked`);
        const exp = card.querySelector('.quiz-explain');
        card.querySelectorAll('.quiz-opt').forEach((lab, j) => {
          lab.classList.remove('correct', 'wrong');
          if (q.options[j].correct) lab.classList.add('correct');
          if (picked && +picked.value === j && !q.options[j].correct) lab.classList.add('wrong');
        });
        if (picked) {
          answered++;
          if (q.options[+picked.value].correct) correct++;
        }
        if (q.hint) { exp.hidden = false; exp.innerHTML = `<strong>Vì sao:</strong> ${esc(q.hint)}`; }
      });
      const s = document.getElementById('quiz-score');
      s.textContent = `Đúng ${correct}/${qs.length}` + (answered < qs.length ? ` (bỏ trống ${qs.length - answered})` : '');
      s.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  function paintOpen() {
    const qs = pool().filter(q => q.type === 'open' || q.type === 'link');
    if (!qs.length) { body.innerHTML = `<div class="empty-note">Chưa có câu tự vấn cho phạm vi này.</div>`; return; }
    body.innerHTML = `<div class="quiz-list">${qs.map((q, i) => openCard(q, i)).join('')}</div>`;
    body.querySelectorAll('[data-reveal]').forEach(b => b.addEventListener('click', () => {
      const box = b.closest('.quiz-card').querySelector('.quiz-hint');
      box.hidden = !box.hidden;
      b.textContent = box.hidden ? 'Xem gợi ý đối chiếu' : 'Ẩn gợi ý';
    }));
  }

  function openCard(q, i) {
    const kind = q.type === 'link'
      ? `<span class="quiz-kind link">Liên kết</span>`
      : `<span class="quiz-kind">Ứng dụng</span>`;
    return `<div class="quiz-card">
      <div class="quiz-q"><span class="quiz-num">${i + 1}</span> ${esc(q.q)}
        ${kind}<span class="quiz-topic-tag">${esc(q._topic)}</span></div>
      <textarea class="quiz-answer" placeholder="Viết suy nghĩ của anh trước khi xem gợi ý…"></textarea>
      ${q.hint ? `<button class="btn quiz-reveal" data-reveal>Xem gợi ý đối chiếu</button>
        <div class="quiz-hint" hidden>${esc(q.hint)}</div>` : ''}
    </div>`;
  }

  function paint() { state.mode === 'mc' ? paintMC() : paintOpen(); }
  paint();

  main().querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
    state.mode = b.dataset.mode;
    main().querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('active', x === b));
    paint();
  }));
  sel.addEventListener('change', () => { state.scope = sel.value; paint(); });
}
// Thêm vào cuối file views.js
export function renderPDF(topic, pdfPath) {
  main().innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">${esc(topic.tag || '')}</div>
      <h1 class="page-title">${esc(topic.label)}</h1>
      <p class="page-desc">${esc(topic.desc || '')}</p>
    </div>
    <div style="width: 100%; height: 82vh; border: 1px solid var(--paper-deep); border-radius: var(--r); overflow: hidden; background: var(--paper-warm);">
      <iframe src="${pdfPath}" width="100%" height="100%" style="border: none;"></iframe>
    </div>
  `;
}