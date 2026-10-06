const STORAGE_KEY = "portfolio-data";
const AUTH_KEY = "admin-auth";
const SESSION_TTL_MS = 30 * 60 * 1000;
const UNDO_WINDOW_MS = 30000;
const PAT_KEY = "gh-pat";
const GH_API = "https://api.github.com";
const GH_REPO = "aadham5790/AdamHaneef";
const GH_DATA_PATH = "assets/data/portfolio-data.json";

const DEFAULT_DATA = {
  hero: {
    title: "I design, capture, and build ventures with purpose",
    lead: "Self-motivated entrepreneur, designer, artist, and photographer sharing projects and lessons learned � I make",
    typingWords: ["designs", "photos", "ventures", "art"],
    counters: { projects: 3, skills: 6, focus: 100 }
  },
  about: {
    bio: "Self-motivated entrepreneur, designer, artist, and photographer. Founder of Saalhanga and Manager at Argo (Bright Brothers Pvt Ltd). Dawah volunteer at United Islamic Society. I share projects and lessons learned so others can achieve their goals.",
    tagline: "A little boy who grew up at the heart of Maldives with the love of his family, who tries to find ultimate happiness."
  },
  experience: [
    { role: "Manager", org: "Argo, Bright Brothers Pvt Ltd", period: "2010 � Present", desc: "Leading operations and management." },
    { role: "Security Guard", org: "Dh Atoll Council", period: "2009 � 2010", desc: "Public safety and facility security." },
    { role: "Cashier", org: "Avasthari", period: "2007 � 2009", desc: "Customer service and financial transactions." },
    { role: "Labour", org: "Faisal Carpentry", period: "2003 � 2007", desc: "Construction and carpentry support." }
  ],
  education: [
    { name: "Dh Atoll Education Center", period: "1994 � 2003", desc: "Secondary Education" },
    { name: "CITM", period: "2011 � 2012", desc: "Diploma in Information Technology" },
    { name: "Mobile Computer Training Center", period: "", desc: "Practical PC Usage Basics" },
    { name: "Javaabu Academy", period: "2022", desc: "Social Media Marketing Masterclass" }
  ],
  projects: [
    { title: "Design Portfolio", desc: "Brand identity, graphic design, and visual communication projects for clients and personal work.", thumb: "https://picsum.photos/seed/design/800/500", demoUrl: "", sourceUrl: "" },
    { title: "Photography", desc: "Portrait, landscape, and documentary photography capturing life and culture in the Maldives.", thumb: "https://picsum.photos/seed/photography/800/500", demoUrl: "", sourceUrl: "" },
    { title: "Entrepreneurship Ventures", desc: "Founding Saalhanga and managing Argo operations. Building businesses and creating opportunities.", thumb: "https://picsum.photos/seed/ventures/800/500", demoUrl: "", sourceUrl: "" }
  ],
  community: [
    "Dawah Volunteer � United Islamic Society",
    "Dh Kudahuvadhoo Council",
    "Maldives National University � Kudahuvadhoo Outreach",
    "Mi College � Kudahuvadhoo Outreach"
  ],
  skills: [
    "HTML & Accessibility",
    "CSS & Responsive Design",
    "JavaScript",
    "Git",
    "Deployment & Hosting",
    "Problem Solving"
  ],
  social: [
    { label: "GitHub", url: "https://github.com/aadham5790" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/adam-haneef/" },
    { label: "Facebook", url: "https://web.facebook.com/aadham5790/" }
  ],
  profilePhoto: "assets/images/IMG_215i5f.jpg"
};

function normalizeData(data) {
  if (data.social && !Array.isArray(data.social)) {
    const mapped = Object.entries(data.social).map(([k, v]) => ({ label: k.charAt(0).toUpperCase() + k.slice(1), url: v }));
    data.social = mapped;
  }
  for (const key of Object.keys(DEFAULT_DATA)) {
    if (data[key] === undefined || data[key] === null) {
      data[key] = JSON.parse(JSON.stringify(DEFAULT_DATA[key]));
    }
  }
  data.hero = data.hero || {};
  for (const key of Object.keys(DEFAULT_DATA.hero)) {
    if (data.hero[key] === undefined || data.hero[key] === null) {
      data.hero[key] = JSON.parse(JSON.stringify(DEFAULT_DATA.hero[key]));
    }
  }
  if (!data.hero.counters || typeof data.hero.counters !== "object") {
    data.hero.counters = JSON.parse(JSON.stringify(DEFAULT_DATA.hero.counters));
  }
  if (Array.isArray(data.projects)) {
    for (const p of data.projects) {
      if (p.demoUrl === undefined) p.demoUrl = p.linkUrl || "";
      if (p.sourceUrl === undefined) p.sourceUrl = "";
      delete p.linkLabel;
      delete p.linkUrl;
    }
  }
  return data;
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_DATA));
    return normalizeData(data);
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

