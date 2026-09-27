# Portfolio Fix Plan

## Scope
Fix all issues from code review of the static portfolio at `index.html`, `assets/css/styles.css`, `assets/js/main.js`.

---

## Task 1: CSS — No-JS progressive enhancement for `.reveal`
**File:** `assets/css/styles.css`

- Add a `.no-js .reveal` rule that sets `opacity: 1; transform: none;`
- Add `<noscript><style>.no-js .reveal { opacity: 1; transform: none; }</style></noscript>` inside `<head>` in `index.html` so JS-disabled browsers see content.
- **Rationale:** currently all `.reveal` sections start invisible and never appear without JS.

---

## Task 2: JS — Counter animation robustness
**File:** `assets/js/main.js`

- Store the interval ID per counter and `clearInterval` before starting a new one, preventing concurrent intervals.
- Prevent re-triggering: once a counter completes, mark it done and skip if observer fires again.
- **Rationale:** currently `current` resets and two intervals can run simultaneously.

---

## Task 3: JS — Counter observer target
**File:** `assets/js/main.js`

- Change observer from `.card` to the profile card's stat row (`#hero .stat-row` or a new class like `.stat-row`) so counters only trigger when actually in/near viewport.
- **Rationale:** `.card` is immediately visible on load, so counters fire before user scrolls.

---

## Task 4: Form — Replace placeholder Formspree ID
**File:** `index.html`

- Replace `https://formspree.io/f/your-form-id` with the user's actual Formspree form ID.
- Remove `data-netlify="true"` and `netlify-honeypot="bot-field"` to avoid conflicting platform attributes.
- **Open decision:** user must supply the real Formspree ID (or choose another service).

---

## Task 5: HTML — Add labels to form inputs
**File:** `index.html`

- Add `<label>` elements associated with `for`/`id` for name, email, subject, message inputs.
- Move the honeypot label outside of `display: none` to a visually-hidden pattern, or remove if using Formspree only.
- **Rationale:** placeholders are not accessible labels; screen readers need `<label>`.

---

## Task 6: HTML — Fix hamburger accessibility
**File:** `index.html`

- Add `aria-label="Toggle navigation"` to the hamburger div.
- Remove `aria-hidden="true"`.
- **Rationale:** currently screen readers skip the button entirely.

---

## Task 7: CSS — Move inline styles to stylesheet
**File:** `assets/css/styles.css` + `index.html`

Extract all inline `style="..."` from `index.html` into CSS classes:
- Hero CTA row (margin-top, flex, gap, wrap)
- Hero "Contact" link (padding, border-radius, border, color)
- Project thumbnail backgrounds → move to CSS background-image or accept inline as data-attribute
- About card margin/padding
- Experience/projects grid margin-top
- Profile card inner styles (text-align, margin)
- Contact grid item styles
- Contact form row (flex, gap, align-items)
- Form message margin

**New classes to add:** `.hero-actions`, `.hero-link-secondary`, `.proj-thumb`, `.section-card`, `.profile-name`, `.profile-subtitle`, `.profile-stat-row`, `.contact-grid-item`, `.form-row`, `.form-msg`.

---

## Task 8: CSS — Clean up unused rules and add missing ones
**File:** `assets/css/styles.css`

- Add `.show-focus` rule (already toggled in JS but no CSS exists):
  ```css
  .show-focus :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  ```
- Remove or repurpose `.eyebrow` if not used (currently unused in HTML).
- Add `.btn-primary:hover` state.

---

## Task 9: JS — Fix focus ring cleanup
**File:** `assets/js/main.js`

- Add `keyup` listener to remove `show-focus` class when Tab is released:
  ```js
  window.addEventListener("keyup", (e) => {
    if (e.key === "Tab") document.documentElement.classList.remove("show-focus");
  });
  ```
- **Rationale:** currently class is added but never removed.

---

## Task 10: HTML — Fix project thumbnails and footer inconsistency
**File:** `index.html`

- Replace `via.placeholder.com` thumbnails with `picsum.photos` or local assets.
- Change footer `<strong>aadham</strong>` to `<strong>Adam Haneef</strong>` to match page title.

---

## Open Decision Required From User

**Contact form service ID:**
Which Formspree form ID should replace `your-form-id`? Or should I switch to a different service (e.g., Netlify Forms, EmailJS, or a mailto fallback)?

**Recommendation:** provide your Formspree ID so I can hardcode it; if you don't have one, I'll wire up EmailJS as the primary with mailto as fallback.

---

## Task 11: HTML/CSS — Use local profile photo

**Files:** `index.html`, new file under `assets/images/`

- Create `assets/images/` directory.
- Copy `IMG_215i5f.jpg` from repo root to `assets/images/profile.jpg` (or keep original name).
- Update `index.html:72` `<img src="...">` from the external Unsplash URL to `assets/images/profile.jpg`.
- **Rationale:** current Unsplash image is external and may break; local asset is more reliable and loads the user's actual photo.

---

## Validation
- Open `index.html` in a browser, disable JS → all sections visible.
- Scroll page → counters animate once, don't overshoot on re-scroll.
- Tab through page → focus ring shows on Tab, hides on release.
- Submit contact form → posts to correct Formspree endpoint.
- Run no lint tool available; validate by visual inspection and HTML semantics check.
- Verify profile photo loads from local path.
