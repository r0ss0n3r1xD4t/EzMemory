# Design: Navbar Deduplication via JS Injection

**Date:** 2026-06-17  
**Project:** EZ Memory (SSA101 – Nhóm 6, ĐH FPT)  
**Status:** Approved

---

## Problem

The navbar HTML (~15 lines) is copy-pasted identically across 3 pages:
- `index.html`
- `dang-ky.html`
- `khoa-hoc.html`

Any change to the navigation menu requires editing 3 files, increasing risk of inconsistency.

`cam-on.html` intentionally uses a different minimal header (`.ty-header`) with its own CSS — it is **out of scope** for this change.

---

## Chosen Approach: JS Template Injection

A new synchronous script `js/navbar.js` defines the navbar HTML and injects it into the page's `<header>` element immediately when the browser encounters the `<script>` tag — before the rest of the DOM is parsed.

### Why this approach

- **No build tooling required** — works on Netlify and `file://` protocol  
- **Single source of truth** — all pages share the same navbar definition  
- **No flash of missing navbar** — synchronous execution means the navbar is in the DOM before parsing continues  
- **Compatible with existing `initActiveNav()`** — the active-link highlighting in `main.js` already uses JS; this adds no new JS dependency  

---

## Architecture

```
js/
  navbar.js   ← NEW: defines and injects navbar HTML (synchronous, no defer)
  main.js     ← UNCHANGED

index.html    ← remove navbar HTML block, add <script src="js/navbar.js"> in <head>
dang-ky.html  ← same
khoa-hoc.html ← same
cam-on.html   ← NOT changed (uses minimal .ty-header by design)
```

---

## Component: `js/navbar.js`

An IIFE (Immediately Invoked Function Expression) that:

1. Defines the full navbar HTML as a template/string literal
2. Finds the first `<header>` element in the DOM
3. Sets `header.innerHTML = navbarHTML`
4. Exits silently if no `<header>` is found (edge-case guard)

**Script is loaded synchronous** (no `defer`, no `async`) so it runs immediately as the browser encounters the `<script>` tag during HTML parsing. This ensures the navbar is rendered with zero flash.

---

## Data Flow

```
Browser begins parsing HTML
  → reaches <script src="js/navbar.js"> in <head>  (synchronous)
    → navbar HTML injected into <header>             (no flash)
  → browser continues parsing rest of <body>
  → DOMContentLoaded fires
    → main.js (deferred) runs initActiveNav()        (marks active link)
```

---

## Changes Summary

| File | Change |
|------|--------|
| `js/navbar.js` | **Create** — IIFE with navbar HTML + injection |
| `index.html` | Remove navbar HTML from `<header>`, add `<script src="js/navbar.js">` to `<head>` |
| `dang-ky.html` | Same as above |
| `khoa-hoc.html` | Same as above |
| `cam-on.html` | **No change** — minimal header is intentional |

---

## Error Handling

- If `<header>` does not exist: script exits silently, no JS error thrown
- If JS is disabled: page shows empty `<header>` (acceptable for this academic project)

---

## Testing

After implementation, verify:
1. Navbar appears on `index.html`, `dang-ky.html`, `khoa-hoc.html`
2. Active link highlighting still works on each page
3. Mobile hamburger menu still opens/closes
4. `cam-on.html` still shows its own minimal header unchanged
5. No visual difference vs. before the change
