# Portfolio Content Update Plan

## Scope
Replace placeholder content with Adam Haneef's real professional information across the portfolio site.

---

## Sensitive Information to EXCLUDE
The following personal data will NOT be published:
- Email: adhanef@live.com
- Phone: 7861051
- Date of Birth: 05-11-1986 / Age: 40
- Blood Type: O+
- Home addresses (Rankokaage/Linkia, Dh Kudahuvadhoo; Rankokage, Izzundheenu magu, 13080)
- ID: A147348
- Salary/Number: 7330
- Google Cloud photo URL (keep local IMG_215i5f.jpg)

---

## Implementation Tasks

### 1. Hero Section Updates
**File:** `index.html` (lines 52-59, 82-95)
- **Title** (line 52-54): "I build thoughtful products and clean code" → "I design, capture, and build ventures with purpose"
- **Subtitle/Lead** (lines 55-58): Keep current or shorten
- **Typing animation** (line 58): Change words to `["designs", "photos", "ventures", "art"]`
- **Counter stats** (lines 84, 88, 92): Update data-target values:
  - Projects: `3` → `4` (Saalhaga + Argo + Photography + Design)
  - Skills: `5` → keep or update to meaningful number
  - Focus: `100` → keep

### 2. About Section
**File:** `index.html` (lines 103-115)
- Replace generic text with shortened professional summary:
  > "Self-motivated entrepreneur, designer, artist, and photographer. Founder of Saalhaga and Manager at Argo (Bright Brothers Pvt Ltd). Dawah volunteer at United Islamic Society. I share projects and lessons learned so others can achieve their goals."
- Add personal tagline: "A little boy who grew up at the heart of Maldives with the love of his family, who tries to find ultimate happiness."

### 3. Experience Section
**File:** `index.html` (lines 144-180)
Replace 3 placeholder cards with 4 real roles:

| Role | Organization | Period | Description |
|------|-------------|--------|-------------|
| Manager | Argo, Bright Brothers Pvt Ltd | 2010 – Present | Leading operations and management |
| Security Guard | Dh Atoll Council | 2009 – 2010 | Public safety and facility security |
| Cashier | Avasthari | 2007 – 2009 | Customer service and financial transactions |
| Labour | Faisal Carpentry | 2003 – 2007 | Construction and carpentry support |

### 4. Education Section (NEW)
**File:** `index.html` (new section after Experience, before Projects)
Add new section:
```html
<section id="education" class="reveal">
  <div class="container">
    <div class="section-title">Education</div>
    <p class="section-sub">Academic background and training.</p>
    <div class="projects-grid section-grid">
      <article class="proj-card">
        <div class="proj-body">
          <div class="proj-title">Dh Atoll Education Center</div>
          <div class="proj-desc">1994 – 2003 · Secondary Education</div>
        </div>
      </article>
      <article class="proj-card">
        <div class="proj-body">
          <div class="proj-title">CITM</div>
          <div class="proj-desc">2011 – 2012 · Technical/Professional Training</div>
        </div>
      </article>
    </div>
  </div>
</section>
```

### 5. Projects Section
**File:** `index.html` (lines 193-256)
Replace 3 placeholder projects with skill-based ventures:

| Project | Description | Thumbnail |
|---------|-------------|-----------|
| **Design Portfolio** | Brand identity, graphic design, and visual communication projects | picsum.photos/seed/design |
| **Photography** | Portrait, landscape, and documentary photography from Maldives | picsum.photos/seed/photography |
| **Entrepreneurship Ventures** | Saalhaga founding, Argo management, business development | picsum.photos/seed/ventures |

### 6. Volunteer & Community Section (NEW)
**File:** `index.html` (new section after Projects, before Contact)
Add new section:
```html
<section id="community" class="reveal">
  <div class="container">
    <div class="section-title">Community & Volunteer</div>
    <p class="section-sub">Organizations and causes I support.</p>
    <div class="skills-grid section-grid">
      <span class="skill-pill">Dawah Volunteer — United Islamic Society</span>
      <span class="skill-pill">Dh Kudahuvadhoo Council</span>
      <span class="skill-pill">Maldives National University — Kudahuvadhoo Outreach</span>
      <span class="skill-pill">Mi College — Kudahuvadhoo Outreach</span>
    </div>
  </div>
</section>
```

### 7. Contact Section
**File:** `index.html` (lines 325-335)
- Remove direct email link (line 329): `<a href="mailto:adam@example.com">adam@example.com</a>`
- Keep contact form only
- Keep placeholder social links (GitHub, LinkedIn, Twitter) as-is

### 8. Skills Section
**File:** `index.html` (lines 125-132)
- Keep current technical skills (HTML, CSS, JavaScript, Git, Deployment, Problem Solving)
- No changes per user decision

### 9. Footer
**File:** `index.html` (line 344)
- Keep: `© <strong>Adam Haneef</strong> — Built with care • <span id="year"></span>`

---

## Validation Checklist
- [ ] No sensitive PII exposed (email, phone, DOB, addresses, ID, salary)
- [ ] Hero counters animate to 4 projects
- [ ] Typing animation cycles: designs → photos → ventures → art
- [ ] Experience shows 4 real roles with correct dates
- [ ] Education section appears with 2 entries
- [ ] Projects show 3 skill-based ventures
- [ ] Community section shows 4 organizations
- [ ] Contact form works (EmailJS placeholders remain)
- [ ] Profile photo loads from local IMG_215i5f.jpg
- [ ] Personal tagline appears in About section
- [ ] Responsive design intact
- [ ] No console errors

---

## Open Items (User to Provide Later)
- Real EmailJS credentials (`userId`, `serviceId`, `templateId`) for contact form
- Real social profile URLs (GitHub, LinkedIn, Twitter) to replace placeholders
- Actual project images for thumbnails (currently picsum.photos placeholders)

---

## File Changes Summary
- `index.html`: Major content updates across all sections
- `assets/js/main.js`: Typing animation word array update (line 39)
- No CSS changes needed (existing classes support new structure)