// ---------- auth ----------

function readAuth() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    const obj = raw ? JSON.parse(raw) : null;
    if (!obj || typeof obj.t !== "number") return null;
    if (Date.now() - obj.t > SESSION_TTL_MS) return null;
    return obj;
  } catch {
    return null;
  }
}

function touchSession() {
  try {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify({ t: Date.now() }));
  } catch {
    // storage unavailable: session simply cannot be extended
  }
}

function requireAuth() {
  if (!readAuth()) {
    window.location.href = "login.html";
    return false;
  }
  touchSession();
  return true;
}

function logout() {
  try { sessionStorage.removeItem(AUTH_KEY); } catch (e) {}
  window.location.href = "login.html";
}

// ---------- status ----------

let statusTimer = null;

function status(msg, kind) {
  const el = document.getElementById("status");
  if (!el) return;
  clearTimeout(statusTimer);
  statusTimer = null;
  el.textContent = msg || "";
  el.classList.remove("ok", "err", "warn");
  if (kind === "ok") el.classList.add("ok");
  else if (kind === "err") el.classList.add("err");
  else if (kind === "warn") el.classList.add("warn");
  if (msg && kind !== "sticky") {
    statusTimer = setTimeout(() => {
      el.textContent = "";
      el.classList.remove("ok", "err", "warn");
    }, 4000);
  }
}

// ---------- dirty tracking / autosave ----------

let dirty = false;
let autosaveTimer = null;

function markDirty() {
  dirty = true;
  touchSession();
  status("Unsaved changes", "warn");
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(autosave, 2000);
}

function autosave() {
  if (!dirty) return;
  if (saveData(currentData)) {
    dirty = false;
    status("Autosaved " + new Date().toLocaleTimeString(), "ok");
  } else {
    status("Save failed � browser storage may be full", "err");
  }
}

function saveNow() {
  clearTimeout(autosaveTimer);
  if (saveData(currentData)) {
    dirty = false;
    status("Saved " + new Date().toLocaleTimeString(), "ok");
  } else {
    status("Save failed � browser storage may be full", "err");
  }
}

// ---------- undo for removed rows ----------

const UNDO_STORAGE_KEY = 'portfolio-undo-stack';

let lastRemoved = null;
let undoTimer = null;
let undoCountdownTimer = null;
let undoBtn = null;

