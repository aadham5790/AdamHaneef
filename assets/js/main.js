const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

document.documentElement.classList.remove("no-js");

const hamburger = $("#hamburger");
const navLinks = $("#navLinks");
hamburger &&
  navLinks &&
  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (navLinks) navLinks.classList.remove("show");
    if (hamburger) hamburger.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks && navLinks.classList.contains("show")) {
    navLinks.classList.remove("show");
    if (hamburger) hamburger.setAttribute("aria-expanded", "false");
    hamburger && hamburger.focus();
  }
});

(function typing() {
  const el = document.getElementById("typing");
  if (!el) return;
  const words = ["designs", "photos", "ventures", "art"];
  let wi = 0,
    ci = 0,
    deleting = false;
  function step() {
    const word = words[wi];
    el.textContent = word.slice(0, ci);
    if (!deleting) {
      if (ci < word.length) {
        ci++;
        setTimeout(step, 80);
      } else {
        deleting = true;
        setTimeout(step, 900);
      }
    } else {
      if (ci > 0) {
        ci--;
        setTimeout(step, 40);
      } else {
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(step, 240);
      }
    }
  }
  step();
})();

const revealEls = $$(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

(function counters() {
  const nums = $$(".num");
  if (!nums.length) return;
  const done = new WeakSet();
  const obs = new IntersectionObserver(
    (entries, o) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          nums.forEach((n) => {
            if (done.has(n)) return;
            done.add(n);
            if (n.dataset.intervalId) clearInterval(Number(n.dataset.intervalId));
            const target = parseInt(n.dataset.target || "0", 10);
            let current = 0;
            const step = Math.max(1, Math.floor(target / 90));
            const id = setInterval(() => {
              current += step;
              if (current >= target) {
                n.textContent = target;
                clearInterval(id);
                delete n.dataset.intervalId;
              } else n.textContent = current;
            }, 16);
            n.dataset.intervalId = String(id);
          });
          o.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );
  const profile = document.querySelector(".stat-row");
  if (profile) obs.observe(profile);
})();

(function contactForm() {
  const form = $("#contactForm");
  const msg = $("#formMsg");
  const btn = $("#submitBtn");
  if (!form) return;

  function mailtoFallback(data) {
    const addr = "adam@example.com";
    const sub = encodeURIComponent(data.get("subject") || "Portfolio Contact");
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`
    );
    window.location.href = `mailto:${addr}?subject=${sub}&body=${body}`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = "Sending...";
    msg.textContent = "";

    const data = new FormData(form);
    const userId = form.getAttribute("data-emailjs-user");
    const serviceId = form.getAttribute("data-emailjs-service");
    const templateId = form.getAttribute("data-emailjs-template");

    if (userId && serviceId && templateId && typeof emailjs !== "undefined") {
      emailjs
        .sendForm(serviceId, templateId, form, userId)
        .then(() => {
          msg.style.color = "#8fe39a";
          msg.textContent = "Message sent — thank you!";
          form.reset();
        })
        .catch(() => {
          mailtoFallback(data);
        })
        .finally(() => {
          btn.disabled = false;
          btn.textContent = "Send message";
        });
    } else {
      mailtoFallback(data);
      btn.disabled = false;
      btn.textContent = "Send message";
    }
  });
})();

window.addEventListener("keydown", (e) => {
  if (e.key === "Tab")
    document.documentElement.classList.add("show-focus");
});

window.addEventListener("keyup", (e) => {
  if (e.key === "Tab")
    document.documentElement.classList.remove("show-focus");
});

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

function getStoredTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  });
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!getStoredTheme()) {
    applyTheme(e.matches ? "dark" : "light");
  }
});

const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });
