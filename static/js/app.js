// ════════════════════════════════════════════════════════════
// app.js — Nhạc trưởng: điều phối toàn bộ ứng dụng
// ════════════════════════════════════════════════════════════
import { parseInsights, flattenForSearch, parseQuiz } from './parser.js';
import * as views from './views.js';
import * as store from './journal.js';
import { icon } from './icons.js';

const state = { view: 'mindmap' };   // chế độ xem chủ đề mặc định
const quizState = { mode: 'mc', scope: '__all' };
let quizBanks = null;
let manifest = null;
let allTopics = [];                  // phẳng hóa từ manifest
const mdCache = new Map();           // id -> markdown nội dung
const insightCache = new Map();      // id -> Map tuệ giác
let searchCorpus = null;             // dựng lười cho tìm kiếm

// ── Tiện ích ──
window.toast = function (msg, isErr = false) {
  const t = document.getElementById('toast');
  t.querySelector('span').textContent = msg;
  t.querySelector('svg').style.color = isErr ? 'var(--warn)' : 'var(--tea)';
  t.classList.add('show');
  clearTimeout(window.__toastT);
  window.__toastT = setTimeout(() => t.classList.remove('show'), 2800);
};

async function fetchText(path) {
  const r = await fetch(path, { cache: 'no-cache' });
  if (!r.ok) throw new Error(path + ' → ' + r.status);
  return r.text();
}

function findTopic(id) { return allTopics.find(t => t.id === id) || null; }

// ── Tải nội dung một chủ đề (markdown + tuệ giác), có cache ──
const actualCache = new Map();
const legendCache = new Map(); // Bộ nhớ tạm cho file truyền thuyết

async function loadTopicContent(id) {
  // Đường dẫn mới: content/tên_chủ_đề/tên_file.ext
  const basePath = `content/${id}/${id}`;

  if (!mdCache.has(id)) mdCache.set(id, await fetchText(`${basePath}.md`));
  
  if (!insightCache.has(id)) {
    try { insightCache.set(id, parseInsights(await fetchText(`${basePath}.insight.md`))); }
    catch { insightCache.set(id, new Map()); }
  }
  if (!actualCache.has(id)) {
    try { actualCache.set(id, await fetchText(`${basePath}.actual.md`)); }
    catch { actualCache.set(id, null); }
  }
  if (!legendCache.has(id)) { // Bắt file legend
    try { legendCache.set(id, await fetchText(`${basePath}.legend.md`)); }
    catch { legendCache.set(id, null); }
  }
  return { 
    md: mdCache.get(id), 
    insights: insightCache.get(id), 
    actual: actualCache.get(id),
    legend: legendCache.get(id)
  };
}

// ── Dựng sidebar từ manifest ──
function buildSidebar() {
  const nav = document.getElementById('nav');
  let html = `
    <div class="nav-group">
      <ul class="nav-list">
        <li><button data-route="home">${spanIc('home')} Tổng quan</button></li>
      </ul>
    </div>
    
    <!-- LỐI VÀO LIÊN THÔNG: Nhúng trực tiếp hai tệp HTML của bộ GEN -->
    <div class="nav-group">
      <div class="nav-group-label">Hệ Thống GEN-CI</div>
      <ul class="nav-list">
        <li>
          <a href="GEN-CI-Hoc-va-Ren.html" class="nav-item" style="display:flex; align-items:center; width:100%; padding:9px 14px; font-size:0.9rem; color:var(--ink-soft);">
            ${spanIc('feather')} <span style="flex:1; margin-left:11px;">Mã GEN — Học & Rèn</span>
          </a>
        </li>
        <li>
          <a href="GEN-CI-Van-Hanh.html" class="nav-item" style="display:flex; align-items:center; width:100%; padding:9px 14px; font-size:0.9rem; color:var(--ink-soft);">
            ${spanIc('factory')} <span style="flex:1; margin-left:11px;">Vận Hành — Công Cụ</span>
          </a>
        </li>
      </ul>
    </div>`;

 
  for (const g of manifest.groups) {
    html += `<div class="nav-group"><div class="nav-group-label">${g.label}</div><ul class="nav-list">`;
    for (const t of g.items) {
      const done = store.isDone(t.id);
      html += `<li><button data-route="${t.id}" class="${t.core ? 'core' : ''}">
        ${spanIc(t.icon)} <span style="flex:1">${t.label}</span>
        ${done ? '<span style="color:var(--ochre);font-size:.8rem">✓</span>' : ''}
      </button></li>`;
    }
    html += `</ul></div>`;
  }
  nav.innerHTML = html;
  nav.querySelectorAll('[data-route]').forEach(b =>
    b.addEventListener('click', () => navigate(b.dataset.route)));
}
function spanIc(name) { return `<span class="ic">${icon(name)}</span>`; }

function setActive(route) {
  document.querySelectorAll('#nav [data-route]').forEach(b =>
    b.classList.toggle('active', b.dataset.route === route));
}

// ── Định tuyến qua URL hash (deep-link được, F5 không mất chỗ) ──
function navigate(route) {
  if (location.hash.slice(2) !== route) { location.hash = '#/' + route; }
  else render(route);
}

