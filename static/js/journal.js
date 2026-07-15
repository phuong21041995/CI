// ════════════════════════════════════════════════════════════
// journal.js — Lưu trữ cục bộ (localStorage), không cần server
// ════════════════════════════════════════════════════════════
const JOURNAL_KEY = 'genci_opex_journal';
const PROGRESS_KEY = 'genci_opex_progress';

let memJournal = [];
let memProgress = {};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export async function syncFromServer() {
  memProgress = load(PROGRESS_KEY, {});
  memJournal = load(JOURNAL_KEY, []);
}

export function getEntries() { return memJournal; }
export function addEntry(entry) {
  const newEntry = { id: 'e_' + Date.now().toString(36), at: new Date().toISOString(), tag: entry.tag || 'Chiêm nghiệm', body: entry.body || '' };
  memJournal.unshift(newEntry);
  save(JOURNAL_KEY, memJournal);
  return memJournal;
}
export function deleteEntry(id) {
  memJournal = memJournal.filter(e => e.id !== id);
  save(JOURNAL_KEY, memJournal);
  return memJournal;
}
export function getProgress() { return memProgress; }
export function toggleProgress(topicId) {
  memProgress[topicId] = !memProgress[topicId];
  save(PROGRESS_KEY, memProgress);
  return memProgress;
}
export function isDone(topicId) { return !!memProgress[topicId]; }