function loadUndoStack() {
  try {
    const raw = sessionStorage.getItem(UNDO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.key === 'string' && typeof parsed.index === 'number' && parsed.item) {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
}

function saveUndoStack(data) {
  if (data) data._ts = Date.now();
  try {
    if (data) {
      sessionStorage.setItem(UNDO_STORAGE_KEY, JSON.stringify(data));
    } else {
      sessionStorage.removeItem(UNDO_STORAGE_KEY);
    }
  } catch (e) {}
}

function startUndoCountdown(remainingMs) {
  clearInterval(undoCountdownTimer);
  const updateStatus = () => {
    const seconds = Math.ceil(remainingMs / 1000);
    if (seconds > 0) {
      status('Undo available for ' + seconds + 's', 'ok');
      remainingMs -= 1000;
    } else {
      clearInterval(undoCountdownTimer);
    }
  };
  updateStatus();
  undoCountdownTimer = setInterval(updateStatus, 1000);
}

function queueUndo(key, index, item, renderRows, label) {
  lastRemoved = { key, index, item, renderRows, label };
  clearTimeout(undoTimer);
  clearInterval(undoCountdownTimer);
  if (undoBtn) undoBtn.hidden = false;
  saveUndoStack(lastRemoved);
  startUndoCountdown(UNDO_WINDOW_MS);
  undoTimer = setTimeout(() => {
    lastRemoved = null;
    clearInterval(undoCountdownTimer);
    saveUndoStack(null);
    if (undoBtn) undoBtn.hidden = true;
    status('', 'ok');
  }, UNDO_WINDOW_MS);
}

function doUndo() {
  if (!lastRemoved) return;
  const { key, index, item, renderRows } = lastRemoved;
  const arr = currentData[key] || [];
  arr.splice(index, 0, item);
  currentData[key] = arr;
  lastRemoved = null;
  clearTimeout(undoTimer);
  clearInterval(undoCountdownTimer);
  saveUndoStack(null);
  if (undoBtn) undoBtn.hidden = true;
  renderRows();
  markDirty();
  status('Restored', 'ok');
}

// ---------- field helpers ----------

function setField(path, value) {
  const parts = path.split(".");
  let obj = currentData;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (/^\d+$/.test(p)) {
      obj = obj[parseInt(p, 10)];
    } else {
      obj = obj[p];
    }
  }
  const last = parts[parts.length - 1];
  if (/^\d+$/.test(last)) {
    obj[parseInt(last, 10)] = value;
  } else {
    obj[last] = value;
  }
}

function getField(path) {
  const parts = path.split(".");
  let obj = currentData;
  for (const p of parts) {
    if (/^\d+$/.test(p)) {
      obj = obj[parseInt(p, 10)];
    } else {
      obj = obj[p];
    }
  }
  return obj;
}

function esc(str) { return String(str || ""); }

function validateUrlInput(input) {
  const v = String(input.value || "").trim();
  const ok = !v || v === "#" || /^(https?:)?\/\//.test(v) || v.charAt(0) === "/";
  input.classList.toggle("invalid", !ok);
  input.title = ok ? "" : "URL should start with http(s):// or /";
}

function updatePreview(url, img) {
  if (!img) return;
  url = String(url || "").trim();
  if (!url) {
    img.style.display = "none";
    return;
  }
  img.style.display = "";
  img.onerror = () => { img.style.display = "none"; };
  img.src = url;
}

function schedulePreview(input, img) {
  clearTimeout(input._previewTimer);
  input._previewTimer = setTimeout(() => updatePreview(input.value, img), 300);
}

// ---------- panels ----------

function buildArrayPanel(key, fields, container) {
  const data = currentData[key] || [];
  container.innerHTML = "";
  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn";
  addBtn.textContent = "+ Add " + key;
  addBtn.style.marginBottom = "10px";
  container.appendChild(addBtn);

  function renderRows() {
    container.querySelectorAll(".card").forEach((c) => c.remove());
    data.forEach((item, i) => {
      const card = document.createElement("div");
      card.className = "card";
      fields.forEach((f) => {
        const label = document.createElement("label");
        label.textContent = f.label;
        const input = document.createElement(f.tag === "textarea" ? "textarea" : "input");
        if (f.tag !== "textarea") input.type = f.type || "text";
        input.className = f.class || "";
        input.value = item[f.key] || "";
        let preview = null;
        if (f.preview) {
          preview = document.createElement("img");
          preview.className = "img-preview";
          preview.alt = "";
        }
        input.addEventListener("input", () => {
          item[f.key] = input.value;
          markDirty();
          if (f.type === "url") validateUrlInput(input);
          if (f.preview) schedulePreview(input, preview);
        });
        card.appendChild(label);
        card.appendChild(input);
        if (f.type === "url") validateUrlInput(input);
        if (preview) {
          card.appendChild(preview);
          schedulePreview(input, preview);
        }
      });
      const rm = document.createElement("button");
      rm.type = "button";
      rm.className = "btn remove";
      rm.textContent = "Remove";
      rm.addEventListener("click", () => {
        const label0 = String(item[fields[0].key] || "").trim() || (key + " #" + (i + 1));
        data.splice(i, 1);
        renderRows();
        markDirty();
        queueUndo(key, i, item, renderRows, label0);
      });
      card.appendChild(rm);
      container.appendChild(card);
    });
  }
  addBtn.addEventListener("click", () => {
    const blank = {};
    fields.forEach((f) => { blank[f.key] = ""; });
    data.push(blank);
    renderRows();
    markDirty();
  });
  renderRows();
}

function buildHeroPanel(container) {
  const d = currentData.hero;
  container.innerHTML = "";

  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Title";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.setAttribute("data-path", "hero.title");
  titleInput.value = d.title;
  container.appendChild(titleLabel);
  container.appendChild(titleInput);

  const leadLabel = document.createElement("label");
  leadLabel.textContent = "Lead";
  const leadInput = document.createElement("textarea");
  leadInput.setAttribute("data-path", "hero.lead");
  leadInput.value = d.lead;
  container.appendChild(leadLabel);
  container.appendChild(leadInput);

  const typingLabel = document.createElement("label");
  typingLabel.textContent = "Typing Words (comma separated)";
  const typingInput = document.createElement("input");
  typingInput.type = "text";
  typingInput.setAttribute("data-path", "hero.typingWords");
  typingInput.value = (d.typingWords || []).join(", ");
  container.appendChild(typingLabel);
  container.appendChild(typingInput);

  const rowDiv = document.createElement("div");
  rowDiv.className = "row";

  const projectsDiv = document.createElement("div");
  const projectsLabel = document.createElement("label");
  projectsLabel.textContent = "Projects Count";
  const projectsInput = document.createElement("input");
  projectsInput.type = "number";
  projectsInput.setAttribute("data-path", "hero.counters.projects");
  projectsInput.value = d.counters.projects;
  projectsDiv.appendChild(projectsLabel);
  projectsDiv.appendChild(projectsInput);
  rowDiv.appendChild(projectsDiv);

  const skillsDiv = document.createElement("div");
  const skillsLabel = document.createElement("label");
  skillsLabel.textContent = "Skills Count";
  const skillsInput = document.createElement("input");
  skillsInput.type = "number";
  skillsInput.setAttribute("data-path", "hero.counters.skills");
  skillsInput.value = d.counters.skills;
  skillsDiv.appendChild(skillsLabel);
  skillsDiv.appendChild(skillsInput);
  rowDiv.appendChild(skillsDiv);

  const focusDiv = document.createElement("div");
  const focusLabel = document.createElement("label");
  focusLabel.textContent = "Focus Count";
  const focusInput = document.createElement("input");
  focusInput.type = "number";
  focusInput.setAttribute("data-path", "hero.counters.focus");
  focusInput.value = d.counters.focus;
  focusDiv.appendChild(focusLabel);
  focusDiv.appendChild(focusInput);
  rowDiv.appendChild(focusDiv);

  container.appendChild(rowDiv);

  container.querySelectorAll("input, textarea").forEach((el) => {
    el.addEventListener("input", () => {
      const path = el.getAttribute("data-path");
      if (path === "hero.typingWords") {
        setField(path, el.value.split(",").map((s) => s.trim()).filter(Boolean));
      } else if (/^hero\.counters\.(projects|skills|focus)$/.test(path)) {
        setField(path, parseInt(el.value || "0", 10) || 0);
      } else {
        setField(path, el.value);
      }
      markDirty();
    });
  });
}

function buildAboutPanel(container) {
  const d = currentData.about;
  const photo = String(currentData.profilePhoto || "");
  container.innerHTML = "";

  const bioLabel = document.createElement("label");
  bioLabel.textContent = "Bio";
  const bioInput = document.createElement("textarea");
  bioInput.setAttribute("data-path", "about.bio");
  bioInput.value = d.bio;
  container.appendChild(bioLabel);
  container.appendChild(bioInput);

  const taglineLabel = document.createElement("label");
  taglineLabel.textContent = "Tagline";
  const taglineInput = document.createElement("textarea");
  taglineInput.setAttribute("data-path", "about.tagline");
  taglineInput.value = d.tagline;
  container.appendChild(taglineLabel);
  container.appendChild(taglineInput);

  const photoLabel = document.createElement("label");
  photoLabel.textContent = "Profile Photo URL";
  container.appendChild(photoLabel);

  const rowDiv = document.createElement("div");
  rowDiv.className = "row";

  const inputDiv = document.createElement("div");
  const photoInput = document.createElement("input");
  photoInput.type = "text";
  photoInput.setAttribute("data-path", "profilePhoto");
  photoInput.value = photo;
  inputDiv.appendChild(photoInput);
  rowDiv.appendChild(inputDiv);

  const previewDiv = document.createElement("div");
  const previewImg = document.createElement("img");
  previewImg.id = "photo-preview";
  previewImg.className = "img-preview";
  previewImg.alt = "Profile photo preview";
  previewDiv.appendChild(previewImg);
  rowDiv.appendChild(previewDiv);

  container.appendChild(rowDiv);

  container.querySelectorAll("input, textarea").forEach((el) => {
    el.addEventListener("input", () => {
      const path = el.getAttribute("data-path");
      setField(path, el.value);
      markDirty();
      if (path === "profilePhoto") {
        updatePreview(el.value, document.getElementById("photo-preview"));
      }
    });
  });
  updatePreview(photo, document.getElementById("photo-preview"));
}

function buildCommunityPanel(container) {
  const arr = currentData.community;
  container.innerHTML = "";

  const label = document.createElement("label");
  label.textContent = "Community Items (one per line)";
  const ta = document.createElement("textarea");
  ta.id = "community-ta";
  ta.rows = 8;
  ta.value = arr.join("\n");
  container.appendChild(label);
  container.appendChild(ta);

  ta.addEventListener("input", () => {
    currentData.community = ta.value.split("\n").map((s) => s.trim()).filter(Boolean);
    markDirty();
  });
}

function buildSkillsPanel(container) {
  const arr = currentData.skills;
  container.innerHTML = "";

  const label = document.createElement("label");
  label.textContent = "Skills (one per line)";
  const ta = document.createElement("textarea");
  ta.id = "skills-ta";
  ta.rows = 8;
  ta.value = arr.join("\n");
  ta.addEventListener("input", () => {
    currentData.skills = ta.value.split("\n").map((s) => s.trim()).filter(Boolean);
    markDirty();
  });
  container.appendChild(label);
  container.appendChild(ta);
}

function buildSocialPanel(container) {
  buildArrayPanel("social", [
    { key: "label", label: "Label" },
    { key: "url", label: "URL", type: "url" }
  ], container);
}

function buildProjectsPanel(container) {
  buildArrayPanel("projects", [
    { key: "title", label: "Title" },
    { key: "desc", label: "Description", tag: "textarea" },
    { key: "thumb", label: "Thumbnail URL", type: "url", preview: true },
    { key: "demoUrl", label: "Live Demo URL", type: "url" },
    { key: "sourceUrl", label: "Source URL", type: "url" }
  ], container);
}

function buildExperiencePanel(container) {
  buildArrayPanel("experience", [
    { key: "role", label: "Role" },
    { key: "org", label: "Organization" },
    { key: "period", label: "Period" },
    { key: "desc", label: "Description", tag: "textarea" }
  ], container);
}

function buildEducationPanel(container) {
  buildArrayPanel("education", [
    { key: "name", label: "Name" },
    { key: "period", label: "Period" },
    { key: "desc", label: "Description" }
  ], container);
}

function buildAccountPanel(container) {
  let storedPat = "";
  try { storedPat = sessionStorage.getItem(PAT_KEY) || ""; } catch (e) {}
  container.innerHTML = "";

  const patLabel = document.createElement("label");
  patLabel.textContent = "GitHub personal access token";
  const patInput = document.createElement("input");
  patInput.type = "password";
  patInput.id = "pat-input";
  patInput.autocomplete = "off";
  patInput.placeholder = "github_pat_�";
  patInput.value = storedPat;
  container.appendChild(patLabel);
  container.appendChild(patInput);

  const rowDiv = document.createElement("div");
  rowDiv.className = "row";

  const testDiv = document.createElement("div");
  const testBtn = document.createElement("button");
  testBtn.type = "button";
  testBtn.id = "pat-test";
  testBtn.className = "btn";
  testBtn.textContent = "Test token";
  testDiv.appendChild(testBtn);
  rowDiv.appendChild(testDiv);

  const buttonsDiv = document.createElement("div");
  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.id = "pat-save";
  saveBtn.className = "btn primary";
  saveBtn.textContent = "Save token";
  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.id = "pat-clear";
  clearBtn.className = "btn";
  clearBtn.textContent = "Clear";
  buttonsDiv.appendChild(saveBtn);
  buttonsDiv.appendChild(clearBtn);
  rowDiv.appendChild(buttonsDiv);

  container.appendChild(rowDiv);

  const hintP = document.createElement("p");
  hintP.className = "hint";
  hintP.id = "pat-hint";
  container.appendChild(hintP);

  const hint2 = document.createElement("p");
  hint2.className = "hint";
  hint2.textContent = "Use a fine-grained token scoped to this repository with Contents: read and write and an expiry. While a token is saved, Publish commits changes to the repo automatically; otherwise it downloads a file for manual commit. The token is stored only in this browser session.";
  container.appendChild(hint2);

  const hint = (msg, kind) => {
    const el = document.getElementById("pat-hint");
    el.textContent = msg || "";
    el.className = "hint" + (kind ? " " + kind : "");
  };
  const input = document.getElementById("pat-input");
  document.getElementById("pat-save").addEventListener("click", () => {
    const v = input.value.trim();
    if (!v) {
      hint("Enter a token first", "err");
      return;
    }
    try {
      sessionStorage.setItem(PAT_KEY, v);
      hint("Token saved � Publish now commits to the repo automatically.", "ok");
    } catch (e) {
      hint("Could not store token in this browser", "err");
    }
  });
  document.getElementById("pat-clear").addEventListener("click", () => {
    try { sessionStorage.removeItem(PAT_KEY); } catch (e) {}
    input.value = "";
    hint("Token cleared � Publish downloads a file for manual commit.", "ok");
  });
  document.getElementById("pat-test").addEventListener("click", async () => {
    const v = input.value.trim() || storedPat;
    if (!v) {
      hint("Enter a token first", "err");
      return;
    }
    hint("Testing�");
    try {
      const res = await fetch(GH_API + "/user", {
        headers: { Authorization: "Bearer " + v, "Accept": "application/vnd.github+json" }
      });
      if (res.ok) {
        const u = await res.json();
        hint("OK � authenticated as " + u.login + ".", "ok");
      } else {
        hint("Rejected (HTTP " + res.status + ") � token needs Contents: read and write for " + GH_REPO, "err");
      }
    } catch (e) {
      hint("Test failed � network error", "err");
    }
  });
  if (storedPat) hint("Token on file (session only) � Publish commits to the repo automatically.", "ok");
}

const SECTIONS = [
  { key: "hero", label: "Hero" },
  { key: "about", label: "About" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "projects", label: "Projects" },
  { key: "community", label: "Community" },
  { key: "skills", label: "Skills" },
  { key: "social", label: "Social" },
  { key: "account", label: "Account" }
];

const BUILDERS = {
  hero: buildHeroPanel,
  about: buildAboutPanel,
  experience: buildExperiencePanel,
  education: buildEducationPanel,
  projects: buildProjectsPanel,
  community: buildCommunityPanel,
  skills: buildSkillsPanel,
  social: buildSocialPanel,
  account: buildAccountPanel
};

let currentData = loadData();

function renderEditors() {
  const tabsEl = document.getElementById("tabs");
  const panelsEl = document.getElementById("panels");
  tabsEl.innerHTML = "";
  panelsEl.innerHTML = "";
  SECTIONS.forEach((sec, idx) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "tab";
    tab.textContent = sec.label;
    tab.id = "tab-" + sec.key;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", "panel-" + sec.key);
    tab.setAttribute("aria-selected", idx === 0 ? "true" : "false");
    tab.tabIndex = idx === 0 ? 0 : -1;
    const select = () => {
      tabsEl.querySelectorAll(".tab").forEach((t) => {
        t.setAttribute("aria-selected", "false");
        t.tabIndex = -1;
      });
      panelsEl.querySelectorAll(".panel").forEach((p) => p.classList.remove("open"));
      tab.setAttribute("aria-selected", "true");
      tab.tabIndex = 0;
      const panel = document.getElementById("panel-" + sec.key);
      if (panel) panel.classList.add("open");
    };
    tab.addEventListener("click", select);
    tab.addEventListener("keydown", (e) => {
      const tabs = Array.from(tabsEl.querySelectorAll(".tab"));
      const i = tabs.indexOf(tab);
      let next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") next = tabs[0];
      else if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        next.focus();
        next.click();
      }
    });
    tabsEl.appendChild(tab);

    const panel = document.createElement("div");
    panel.id = "panel-" + sec.key;
    panel.className = "panel" + (idx === 0 ? " open" : "");
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", "tab-" + sec.key);
    panelsEl.appendChild(panel);
    if (BUILDERS[sec.key]) BUILDERS[sec.key](panel);
  });
}

