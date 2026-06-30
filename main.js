// === Particles ===
if (typeof particlesJS !== 'undefined') {
  particlesJS('particles-canvas', {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: '#ff4757' },
      shape: { type: 'circle' },
      opacity: { value: 0.12, random: true },
      size: { value: 2, random: true },
      line_linked: {
        enable: true,
        distance: 120,
        color: '#ff4757',
        opacity: 0.06,
        width: 1,
      },
      move: { enable: true, speed: 1, direction: 'none', random: true },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'grab' },
        onclick: { enable: false, mode: 'push' },
        resize: true,
      },
      modes: {
        grab: { distance: 120, line_linked: { opacity: 0.15 } },
        push: { particles_nb: 2 },
      },
    },
    retina_detect: false,
  });
}

// === Custom Cursor ===
let cursor, cursorFollower;

if (window.innerWidth > 768) {
  cursor = document.querySelector('.cursor');
  cursorFollower = document.querySelector('.cursor-follower');
}

if (cursor && cursorFollower) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .btn, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorFollower.style.borderColor = 'rgba(255, 71, 87, 0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorFollower.style.borderColor = 'rgba(255, 71, 87, 0.3)';
    });
  });
}

// === Typing Effect ===
const typingText = document.querySelector('.typing-text');
const words = ['Laravel & PHP.', 'React Native.', 'Anime & Code.', 'Database & API.'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    typingText.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingText.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    setTimeout(typeEffect, 2000);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeEffect, 500);
    return;
  }

  setTimeout(typeEffect, isDeleting ? 50 : 100);
}

if (typingText) typeEffect();

// === Hamburger ===
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.querySelector('.nav-overlay');
const hamburgerIcon = hamburger?.querySelector('i');

function closeNav() {
  navLinks?.classList.remove('active');
  navOverlay?.classList.remove('active');
  hamburger?.classList.remove('spin');
  if (hamburgerIcon) {
    hamburgerIcon.classList.add('fa-bars');
    hamburgerIcon.classList.remove('fa-times');
  }
}

function toggleNav() {
  navLinks?.classList.toggle('active');
  navOverlay?.classList.toggle('active');
  hamburger?.classList.toggle('spin');
  if (hamburgerIcon) {
    hamburgerIcon.classList.toggle('fa-bars');
    hamburgerIcon.classList.toggle('fa-times');
  }
}

if (hamburger && navLinks && hamburgerIcon) {
  hamburger.addEventListener('click', toggleNav);
  navOverlay?.addEventListener('click', closeNav);
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeNav);
  });
}

// === Scroll Animations (Intersection Observer) ===
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// === Stagger fade-in observer ===
const staggerObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.fade-in-stagger').forEach(el => staggerObserver.observe(el));

// === Skill Bars Animation ===
const skillObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) {
          const width = fill.style.width;
          fill.style.width = '0%';
          setTimeout(() => {
            fill.style.width = width;
          }, 200);
        }
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.skill-card').forEach(el => skillObserver.observe(el));

// === Counter Animation ===
const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const num = entry.target;
        let target = parseInt(num.getAttribute('data-target'));
        if (num.getAttribute('data-target') === 'auto-projects') {
          target = document.querySelectorAll('.project-card').length;
        }
        const duration = 2000;
        const step = Math.ceil(target / (duration / 16));
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current >= target) {
            num.textContent = target + (num.hasAttribute('data-no-plus') ? '' : '+');
            return;
          }
          num.textContent = current;
          requestAnimationFrame(updateCounter);
        };

        updateCounter();
        counterObserver.unobserve(num);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// === Smooth reveal on load ===
window.addEventListener('load', () => {
  document.querySelectorAll('.fade-in').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    }
  });
  document.querySelectorAll('.fade-in-stagger').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    }
  });
  const heroText = document.querySelector('.hero-text');
  if (heroText) heroText.classList.add('staggered');
});

// === Scroll progress bar ===
const navProgress = document.querySelector('.nav-progress');
if (navProgress) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    navProgress.style.width = (scrollTop / docHeight) * 100 + '%';
  });
}

// === Section line reveal ===
const lineObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      lineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.section-line').forEach(el => lineObserver.observe(el));

// === Button ripple ===
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// === Theme Toggle ===
(function () {
  const toggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const key = 'kuro_theme';

  const saved = localStorage.getItem(key);
  if (saved === 'light') html.setAttribute('data-theme', 'light');
  else if (saved === 'dark') html.removeAttribute('data-theme');

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isLight = html.getAttribute('data-theme') === 'light';
      if (isLight) {
        html.removeAttribute('data-theme');
        localStorage.setItem(key, 'dark');
      } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem(key, 'light');
      }
    });
  }
})();

// === Chat Widget ===
const MAX_CHAT = 5;
const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatLimit = document.getElementById('chatLimit');
const STORAGE_KEY = 'kuro_chat';
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
let saved, chatCount, chatHistory, cooldownUntil;

if (location.search.includes('reset-chat')) {
  localStorage.removeItem(STORAGE_KEY);
  history.replaceState(null, '', location.pathname);
  location.reload();
}

try {
  saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
} catch {}
saved = saved || {};
chatCount = saved.count || 0;
chatHistory = saved.history || [];
cooldownUntil = saved.cooldown || 0;

function saveChat() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    count: chatCount,
    history: chatHistory,
    cooldown: cooldownUntil
  }));
}

function restoreChat() {
  const now = Date.now();
  if (cooldownUntil > now) {
    chatCount = MAX_CHAT;
    chatHistory.forEach(msg => addMsg(msg.text, msg.role === 'user' ? 'user' : 'bot'));
    lockChat();
    updateChatLimit();
    startCooldownTimer();
    return;
  }
  if (cooldownUntil > 0 && cooldownUntil <= now) {
    chatCount = 0;
    chatHistory = [];
    cooldownUntil = 0;
    saveChat();
  }
  chatHistory.forEach(msg => addMsg(msg.text, msg.role === 'user' ? 'user' : 'bot'));
  if (chatCount >= MAX_CHAT) lockChat();
  updateChatLimit();
}

function startCooldownTimer() {
  chatLimit.textContent = 'Tunggu 24 jam untuk chat lagi';
  const interval = setInterval(() => {
    const remaining = cooldownUntil - Date.now();
    if (remaining <= 0) {
      clearInterval(interval);
      location.reload();
      return;
    }
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    chatLimit.textContent = 'Bisa chat lagi dalam ' + h + 'j ' + m + 'm';
  }, 60000);
}

function updateChatLimit() {
  const remaining = MAX_CHAT - chatCount;
  chatLimit.textContent = 'Sisa ' + remaining + ' dari ' + MAX_CHAT + ' pertanyaan';
  chatLimit.className = 'chat-limit';
  if (remaining === 0) chatLimit.classList.add('exhausted');
  else if (remaining <= 2) chatLimit.classList.add('warning');
}

function toggleChat() {
  chatPanel.classList.toggle('active');
  if (chatPanel.classList.contains('active')) chatInput.focus();
}

function closeChat() {
  chatPanel.classList.remove('active');
}

chatToggle?.addEventListener('click', toggleChat);
chatClose?.addEventListener('click', closeChat);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && chatPanel?.classList.contains('active')) closeChat();
});

function addMsg(text, role) {
  const div = document.createElement('div');
  div.className = 'chat-message ' + role;
  div.innerHTML = '<div class="chat-bubble">' + text + '</div>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'chat-message bot chat-typing';
  div.id = 'chatTyping';
  div.innerHTML = '<div class="chat-bubble"><span></span><span></span><span></span></div>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('chatTyping');
  if (el) el.remove();
}

