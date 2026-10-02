const STORAGE_KEY = 'portfolio-data';

const DEFAULT_DATA = {
  hero: {
    title: 'I design, capture, and build ventures with purpose',
    lead: 'Self-motivated entrepreneur, designer, artist, and photographer sharing projects and lessons learned so you can achieve too.',
    typingWords: ['designs', 'photos', 'ventures', 'art'],
    counters: { projects: 4, skills: 5, focus: 100 }
  },
  about: {
    bio: 'Self-motivated entrepreneur, designer, artist, and photographer. Founder of Saalhaga and Manager at Argo (Bright Brothers Pvt Ltd). Dawah volunteer at United Islamic Society. I share projects and lessons learned so others can achieve their goals.',
    tagline: 'A little boy who grew up at the heart of Maldives with the love of his family, who tries to find ultimate happiness.'
  },
  experience: [
    { role: 'Manager', org: 'Argo, Bright Brothers Pvt Ltd', period: '2010 – Present', desc: 'Leading operations and management.' },
    { role: 'Security Guard', org: 'Dh Atoll Council', period: '2009 – 2010', desc: 'Public safety and facility security.' },
    { role: 'Cashier', org: 'Avasthari', period: '2007 – 2009', desc: 'Customer service and financial transactions.' },
    { role: 'Labour', org: 'Faisal Carpentry', period: '2003 – 2007', desc: 'Construction and carpentry support.' }
  ],
  education: [
    { name: 'Dh Atoll Education Center', period: '1994 – 2003', desc: 'Secondary Education' },
    { name: 'CITM', period: '2011 – 2012', desc: 'Technical/Professional Training' }
  ],
  projects: [
    { title: 'Design Portfolio', desc: 'Brand identity, graphic design, and visual communication projects for clients and personal work.', thumb: 'https://picsum.photos/seed/design/800/500', linkLabel: 'View Work', linkUrl: '#' },
    { title: 'Photography', desc: 'Portrait, landscape, and documentary photography capturing life and culture in the Maldives.', thumb: 'https://picsum.photos/seed/photography/800/500', linkLabel: 'View Gallery', linkUrl: '#' },
    { title: 'Entrepreneurship Ventures', desc: 'Founding Saalhaga and managing Argo operations. Building businesses and creating opportunities.', thumb: 'https://picsum.photos/seed/ventures/800/500', linkLabel: 'Learn More', linkUrl: '#' }
  ],
  community: [
    'Dawah Volunteer — United Islamic Society',
    'Dh Kudahuvadhoo Council',
    'Maldives National University — Kudahuvadhoo Outreach',
    'Mi College — Kudahuvadhoo Outreach'
  ],
  skills: [
    'HTML & Accessibility',
    'CSS & Responsive Design',
    'JavaScript',
    'Git',
    'Deployment & Hosting',
    'Problem Solving'
  ],
  social: [
    { label: 'GitHub', url: 'https://github.com/aadham5790' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/adam-haneef/' },
    { label: 'Facebook', url: 'https://web.facebook.com/aadham5790/' }
  ],
  profilePhoto: 'assets/images/IMG_215i5f.jpg'
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_DATA));
    if (data.social && !Array.isArray(data.social)) {
      const mapped = Object.entries(data.social).map(([k, v]) => ({ label: k.charAt(0).toUpperCase() + k.slice(1), url: v }));
      data.social = mapped;
    }
    // Fill missing sections/fields with defaults so a partial or legacy saved blob can't crash the panel
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
    return data;
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

function status(msg) {
  const el = document.getElementById('status');
  if (el) el.textContent = msg || '';
}

function requireAuth() {
  try {
    if (sessionStorage.getItem('admin-authed') !== 'true') {
      window.location.href = 'login.html';
      return false;
    }
  } catch (e) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function logout() {
  try { sessionStorage.removeItem('admin-authed'); } catch (e) {}
  window.location.href = 'login.html';
}

const SECTIONS = [
  { key: 'hero', label: 'Hero' },
  { key: 'about', label: 'About' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'projects', label: 'Projects' },
  { key: 'community', label: 'Community' },
  { key: 'skills', label: 'Skills' },
  { key: 'social', label: 'Social' }
];

let currentData = loadData();

function setField(path, value) {
  const parts = path.split('.');
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
  const parts = path.split('.');
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

function buildArrayPanel(key, fields, container) {
  const data = currentData[key] || [];
  container.innerHTML = '';
  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn';
  addBtn.textContent = '+ Add ' + key;
  addBtn.style.marginBottom = '10px';
  container.appendChild(addBtn);

  function renderRows() {
    const existing = container.querySelectorAll('.card');
    existing.forEach((c) => c.remove());
    container.insertBefore(addBtn, container.firstChild);
    data.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'card';
      fields.forEach((f) => {
        const label = document.createElement('label');
        label.textContent = f.label;
        const input = document.createElement('input');
        input.className = f.class || '';
        if (f.tag === 'textarea') {
          const ta = document.createElement('textarea');
          ta.value = item[f.key] || '';
          ta.addEventListener('input', () => { item[f.key] = ta.value; });
          card.appendChild(label);
          card.appendChild(ta);
        } else {
          input.type = f.type || 'text';
          input.value = item[f.key] || '';
          input.addEventListener('input', () => { item[f.key] = input.value; });
          card.appendChild(label);
          card.appendChild(input);
        }
      });
      const rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'btn remove';
      rm.textContent = 'Remove';
      rm.addEventListener('click', () => { data.splice(i, 1); renderRows(); });
      card.appendChild(rm);
      container.insertBefore(card, addBtn.nextSibling);
    });
  }
  addBtn.addEventListener('click', () => {
    const blank = {};
    fields.forEach((f) => { blank[f.key] = ''; });
    data.push(blank);
    renderRows();
  });
  renderRows();
}