// ---------- export / import / publish ----------

function downloadJSON() {
  const blob = new Blob([JSON.stringify(currentData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "portfolio-data.json";
  a.click();
  URL.revokeObjectURL(url);
}

function exportJSON() {
  downloadJSON();
  status("Exported portfolio-data.json", "ok");
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        status("Import failed � file is not a portfolio data object", "err");
        return;
      }
      currentData = normalizeData(parsed);
      lastRemoved = null;
      if (undoBtn) undoBtn.hidden = true;
      renderEditors();
      markDirty();
      status("Imported � current content replaced, will autosave", "ok");
    } catch (e) {
      status("Import failed � not valid JSON", "err");
    }
  };
  reader.onerror = () => status("Import failed � could not read file", "err");
  reader.readAsText(file);
}

function getPat() {
  try { return sessionStorage.getItem(PAT_KEY) || ""; } catch (e) { return ""; }
}

function publish() {
  if (getPat()) publishApi();
  else publishManual();
}

function publishManual() {
  downloadJSON();
  status("Downloaded portfolio-data.json � put it in assets/data/ in the repo, then commit & push", "sticky");
}

function httpError(statusCode) {
  const e = new Error("http " + statusCode);
  e.status = statusCode;
  return e;
}

function authHeaders(extra) {
  const h = { "Accept": "application/vnd.github+json" };
  const pat = getPat();
  if (pat) h.Authorization = "Bearer " + pat;
  if (extra) Object.assign(h, extra);
  return h;
}

