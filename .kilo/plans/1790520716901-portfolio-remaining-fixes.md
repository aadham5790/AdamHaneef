# Portfolio Remaining Fixes Plan

## Scope
Complete the remaining issues from the original portfolio fix plan that were not yet addressed.

---

## Task 1: JS — Counter Animation Robustness
**File:** `assets/js/main.js` (lines 81-111)

**Issues:**
- No interval ID stored per counter → concurrent intervals can run
- No guard against re-triggering → observer firing again restarts animation

**Fix:**
- Store interval ID on each `.num` element (e.g., `dataset.intervalId`)
- Clear existing interval before starting new one
- Use `WeakSet` or data attribute to mark completed counters and skip re-trigger

---

## Task 2: JS — Counter Observer Target
**File:** `assets/js/main.js` (line 109)

**Issue:**
- Observer watches `.card` (hero profile card) which is immediately visible on load
- Counters animate before user scrolls to them

**Fix:**
- Change observer target to `.stat-row` (the actual counter container)
- Or add a dedicated class like `.counter-trigger` to the stat row

---

## Task 3: Form — Configure EmailJS Credentials
**File:** `index.html` (lines 275-277)

**Issue:**
- Form uses placeholder EmailJS IDs:
  - `data-emailjs-user="YOUR_EMAILJS_USER_ID"`
  - `data-emailjs-service="YOUR_EMAILJS_SERVICE_ID"`
  - `data-emailjs-template="YOUR_EMAILJS_TEMPLATE_ID"`

**Decision needed:** User must provide real EmailJS credentials, or we switch to mailto-only fallback.

**Fix:** Replace placeholders with real values once provided.

---

## Task 4: HTML — Add Accessible Form Labels
**File:** `index.html` (lines 283-312)

**Issue:**
- Inputs only have `placeholder` attributes, no associated `<label>` elements
- Screen readers need explicit `<label for="id">` associations
- Honeypot field has `sr-only` label but could be improved

**Fix:**
- Add `<label for="name">Your name</label>` before name input
- Add `<label for="email">Your email</label>` before email input
- Add `<label for="subject">Subject (optional)</label>` before subject input
- Add `<label for="message">Your message</label>` before textarea
- Keep placeholders as supplemental hints

---

## Task 5: CSS/HTML — Move Remaining Inline Styles to Stylesheet
**Files:** `index.html` + `assets/css/styles.css`

**Inline styles to extract:**

| Location | Inline Style | Proposed CSS Class |
|----------|-------------|-------------------|
| `index.html:198-200` | Project 1 thumbnail `background-image` | `.proj-thumb[data-project="1"]` or keep as data-attr |
| `index.html:217-221` | Project 2 thumbnail `background-image` | `.proj-thumb[data-project="2"]` |
| `index.html:238-242` | Project 3 thumbnail `background-image` | `.proj-thumb[data-project="3"]` |
| `index.html:159-166` | `.hero-grid` inline `max-width`, `margin`, `padding` | Already covered by `.hero-grid` in CSS |
| `index.html:391-397` | `.contact-grid` inline styles | Already covered by `.contact-grid` in CSS |

**Note:** Project thumbnail backgrounds are dynamic content — acceptable to keep as inline `style` or move to `data-bg` attribute with CSS `background-image: attr(data-bg)`. Recommendation: keep inline for CMS-friendly dynamic images, or use `data-bg` + CSS.

---

## Validation Checklist
- [ ] Open `index.html` with JS disabled → all sections visible (already works)
- [ ] Scroll to hero → counters animate once, don't overshoot on re-scroll
- [ ] Tab through page → focus ring shows on Tab, hides on release (already works)
- [ ] Submit contact form → posts to EmailJS or falls back to mailto
- [ ] Form labels announced by screen reader (NVDA/VoiceOver test)
- [ ] No console errors

---

## Open Decisions Required

1. **EmailJS Credentials:** Provide real `userId`, `serviceId`, `templateId`? Or remove EmailJS and use mailto-only?
2. **Project Thumbnails:** Keep inline `style="background-image:..."` or migrate to `data-bg` + CSS?
3. **Counter Trigger:** Use existing `.stat-row` class or add new `.counter-trigger` class?

---

## Implementation Order
1. Task 1 & 2 (JS counters) — independent, quick wins
2. Task 4 (Form labels) — accessibility, no external deps
3. Task 5 (Inline styles) — cleanup
4. Task 3 (EmailJS) — requires user input