function buildHeroPanel(container) {
  const d = currentData.hero;
  container.innerHTML = `
    <label>Title</label><input type="text" data-path="hero.title" value="${esc(d.title)}" />
    <label>Lead</label><textarea data-path="hero.lead">${esc(d.lead)}</textarea>
    <label>Typing Words (comma separated)</label>
    <input type="text" data-path="hero.typingWords" value="${esc((d.typingWords || []).join(', '))}" />
    <div class="row">
      <div><label>Projects Count</label><input type="number" data-path="hero.counters.projects" value="${d.counters.projects}" /></div>
      <div><label>Skills Count</label><input type="number" data-path="hero.counters.skills" value="${d.counters.skills}" /></div>
      <div><label>Focus Count</label><input type="number" data-path="hero.counters.focus" value="${d.counters.focus}" /></div>
    </div>
  `;
  container.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('input', () => {
      const path = el.getAttribute('data-path');
      if (path === 'hero.typingWords') {
        setField(path, el.value.split(',').map((s) => s.trim()).filter(Boolean));
      } else if (/^hero\.counters\.(projects|skills|focus)$/.test(path)) {
        setField(path, parseInt(el.value || '0', 10) || 0);
      } else {
        setField(path, el.value);
      }
    });
  });
}

function buildAboutPanel(container) {
  const d = currentData.about;
  container.innerHTML = `
    <label>Bio</label><textarea data-path="about.bio">${esc(d.bio)}</textarea>
    <label>Tagline</label><textarea data-path="about.tagline">${esc(d.tagline)}</textarea>
  `;
  container.querySelectorAll('textarea').forEach((el) => {
    el.addEventListener('input', () => { setField(el.getAttribute('data-path'), el.value); });
  });
}

function buildCommunityPanel(container) {
  const arr = currentData.community;
  container.innerHTML = `
    <label>Community Items (one per line)</label>
    <textarea id="community-ta" rows="8">${arr.map(esc).join('\n')}</textarea>
  `;
  const ta = document.getElementById('community-ta');
  ta.addEventListener('input', () => {
    currentData.community = ta.value.split('\n').map((s) => s.trim()).filter(Boolean);
  });
}

function buildSkillsPanel(container) {
  const arr = currentData.skills;
  const ta = document.createElement('textarea');
  ta.id = 'skills-ta';
  ta.rows = 8;
  ta.value = arr.map(esc).join('\n');
  ta.addEventListener('input', () => {
    currentData.skills = ta.value.split('\n').map((s) => s.trim()).filter(Boolean);
  });
  container.innerHTML = '<label>Skills (one per line)</label>';
  container.appendChild(ta);
}

function buildSocialPanel(container) {
  buildArrayPanel('social', [
    { key: 'label', label: 'Label' },
    { key: 'url', label: 'URL', type: 'url' }
  ], container);
}

function buildProjectsPanel(container) {
  buildArrayPanel('projects', [
    { key: 'title', label: 'Title' },
    { key: 'desc', label: 'Description', tag: 'textarea' },
    { key: 'thumb', label: 'Thumbnail URL' },
    { key: 'linkLabel', label: 'Link Label' },
    { key: 'linkUrl', label: 'Link URL', type: 'url' }
  ], container);
}

function buildExperiencePanel(container) {
  buildArrayPanel('experience', [
    { key: 'role', label: 'Role' },
    { key: 'org', label: 'Organization' },
    { key: 'period', label: 'Period' },
    { key: 'desc', label: 'Description', tag: 'textarea' }
  ], container);
}

function buildEducationPanel(container) {
  buildArrayPanel('education', [
    { key: 'name', label: 'Name' },
    { key: 'period', label: 'Period' },
    { key: 'desc', label: 'Description' }
  ], container);
}

function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const BUILDERS = {
  hero: buildHeroPanel,
  about: buildAboutPanel,
  experience: buildExperiencePanel,
  education: buildEducationPanel,
  projects: buildProjectsPanel,
  community: buildCommunityPanel,
  skills: buildSkillsPanel,
  social: buildSocialPanel
};

function renderEditors() {
  const tabsEl = document.getElementById('tabs');
  const panelsEl = document.getElementById('panels');
  SECTIONS.forEach((sec, idx) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tab';
    tab.textContent = sec.label;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    tab.addEventListener('click', () => {
      tabsEl.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', 'false'));
      panelsEl.querySelectorAll('.panel').forEach((p) => p.classList.remove('open'));
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('panel-' + sec.key);
      if (panel) panel.classList.add('open');
    });
    tabsEl.appendChild(tab);

    const panel = document.createElement('div');
    panel.id = 'panel-' + sec.key;
    panel.className = 'panel' + (idx === 0 ? ' open' : '');
    panelsEl.appendChild(panel);
    if (BUILDERS[sec.key]) BUILDERS[sec.key](panel);
  });
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(currentData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'portfolio-data.json';
  a.click();
  URL.revokeObjectURL(url);
  status('Exported portfolio-data.json');
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderEditors();
  document.getElementById('saveBtn').addEventListener('click', () => {
    if (saveData(currentData)) {
      status('Saved ' + new Date().toLocaleTimeString());
    } else {
      status('Save failed');
    }
  });
  document.getElementById('previewBtn').addEventListener('click', () => {
    window.open('index.html', '_blank');
  });
  document.getElementById('exportBtn').addEventListener('click', exportJSON);
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
});