async function publishApi() {
  status("Publishing�", "warn");
  const payload = JSON.stringify(currentData, null, 2);
  const apiPath = "/repos/" + GH_REPO + "/contents/" + GH_DATA_PATH;
  const delays = [1000, 2000, 4000];
  let sha = null;

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, delays[attempt - 1]));
      }

      const res0 = await fetch(GH_API + apiPath, { headers: authHeaders() });
      if (res0.ok) {
        sha = (await res0.json()).sha;
      } else if (res0.status !== 404) {
        throw httpError(res0.status);
      }

      const bytes = new TextEncoder().encode(payload);
      let bin = "";
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      const body = {
        content: btoa(bin),
        message: "Update portfolio content",
        branch: "main"
      };
      if (sha) body.sha = sha;

      const res = await fetch(GH_API + apiPath, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(body)
      });

      if (res.ok) {
        status("Published � public site updates in ~1 min", "ok");
        return;
      }

      if (res.status === 409 && attempt < delays.length) {
        sha = null;
        continue;
      }

      throw httpError(res.status);
    } catch (err) {
      const isNetworkError = err && !err.status;
      const isConflict = err && err.status === 409;
      if ((isNetworkError || isConflict) && attempt < delays.length) {
        sha = null;
        continue;
      }
      if (err && err.status === 409) status("File changed elsewhere � refresh and retry", "err");
      else if (err && (err.status === 401 || err.status === 403)) status("Token invalid or missing Contents:read+write", "err");
      else status("Publish failed � use Export to publish manually", "err");
      return;
    }
  }
}