async function render(route) {
  setActive(route);
  window.scrollTo(0, 0);

  if (!route || route === 'home') { views.renderHome(manifest, navigate); return; }

  const topic = findTopic(route);
  if (!topic) { views.renderHome(manifest, navigate); return; }

  // Trang lõi
  if (topic.render === 'essay') {
    try {   const md = await fetchText(`content/${topic.id}/${topic.id}.md`);   views.renderEssay(topic, md); }
    catch { main_error(topic.label); }
    return;
  }
  if (topic.render === 'contemplate') { views.renderContemplate(topic); return; }

  if (topic.render === 'relations') {
    try {
      const data = JSON.parse(await fetchText('content/_relations.json'));
      await views.renderRelations(topic, data);
    } catch { main_error(topic.label); }
    return;
  }
// Thêm vào ngay dưới đoạn xử lý trang essay (khoảng dòng 132)
   if (topic.render === 'pdf') {
    views.renderPDF(topic, `content/${topic.id}/${topic.id}.pdf`);
    return;
  }
  if (topic.render === 'quiz') {
    const banks = await loadQuizBanks();
    if (!banks.length) {
      document.getElementById('main-inner').innerHTML =
        `<div class="page-head"><h1 class="page-title">${topic.label}</h1>
         <p class="page-desc">Chưa có kho câu hỏi nào. Hãy tạo file <code>content/&lt;id&gt;.quiz.md</code> cho các chủ đề.</p></div>`;
      return;
    }
    views.renderQuiz(topic, banks, quizState);
    return;
  }

// Trang framework
  try {
    const { md, insights, actual, legend } = await loadTopicContent(topic.id);
    views.renderTopic(topic, md, insights, actual, legend, state);
  } catch (e) {
    main_error(topic.label);
  }
}

function main_error(label) {
  document.getElementById('main-inner').innerHTML =
    `<div class="page-head"><h1 class="page-title">${label}</h1>
     <p class="page-desc">Chưa đọc được nội dung. Hãy chắc rằng file <code>content/${label}</code> tồn tại,
     và anh đang mở qua <code>http://localhost:2233</code> (không phải mở file trực tiếp).</p></div>`;
}

// Tối ưu hóa luồng dữ liệu tìm kiếm song hành - Triệt tiêu Muda chờ đợi
async function buildSearchCorpus() {
  const corpus = [];
  
  // Lọc bỏ trang contemplate trước khi nạp
  const targetTopics = allTopics.filter(t => t.render !== 'contemplate');

  // Phát lệnh nạp tất cả các file đồng thời (Parallel Fetch)
  const promises = targetTopics.map(async (t) => {
    try {
      const md = mdCache.get(t.id) || await fetchText(`content/${t.id}/${t.id}.md`);
      mdCache.set(t.id, md);
      corpus.push({ topic: t, items: flattenForSearch(md) });
    } catch {
      // Bỏ qua nếu chủ đề chưa có file .md
    }
  });

  // Đợi toàn bộ các tiến trình hoàn thành cùng lúc
  await Promise.all(promises);
  return corpus;
}

function wireSearch() {
  const input = document.getElementById('search');
  let timer = null;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    const term = input.value.trim();
    timer = setTimeout(async () => {
      if (term.length < 2) { render(location.hash.slice(2) || 'home'); return; }
      if (!searchCorpus) searchCorpus = await buildSearchCorpus();
      views.renderSearch(term, searchCorpus, (id) => { input.value = ''; navigate(id); });
      setActive('');
    }, 220);
  });
}

// ── Tải các kho câu hỏi (.quiz.md) cho mọi chủ đề có file ──
async function loadQuizBanks() {
  if (quizBanks) return quizBanks;
  quizBanks = [];
  for (const t of allTopics) {
    if (t.core) continue; // chỉ lấy quiz của các framework
    try {
      const md = await fetchText(`content/${t.id}/${t.id}.quiz.md`);
      const questions = parseQuiz(md);
      if (questions.length) quizBanks.push({ topic: t, questions });
    } catch { /* chủ đề chưa có kho câu hỏi */ }
  }
  return quizBanks;
}

// ── Khởi động ──
async function init() {
  try {
    manifest = JSON.parse(await fetchText('content/_manifest.json'));
	// Thay vì await syncFromServer() thẳng, hãy bọc nó:
	try {
	  await store.syncFromServer();
	  console.log("Đã sync xong dữ liệu từ server!");
	} catch (err) {
	  console.error("Lỗi syncFromServer:", err);
	  // Thay vì crash, ta in lỗi ra console để xem
	}	
  } catch (e) {
    document.getElementById('main-inner').innerHTML =
      `<div class="page-head"><h1 class="page-title">Không tải được dữ liệu</h1>
       <p class="page-desc">Hãy chạy qua server: <code>python server.py</code> rồi mở
       <code>http://localhost:2233</code>. (Mở thẳng file sẽ bị trình duyệt chặn đọc nội dung.)</p></div>`;
    return;
  }
  allTopics = manifest.groups.flatMap(g => g.items);

  buildSidebar();
  wireSearch();

  window.addEventListener('hashchange', () => render(location.hash.slice(2) || 'home'));
  window.addEventListener('progress-changed', buildSidebar);

  render(location.hash.slice(2) || 'home');
}

init();
