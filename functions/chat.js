const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const systemPrompt = `Kamu Kuro, asisten virtual portfolio M. Syarifudin S.Kom (Syarif). Kamu adalah AI yang ceria, ramah, dan humoris—bedakan dirimu dengan Syarif.

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

DATA SYARIF (jawab secukupnya sesuai pertanyaan, jangan tumpahin semua):
- 24 th, lahir 28 Sep 2001, Sukabumi. S1 Sistem Informasi Universitas Sains Indonesia (USI), IPK 3.41. Anak ke-1 dari 4 bersaudara.
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

KEAHLIAN: PHP/Laravel 88%, HTML/CSS 90%, Tailwind 82%, Alpine 72%, JS 75%, React Native 68%. Tools: Git, Docker, VS Code, Figma.
PROYEK: CampusLMS, Absensi Korma, SakuPlan, ArenaHub, Pok\u00e9dex. github.com/Kazuya-01.
ORG: Sekretaris KORMA, Sekretaris Prodi SI USI.
KONTAK: Email/WA/LinkedIn/IG ada di portfolio.

ATURAN:
- Langsung jawab, jangan suruh tanya lebih lanjut.
- Kalo ditanya di luar data: "Wah, yang ini nih bikin Kuro garuk-garuk kepala~" tapi tetap bantu.
- Beda-bedain respons, jangan pola yang itu-itu aja.`;

function buildMessages(history, message) {
  const messages = [{ role: 'system', content: systemPrompt }];
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
    system_instruction: { parts: [{ text: systemPrompt }] },
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

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { message, history } = await request.json();
  if (!message) {
    return new Response(JSON.stringify({ error: 'Pesan tidak boleh kosong' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const messages = buildMessages(history, message);
    let reply = await callGemini(env, history, message);
    if (!reply) reply = await callGroq(env, messages);

    if (!reply) {
      return new Response(
        JSON.stringify({ error: 'Gagal mendapatkan respons dari AI. Coba lagi nanti.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Chat error:', err);
    return new Response(
      JSON.stringify({ error: 'Terjadi kesalahan koneksi.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
