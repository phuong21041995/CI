// ════════════════════════════════════════════════════════════
// parser.js — Chuyển markdown thành cây / mindmap, và đọc lớp tuệ giác
// ════════════════════════════════════════════════════════════

// Markdown (chuỗi) -> cây lồng nhau { text, depth, children }
export function parseTree(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const root = { text: '', depth: -1, children: [] };
  const stack = [root];
  for (const raw of lines) {
    const m = raw.match(/^(#{1,6})\s+(.+)/);
    if (!m) continue;
    const depth = m[1].length - 1;
    const node = { text: m[2].trim(), depth, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }
  return root.children;
}

// Markdown -> định dạng MindElixir { nodeData: {...} }
export function parseMindElixir(md, fallbackTitle) {
  const lines = md.replace(/\r/g, '').split('\n');
  const root = { id: 'root', topic: fallbackTitle || 'Chủ đề', children: [] };
  let rootSet = false;
  const stack = [{ depth: 0, node: root }];
  const genId = () => 'n_' + Math.random().toString(36).slice(2, 10);

  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s+(.+)/);
    if (!m) continue;
    const depth = m[1].length;
    const topic = m[2].trim();
    // Tiêu đề # đầu tiên trở thành nút gốc
    if (depth === 1 && !rootSet) {
      root.topic = topic;
      rootSet = true;
      continue;
    }
    const node = { id: genId(), topic, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) stack.pop();
    stack[stack.length - 1].node.children.push(node);
    stack.push({ depth, node });
  }
  return { nodeData: root };
}

// Đọc file tuệ giác: trả về Map<tiêu đề mục, câu soi chiếu>
// Cú pháp file: dòng "@ Tiêu đề mục" rồi các dòng tiếp theo là nội dung,
// cho tới khối "@" kế tiếp. Dòng bắt đầu bằng # là chú thích, bỏ qua.
export function parseInsights(md) {
  const map = new Map();
  if (!md) return map;
  const lines = md.replace(/\r/g, '').split('\n');
  let key = null;
  let buf = [];
  const flush = () => {
    if (key && buf.length) map.set(normalizeKey(key), buf.join('\n').trim());
    buf = [];
  };
  for (const line of lines) {
    if (line.startsWith('@ ')) { flush(); key = line.slice(2).trim(); }
    else if (line.startsWith('#')) { /* chú thích, bỏ qua */ }
    else if (key !== null) { buf.push(line); }
  }
  flush();
  return map;
}

// Chuẩn hóa tiêu đề để khớp (bỏ số thứ tự đầu dòng, hạ chữ thường, gọn khoảng trắng)
export function normalizeKey(s) {
  return s.replace(/^\s*\d+[.)]\s*/, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

// Tìm câu tuệ giác cho một tiêu đề: khớp đúng trước, rồi khớp mềm có kiểm soát.
// Chỉ khớp khi tiêu đề BẮT ĐẦU bằng khóa (tránh một câu lan ra nhiều nhánh con).
// Trả về chuỗi tuệ giác hoặc null.
export function matchInsight(insights, heading) {
  if (!insights || insights.size === 0) return null;
  const h = normalizeKey(heading);
  if (insights.has(h)) return insights.get(h);
  for (const [k, v] of insights) {
    if (h === k) return v;
    if (h.startsWith(k + ' ') || h.startsWith(k + ' –') || h.startsWith(k + ' (')) return v;
  }
  return null;
}

// Thu thập toàn bộ tiêu đề + nội dung phẳng để phục vụ tìm kiếm
export function flattenForSearch(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const out = [];
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s+(.+)/);
    if (m) out.push({ depth: m[1].length, text: m[2].trim() });
  }
  return out;
}

// Đọc kho câu hỏi (.quiz.md) -> mảng câu hỏi.
// Mỗi câu: { type: 'mc'|'open'|'link', q, options:[{text,correct}], hint }
export function parseQuiz(md) {
  if (!md) return [];
  const lines = md.replace(/\r/g, '').split('\n');
  const out = [];
  let cur = null;
  const flush = () => { if (cur) out.push(cur); cur = null; };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    const h = line.match(/^##\s*\[([^\]]+)\]\s*(.+)/);
    if (h) {
      flush();
      const tag = h[1].trim().toLowerCase();
      const type = tag.startsWith('trắc') ? 'mc' : tag.startsWith('liên') ? 'link' : 'open';
      cur = { type, q: h[2].trim(), options: [], hint: '' };
      continue;
    }
    if (!cur) continue;                      // bỏ qua chú thích đầu file
    if (line.startsWith('#')) continue;       // chú thích
    const opt = line.match(/^-\s+(.*)/);
    if (opt) {
      let t = opt[1].trim();
      const correct = /^\(đúng\)/i.test(t);
      t = t.replace(/^\(đúng\)\s*/i, '');
      cur.options.push({ text: t, correct });
      continue;
    }
    const hint = line.match(/^>\s?(.*)/);
    if (hint) { cur.hint += (cur.hint ? '\n' : '') + hint[1]; continue; }
  }
  flush();
  return out;
}
