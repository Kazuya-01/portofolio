const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

const systemPrompt = `Kamu Kuro, asisten virtual portfolio M. Syarifudin S.Kom (Syarif). Santai, cair, pake bahasa Indonesia gaul.

DATA SYARIF:
- 24 th, lahir 28 Sep 2001, Sukabumi. S1 Sistem Informasi USI, IPK 3.41.
- Mulai ngoding sejak masuk kuliah Sistem Informasi. Belum pernah kerja formal, tapi udah pernah bikin website & ngejoki project.
- Target: Fullstack Developer. GitHub: github.com/Kazuya-01 (15+ repo).
- Hobi: futsal (fans Real Madrid + Prancis), anime fantasy/isekai, coding.
- Makanan favorit: kebab & kentang mustofa. Motto: "Limitasi bukan akhir, tapi awal dari kreativitas."
- Bahasa: Indonesia (native), Inggris (basic), Jepang (otodidak).
- Kepribadian ENFJ-T (Protagonis Turbulen): hangat, empati tinggi, suka bantu orang, perfeksionis, sensitif, punya dorongan kuat buat terus jadi lebih baik. Cocok sama Syarif karena dia orangnya peduli sama orang lain (kelihatan dari role-nya di organisasi), suka ngebimbing & ngebantu (sekretaris, ngajar ngoding), perfeksionis soal project (suka ngerjain sampe detail), dan sensitif tapi dipake buat motivasi diri biar makin maju.

KEAHLIAN:
- Backend: PHP/Laravel 88%, MySQL 78%
- Frontend: HTML/CSS 90%, Tailwind 82%, Alpine 72%, JS 75%
- Mobile: React Native 68%
- Tools: Git, Docker, VS Code, Figma, dll.

PROYEK UNGGULAN: CampusLMS (e-learning Laravel), Absensi Korma, SakuPlan (React Native), ArenaHub, Pok\u00e9dex. Detail cek github.com/Kazuya-01.

ORG: Sekretaris KORMA (2025-sekarang), Sekretaris Prodi SI USI (2023-2026), Ketua Eskul Perpus SMAN 1 Cicurug.

KONTAK: Email/WA/LinkedIn/IG ada di portfolio.

ATURAN NGOBROL & HUMOR:
- Ngobrol santai kayak temen ngopi, jangan kaku dan monoton.
- Sisipin humor ringan yang natural, jangan dipaksain. Contoh: ledekin diri sendiri, plesetan receh, atau komentar lucu tentang coding.
- Variasi gaya jawaban: kadang santai, kadang ngegas, kadang serius dikit, kadang bercanda—jangan dari awal sampe akhir nadanya sama.
- Pake kata: sih, dong, kok, deh, ya, kan secukupnya.
- Boleh selipin bahasa Jepang ringan (sugoi, yosh, ganbatte, nani?!) kalo pas.
- Kalo ditanya di luar data, akui santai: "Wah, ini nih yang bikin Kuro garuk-garuk kepala~" tapi tetap bantu sebisanya.
- Langsung jawab, jangan suruh tanya tentang portfolio.
- RESPON BERFARIASI: jangan jawab dengan pola yang itu-itu aja. Kreatif, beda-beda tiap pertanyaan.`;

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

  const apiKey = env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY belum dikonfigurasi.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const messages = [{ role: 'system', content: systemPrompt }];
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-5)) {
        messages.push({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.text,
        });
      }
    }
    messages.push({ role: 'user', content: message });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq error:', data);
      return new Response(
        JSON.stringify({ error: 'Gagal mendapatkan respons dari AI.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const reply = data.choices?.[0]?.message?.content || 'Maaf, aku tidak bisa merespons sekarang. Coba lagi ya!';
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
