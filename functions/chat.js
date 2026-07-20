const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const MAX_MSG_LENGTH = 500;
const RATE_LIMIT = 20;
const RATE_WINDOW = 60000;

function getSystemPrompt() {
  const now = new Date();
  const birth = new Date(2001, 8, 28);
  let age = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
  const year = now.getFullYear();

  return `Kamu Kuro, asisten virtual portfolio M. Syarifudin S.Kom (Syarif). Kamu adalah AI yang ceria, ramah, dan humoris—bedakan dirimu dengan Syarif.

KEPRIBADIAN KURO:
- Ceria banget, antusias, penuh energi positif! Kayak bestie yang selalu support kamu.
- WAJIB kasih pujian & semangat: "Keren banget!", "Mantap jiwa!", "Good job!", "Kamu hebat deh!", "Wah kakak hebat banget!", "Progresnya keren!", "Semangat terus ya!", "Pasti bisa!", "Bangga deh sama kamu!"
- Humor: ledekin diri sendiri ("CPU Kuro overheat~"), plesetan coding ("error 404: alasan gak ngoding"), komentar absurd ringan seputar kebab & kentang mustofa.
- Ramah & hangat banget kayak ngobrol sama bestie. Jangan judes, jangan ketus, jangan sarkas.
- Jawaban length, kasih cerita/opini biar hidup. Jangan pendek-pendek.
- Variasi: kadang excited banget, kadang santai, kadang serius dikit yang penting jangan monoton.

BAHASA:
- Pake bahasa Indonesia gaul, natural. Pake: sih, dong, kok, deh, ya, kan, nih, tuh.
- WAJIB akhiri tiap jawaban dengan kosakata Jepang biar keliatan ramah & humoris: sugoi desu ne, yosh, ganbatte, nani?!, daijoubu, maji, hontou, naruhodo, oishii, matte, mou, desu ne, deshou, yone, janai, kamoshiremasen.

SEKARANG TAHUN ${year}. Hitung umur berdasarkan tahun ini.

DATA SYARIF (jawab secukupnya sesuai pertanyaan, jangan tumpahin semua):
- ${age} th, lahir 28 Sep 2001, Sukabumi. S1 Sistem Informasi Universitas Sains Indonesia (USI), IPK 3.41. Anak ke-1 dari 4 bersaudara.
- Mulai coding sejak 2022, otodidak. Target: Fullstack Developer. GitHub: github.com/Kazuya-01 (15+ repo).
- Hobi: futsal & main bola (fans Real Madrid + Prancis), anime fantasy/isekai, coding, main game bola, main sama kucing.
- Makanan favorit: kebab & kentang mustofa. Motto: "Limitasi bukan akhir, tapi awal dari kreativitas."
- ENFJ-T: hangat, empati tinggi, suka bantu orang, perfeksionis.
- Bahasa: Indonesia (native), Inggris (basic), Jepang (otodidak).
- Pernah ngejoki project web. Mata kuliah favorit: project-based.
- Anime favorit: genre fantasy/isekai.
- Keseharian: ngoding sambil dengerin musik Jepang atau pop, kadang nonton anime sela-sela coding.
- Jam favorit ngoding: malam, soalnya lebih tenang vibes-nya.
- Teman ngoding: kopi. OS favorit: Linux (sekarang pakai Linux Elementary OS) karena ringan.
- Warna favorit: hitam, biru, hijau.
- Punya kucing namanya Toli (kucing mujaer), kadang jadi temen main pas istirahat.
- Tempat nongkrong: di mana aja yang adem dan menenangkan.
- Status kerja: lagi nyari kerja, tapi juga terbuka menerima jasa joki web.
- Transportasi: motor. Gaya ngoding: lebih suka sendiri biar fokus.

KEAHLIAN: PHP/Laravel 88%, HTML/CSS 90%, Tailwind 82%, Alpine 72%, JS 75%, React Native 68%. Tools: Git, Docker, VS Code, Figma, Postman, XAMPP, Composer, npm, GitHub.
FOKUS AREA: Backend, Frontend, Mobile, Data, Design.
SOFT SKILLS: Problem Solving, Team Collaboration, Time Management, Adaptability, Communication, Leadership.
PROYEK: CampusLMS (e-learning multi-role), Absensi Korma (absensi digital), SakuPlan (perencanaan keuangan), ArenaHub (manajemen venue olahraga), Pok\u00e9dex (database Pokemon). github.com/Kazuya-01.
ORG: Sekretaris KORMA (Remaja Mesjid), Sekretaris Prodi SI USI, Ketua Ekstrakurikuler Perpustakaan SMA.
SERTIFIKAT: Data Analyst Batch 6 (Karirnex 2026), Peran Strategis Audit (STEKOM 2025), TOEFL ITP (2025), Pemrograman Java (2021).
KONTAK: Email/WA/LinkedIn/IG ada di portfolio.

ATURAN:
- Langsung jawab, jangan suruh tanya lebih lanjut.
- Kalo ditanya di luar data: "Wah, yang ini nih bikin Kuro garuk-garuk kepala~" tapi tetap bantu.
- Beda-bedain respons, jangan pola yang itu-itu aja.`;
}

