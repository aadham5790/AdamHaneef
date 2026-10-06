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
  const cmsWords =
    window.__CMS_DATA__ &&
    Array.isArray(window.__CMS_DATA__.hero?.typingWords) &&
    window.__CMS_DATA__.hero.typingWords.length
      ? window.__CMS_DATA__.hero.typingWords
      : null;
  const words =
    cmsWords || ["designs", "photos", "ventures", "art"];
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
    const addr = "adhanef@live.com";
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

function applyCMSData(data) {
  if (!data) return;
  const hero = data.hero || {};
  const titleEl = document.getElementById("intro-title");
  if (titleEl) titleEl.textContent = hero.title || titleEl.textContent;
  const leadEl = document.querySelector("#hero .lead");
  if (leadEl && hero.lead) {
    const typingEl = document.getElementById("typing");
    leadEl.firstChild.textContent = hero.lead + " ";
    if (typingEl) leadEl.appendChild(typingEl);
  }
  if (hero.counters) {
    document.querySelectorAll(".num").forEach((n) => {
      const lbl = n.nextElementSibling?.textContent?.toLowerCase() || "";
      if (lbl.includes("project")) {
        n.dataset.target = hero.counters.projects;
        n.textContent = hero.counters.projects;
      } else if (lbl.includes("skill")) {
        n.dataset.target = hero.counters.skills;
        n.textContent = hero.counters.skills;
      } else if (lbl.includes("focus")) {
        n.dataset.target = hero.counters.focus;
        n.textContent = hero.counters.focus;
      }
    });
  }
  const about = data.about || {};
  const aboutCard = document.querySelector("#about .section-card");
  if (aboutCard) {
    const ps = aboutCard.querySelectorAll("p.profile-subtitle");
    if (ps[0]) ps[0].textContent = about.bio || ps[0].textContent;
    if (ps[1]) ps[1].textContent = about.tagline || ps[1].textContent;
  }
  if (data.skills && data.skills.length) {
    const grid = document.querySelector("#skills .skills-grid");
    if (grid) {
      grid.innerHTML = "";
      data.skills.forEach((s) => {
        const span = document.createElement("span");
        span.className = "skill-pill";
        span.textContent = s;
        grid.appendChild(span);
      });
    }
  }
  if (data.experience && data.experience.length) {
    const expSection = document.querySelector("#experience .projects-grid");
    if (expSection) {
      expSection.innerHTML = "";
      data.experience.forEach((item, i) => {
        const art = document.createElement("article");
        art.className = "proj-card";
        art.tabIndex = 0;
        art.setAttribute("aria-labelledby", "e" + (i + 1));
        art.innerHTML = `<div class="proj-body"><div class="proj-title" id="e${i + 1}">${item.role || ""}</div><div class="proj-desc">${[item.org, item.period].filter(Boolean).join(" · ")}</div><div class="proj-desc">${item.desc || ""}</div></div>`;
        expSection.appendChild(art);
      });
    }
  }
  if (data.education && data.education.length) {
    const edSection = document.querySelector("#education .projects-grid");
    if (edSection) {
      edSection.innerHTML = "";
      data.education.forEach((item, i) => {
        const art = document.createElement("article");
        art.className = "proj-card";
        art.tabIndex = 0;
        art.setAttribute("aria-labelledby", "ed" + (i + 1));
        art.innerHTML = `<div class="proj-body"><div class="proj-title" id="ed${i + 1}">${item.name || ""}</div><div class="proj-desc">${[item.period, item.desc].filter(Boolean).join(" · ")}</div></div>`;
        edSection.appendChild(art);
      });
    }
  }
  if (data.projects && data.projects.length) {
    const projGrid = document.querySelector("#projects .projects-grid");
    if (projGrid) {
      projGrid.innerHTML = "";
      data.projects.forEach((p, i) => {
        const art = document.createElement("article");
        art.className = "proj-card";
        art.tabIndex = 0;
        art.setAttribute("aria-labelledby", "p" + (i + 1));
        const thumb = document.createElement("div");
        thumb.className = "proj-thumb";
        thumb.style.backgroundImage = p.thumb ? "url('" + p.thumb + "')" : "";
        const body = document.createElement("div");
        body.className = "proj-body";
        body.innerHTML = `<div class="proj-title" id="p${i + 1}">${p.title || ""}</div><div class="proj-desc">${p.desc || ""}</div>`;
        const demo = (p.demoUrl || p.linkUrl || '');
        const src = p.sourceUrl || '';
        const actions = document.createElement('div');
        actions.className = 'proj-actions';
        if (demo && demo !== '#') {
          const a1 = document.createElement('a');
          a1.className = 'btn-primary';
          a1.href = demo;
          a1.target = '_blank';
          a1.rel = 'noopener';
          a1.textContent = 'Live Demo';
          actions.appendChild(a1);
        }
        if (src && src !== '#') {
          const a2 = document.createElement('a');
          a2.className = 'btn-ghost';
          a2.href = src;
          a2.target = '_blank';
          a2.rel = 'noopener';
          a2.textContent = 'Source';
          actions.appendChild(a2);
        }
        if (actions.childNodes.length) body.appendChild(actions);
        art.appendChild(thumb);
        art.appendChild(body);
        projGrid.appendChild(art);
      });
    }
  }
  if (data.community && data.community.length) {
    const commGrid = document.querySelector("#community .skills-grid");
    if (commGrid) {
      commGrid.innerHTML = "";
      data.community.forEach((c) => {
        const span = document.createElement("span");
        span.className = "skill-pill";
        span.textContent = c;
        commGrid.appendChild(span);
      });
    }
  }
  const social = Array.isArray(data.social) ? data.social : [];
  const socialLinks = document.querySelector("#contact .contact-socials");
  if (socialLinks) {
    socialLinks.innerHTML = "";
    social.forEach((item) => {
      const url = item && item.url;
      const label = item && item.label;
      if (!url || !label) return;
      const a = document.createElement("a");
      a.className = "btn-ghost";
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = label;
      socialLinks.appendChild(a);
    });
  }
  if (data.profilePhoto) {
    const img = document.querySelector(".avatar img");
    if (img) img.src = data.profilePhoto;
  }
}

if (window.__CMS_DATA__) {
  applyCMSData(window.__CMS_DATA__);
}
window.addEventListener("cms-data-ready", (e) => applyCMSData(e.detail));
