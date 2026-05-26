// === Particles ===
if (typeof particlesJS !== 'undefined') {
  particlesJS('particles-canvas', {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: '#64ffda' },
      shape: { type: 'circle' },
      opacity: { value: 0.12, random: true },
      size: { value: 2, random: true },
      line_linked: {
        enable: true,
        distance: 120,
        color: '#64ffda',
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
      cursorFollower.style.borderColor = 'rgba(100, 255, 218, 0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorFollower.style.borderColor = 'rgba(100, 255, 218, 0.3)';
    });
  });
}

// === Typing Effect ===
const typingText = document.querySelector('.typing-text');
const words = ['Web Applications.', 'Mobile Apps.', 'Laravel Apps.', 'Digital Products.'];
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

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
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
        const target = parseInt(num.getAttribute('data-target'));
        const duration = 2000;
        const step = Math.ceil(target / (duration / 16));
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current >= target) {
            num.textContent = target + '+';
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
});
