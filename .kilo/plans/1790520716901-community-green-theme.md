# Portfolio Color Update Plan: Green Theme for Community Section

## Scope
Update CSS to use green-related colors for the "Community & Volunteer" section elements.

---

## Current Colors (to be changed for Community section)
- `.section-title`: `--accent` = `#ff9800` (amber)
- `.skill-pill`: `--muted` = `#98a0b0` (gray-blue)
- `.skill-pill:hover`: `--accent-2` = `#00d8ff` (cyan)

---

## Proposed Green Palette Options

| Option | Section Title | Skill Pills (base) | Skill Pills (hover) | Description |
|--------|--------------|-------------------|---------------------|-------------|
| **A: Fresh Green** | `#22c55e` (green-500) | `#16a34a` (green-600) | `#15803d` (green-700) | Modern, vibrant |
| **B: Nature Green** | `#16a34a` (green-600) | `#22c55e` (green-500) | `#4ade80` (green-400) | Balanced, natural |
| **C: Deep Green** | `#15803d` (green-700) | `#166534` (green-800) | `#22c55e` (green-500) | Professional, grounded |
| **D: Teal-Green** | `#0d9488` (teal-600) | `#14b8a6` (teal-500) | `#2dd4bf` (teal-400) | Unique, calming |

---

## Implementation Approach
Add CSS custom properties for the community section, scoped to `#community`:

```css
#community {
  --community-accent: #22c55e;      /* section title */
  --community-pill: #16a34a;        /* pill base */
  --community-pill-hover: #15803d;  /* pill hover */
}

#community .section-title { color: var(--community-accent); }
#community .skill-pill { color: var(--community-pill); }
#community .skill-pill:hover { color: var(--community-pill-hover); }
```

---

---

## Button Gradient Update

**File:** `assets/css/styles.css`

Update all button gradients from amber to green:

| Selector | Current | Proposed Green Gradient |
|----------|---------|------------------------|
| `.cta` (line 118) | `linear-gradient(90deg, var(--accent), #ffb86b)` | `linear-gradient(90deg, #16a34a, #22c55e)` |
| `.btn-primary` (line 398) | `linear-gradient(90deg, var(--accent), #ffb86b)` | `linear-gradient(90deg, #16a34a, #22c55e)` |
| `.form-card button` (line 555) | `linear-gradient(90deg, var(--accent), #ffb86b)` | `linear-gradient(90deg, #16a34a, #22c55e)` |

Also update `.btn-primary` box-shadow from `rgba(255, 152, 0, 0.12)` to `rgba(34, 197, 94, 0.12)`.

---

## Section Title Color Update (Already Applied)

**File:** `assets/css/styles.css`

Changed `.section-title` color from `var(--accent)` (`#ff9800`) to `#16a34a` (green) site-wide.

---

## Decision Needed
Which green palette option (A, B, C, or D) should be used for community section pills? Or confirm the button gradient proposal above.