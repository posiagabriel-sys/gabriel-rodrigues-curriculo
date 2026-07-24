document.getElementById("year").textContent = new Date().getFullYear();

const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const root = document.documentElement;

const getPreferredTheme = () => {
  const saved = localStorage.getItem("cv-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

const applyTheme = (theme) => {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("cv-theme", theme);
  themeIcon.className = theme === "light" ? "bi bi-moon-stars-fill" : "bi bi-sun-fill";
  themeToggle.setAttribute(
    "aria-label",
    theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"
  );
};

applyTheme(getPreferredTheme());

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(next);
});

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  const icon = navToggle.querySelector("i");
  icon.className = navLinks.classList.contains("open") ? "bi bi-x-lg" : "bi bi-list";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.querySelector("i").className = "bi bi-list";
  });
});

const sections = document.querySelectorAll("section[id], header[id]");
const menuLinks = document.querySelectorAll(".nav__links a");

const highlightNav = () => {
  const scrollY = window.scrollY + 120;
  let current = "";

  sections.forEach((section) => {
    if (scrollY >= section.offsetTop) {
      current = section.getAttribute("id");
    }
  });

  menuLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
};

window.addEventListener("scroll", highlightNav);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const langObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
        langObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll(".lang__bar").forEach((bar) => langObserver.observe(bar));

/* —— Particle network (discreet) —— */
(() => {
  const canvas = document.getElementById("fxCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let particles = [];
  let width = 0;
  let height = 0;
  let raf = 0;

  const cssColor = (name, fallback) =>
    getComputedStyle(root).getPropertyValue(name).trim() || fallback;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const count = Math.min(55, Math.floor((width * height) / 28000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const dot = cssColor("--fx-dot", "rgba(77,124,255,0.55)");
    const line = cssColor("--fx-line", "rgba(77,124,255,0.12)");

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dot;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = line;
          ctx.globalAlpha = 1 - dist / 120;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    raf = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize);

  if (!reduceMotion) {
    draw();
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else if (!reduceMotion) {
      draw();
    }
  });
})();