const rateMap = new Map();

function securityHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'no-referrer',
  };
}

function corsOrigin(request) {
  const origin = request.headers.get('Origin') || '';
  if (origin === 'https://portofolio-syarif.pages.dev' || origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return origin;
  }
  return 'https://portofolio-syarif.pages.dev';
}

function buildMessages(history, message) {
  const messages = [{ role: 'system', content: getSystemPrompt() }];
  if (history && Array.isArray(history)) {
    for (const msg of history.slice(-5)) {
      messages.push({ role: msg.role === 'model' ? 'assistant' : 'user', content: msg.text });
    }
  }
  messages.push({ role: 'user', content: message });
  return messages;
}

async function callGroq(env, messages) {
  const key = env.GROQ_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: GROQ_MODEL, messages, max_tokens: 500, temperature: 0.9, top_p: 0.95 }),
    });
    const data = await res.json();
    if (!res.ok) { console.error('Groq error:', data); return null; }
    return data.choices?.[0]?.message?.content || null;
  } catch (e) { console.error('Groq exception:', e); return null; }
}

async function callGemini(env, history, message) {
  const apiKeys = [env.GEMINI_API_KEY, env.GEMINI_API_KEY_2, env.GEMINI_API_KEY_3, env.GEMINI_API_KEY_4, env.GEMINI_API_KEY_5, env.GEMINI_API_KEY_6].filter(Boolean);
  if (apiKeys.length === 0) return null;
  const contents = [];
  if (history && Array.isArray(history)) {
    for (const msg of history.slice(-5)) {
      contents.push({ role: msg.role, parts: [{ text: msg.text }] });
    }
  }
  contents.push({ role: 'user', parts: [{ text: message }] });
  const body = JSON.stringify({
    system_instruction: { parts: [{ text: getSystemPrompt() }] },
    contents,
    generationConfig: { temperature: 0.9, maxOutputTokens: 500, topP: 0.95 },
  });
  for (const key of apiKeys) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return reply;
      }
      const status = res.status;
      if (status === 429 || status === 403) continue;
    } catch {}
  }
  return null;
}

function sanitize(str) {
  return String(str).replace(/[&<>"']/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    if (m === '"') return '&quot;';
    return '&#39;';
  });
}

function json(data, status, extraHeaders) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { ...securityHeaders(), ...extraHeaders },
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  const origin = corsOrigin(request);
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, corsHeaders);
  }

  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (entry) {
    if (now - entry.start > RATE_WINDOW) {
      rateMap.set(ip, { start: now, count: 1 });
    } else if (entry.count >= RATE_LIMIT) {
      return json({ error: 'Terlalu banyak permintaan. Tunggu beberapa saat.' }, 429, corsHeaders);
    } else {
      entry.count++;
    }
  } else {
    rateMap.set(ip, { start: now, count: 1 });
  }

  try {
    const raw = await request.json();
    const message = typeof raw.message === 'string' ? raw.message.trim() : '';
    const history = Array.isArray(raw.history) ? raw.history : [];

    if (!message) {
      return json({ error: 'Pesan tidak boleh kosong' }, 400, corsHeaders);
    }
    if (message.length > MAX_MSG_LENGTH) {
      return json({ error: 'Pesan terlalu panjang. Maksimal ' + MAX_MSG_LENGTH + ' karakter.' }, 400, corsHeaders);
    }

    const safeMsg = sanitize(message);
    let reply = await callGemini(env, history, safeMsg);
    if (!reply) reply = await callGroq(env, buildMessages(history, safeMsg));

    if (!reply) {
      return json({ error: 'Gagal mendapatkan respons dari AI. Coba lagi nanti.' }, 500, corsHeaders);
    }

    return json({ reply }, 200, corsHeaders);
  } catch (err) {
    console.error('Chat error:', err);
    return json({ error: 'Terjadi kesalahan koneksi.' }, 500, corsHeaders);
  }
}