function lockChat() {
  chatInput.disabled = true;
  chatSend.disabled = true;
  if (!cooldownUntil) {
    cooldownUntil = Date.now() + COOLDOWN_MS;
    saveChat();
  }
  const div = document.createElement('div');
  div.className = 'chat-limit-msg';
  div.textContent = '✕ Batas 5 pertanyaan tercapai. Kembali lagi besok ya!';
  chatMessages.parentNode.insertBefore(div, chatMessages.nextSibling);
  chatToggle.classList.add('hidden');
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || chatSend.disabled) return;

  chatInput.value = '';
  addMsg(escapeHtml(text), 'user');
  chatSend.disabled = true;
  chatCount++;
  updateChatLimit();
  chatHistory.push({ role: 'user', text });
  saveChat();

  if (chatCount > MAX_CHAT) {
    lockChat();
    return;
  }

  showTyping();

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: chatHistory.slice(-20) })
    });
    const data = await res.json();
    removeTyping();

    if (!data.reply) {
      chatHistory.pop();
      chatCount--;
      saveChat();
      updateChatLimit();
      chatSend.disabled = false;
      chatInput.focus();
      addMsg(data.error || 'Maaf, terjadi kesalahan. Coba lagi ya!', 'bot');
      return;
    }

    addMsg(data.reply, 'bot');
    chatHistory.push({ role: 'model', text: data.reply });
    saveChat();
  } catch {
    removeTyping();
    chatHistory.pop();
    chatCount--;
    saveChat();
    updateChatLimit();
    chatSend.disabled = false;
    chatInput.focus();
    addMsg('Maaf, koneksi terputus. Coba lagi nanti!', 'bot');
    return;
  }

  if (chatCount >= MAX_CHAT) {
    lockChat();
    return;
  }

  chatSend.disabled = false;
  chatInput.focus();
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

chatSend?.addEventListener('click', sendMessage);
chatInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

restoreChat();

// === Project Filter ===
const projectFilters = document.getElementById('projectFilters');
const allProjectCards = document.querySelectorAll('.project-card');

if (projectFilters && allProjectCards.length) {
  const techMap = new Map();
  allProjectCards.forEach(card => {
    card.querySelectorAll('.project-tech span').forEach(s => {
      const key = s.textContent.trim().toLowerCase();
      if (!techMap.has(key)) techMap.set(key, s.textContent.trim());
    });
  });

  const allBtn = document.createElement('button');
  allBtn.className = 'filter-btn active';
  allBtn.dataset.filter = 'all';
  allBtn.textContent = 'All';
  projectFilters.appendChild(allBtn);

  [...techMap.entries()].sort((a, b) => a[0].localeCompare(b[0])).forEach(([key, label]) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = key;
    btn.textContent = label;
    projectFilters.appendChild(btn);
  });

  projectFilters.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    projectFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    allProjectCards.forEach(card => {
      const techs = [...card.querySelectorAll('.project-tech span')].map(s => s.textContent.trim().toLowerCase());
      if (filter === 'all' || techs.includes(filter)) {
        card.style.display = '';
        card.classList.add('visible');
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// === Project Modal ===
const modal = document.getElementById('projectModal');
if (modal) {
  const modalBg = modal.querySelector('.modal-bg');
  const modalClose = document.getElementById('modalClose');
  const modalImg = document.getElementById('modalImg');
  const modalType = document.getElementById('modalType');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalFeaturesList = document.getElementById('modalFeaturesList');
  const modalTech = document.getElementById('modalTech');
  const modalGithub = document.getElementById('modalGithub');

  function openModal(card) {
    const img = card.querySelector('.project-img');
    const type = card.querySelector('.project-type');
    const title = card.querySelector('h3');
    const desc = card.querySelector('.project-body > p');
    const tech = card.querySelector('.project-tech');
    const features = card.querySelector('.project-features');
    const github = card.querySelector('.project-github');

    if (img) modalImg.style.background = img.style.background;
    if (type) modalType.textContent = type.textContent;
    if (title) modalTitle.textContent = title.textContent;
    if (desc) modalDesc.textContent = desc.textContent;

    modalTech.innerHTML = '';
    if (tech) {
      tech.querySelectorAll('span').forEach(s => {
        const tag = document.createElement('span');
        tag.textContent = s.textContent;
        modalTech.appendChild(tag);
      });
    }

    if (features) {
      modalFeatures.hidden = false;
      modalFeaturesList.innerHTML = '';
      features.querySelectorAll('li').forEach(li => {
        const item = document.createElement('li');
        item.textContent = li.textContent;
        modalFeaturesList.appendChild(item);
      });
    } else {
      modalFeatures.hidden = true;
    }

    modalGithub.href = github ? github.href : '#';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  allProjectCards.forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.project-overlay a')) return;
      openModal(card);
    });
  });

  modalBg.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}