// ---------- init ----------

document.addEventListener("DOMContentLoaded", () => {
  if (!requireAuth()) return;
  undoBtn = document.getElementById("undoBtn");
  const savedUndo = loadUndoStack();
  if (savedUndo && savedUndo.renderRows) {
    lastRemoved = savedUndo;
    if (undoBtn) undoBtn.hidden = false;
    const elapsed = Date.now() - (savedUndo._ts || Date.now());
    const remaining = UNDO_WINDOW_MS - elapsed;
    if (remaining > 0) {
      startUndoCountdown(remaining);
      undoTimer = setTimeout(() => {
        lastRemoved = null;
        clearInterval(undoCountdownTimer);
        saveUndoStack(null);
        if (undoBtn) undoBtn.hidden = true;
        status("", "ok");
      }, remaining);
    } else {
      lastRemoved = null;
      saveUndoStack(null);
      if (undoBtn) undoBtn.hidden = true;
    }
  }
  renderEditors();
  document.getElementById("saveBtn").addEventListener("click", saveNow);
  document.getElementById("previewBtn").addEventListener("click", () => {
    window.open("index.html?preview=1", "_blank");
  });
  document.getElementById("publishBtn").addEventListener("click", publish);
  document.getElementById("exportBtn").addEventListener("click", exportJSON);
  const importBtn = document.getElementById("importBtn");
  const importFile = document.getElementById("importFile");
  importFile.addEventListener("change", () => {
    if (importFile.files && importFile.files[0]) importJSON(importFile.files[0]);
    importFile.value = "";
  });
  importBtn.addEventListener("click", () => importFile.click());
  if (undoBtn) undoBtn.addEventListener("click", doUndo);
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
  window.addEventListener("beforeunload", (e) => {
    if (dirty) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
  const sessionTimer = setInterval(() => {
    if (!readAuth()) {
      clearInterval(sessionTimer);
      logout();
    }
  }, 60000);
});














