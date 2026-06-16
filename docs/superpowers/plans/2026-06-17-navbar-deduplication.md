# Navbar Deduplication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract duplicated navbar HTML from `index.html`, `dang-ky.html`, and `khoa-hoc.html` into a single shared `js/navbar.js` that injects the navbar at runtime.

**Architecture:** A synchronous IIFE in `js/navbar.js` defines the navbar HTML as a string and injects it into the page's `<header>` element immediately when the browser encounters the script tag (before the rest of the page body is parsed). The `initActiveNav()` function in the existing `main.js` (already deferred) continues to handle active-link highlighting after DOMContentLoaded.

**Tech Stack:** Vanilla JavaScript (ES5 IIFE), static HTML, no build tools.

## Global Constraints

- No build tools, no npm, no bundler — plain `.js` and `.html` files only  
- JavaScript must be ES5 compatible (no `const`/`let`, no arrow functions, no template literals — use `var` and string concatenation)  
- `cam-on.html` is NOT touched — it uses a different intentional minimal header (`.ty-header`)  
- The shared navbar always uses `index.html#giang-vien` and `index.html#faq` for anchor links (works from all pages; browsers do not reload when the path is unchanged)  
- All `aria-label` attributes from `index.html`'s navbar are preserved in the shared version  
- `js/navbar.js` is loaded **without** `defer` or `async` so injection happens synchronously  

---

### Task 1: Create `js/navbar.js`

**Files:**
- Create: `js/navbar.js`

**Interfaces:**
- Consumes: The existing `<header>` element in each HTML page's `<body>`
- Produces: Navbar HTML injected into `<header>`; no exported functions (self-contained IIFE)

- [ ] **Step 1: Create `js/navbar.js` with the following content**

```js
/* ============================================================
   EZ Memory – navbar.js
   Injects shared navbar HTML into <header> synchronously.
   Load WITHOUT defer/async so the navbar renders immediately.
   ============================================================ */
(function () {
  var html =
    '<nav class="navbar" id="navbar" role="navigation" aria-label="Dieu huong chinh">' +
    '<div class="container">' +
    '<div class="navbar__inner">' +
    '<a href="index.html" class="navbar__logo" aria-label="EZ Memory \u2013 Trang ch\u1ee7">' +
    'EZ <span class="logo-accent">Memory</span>' +
    '</a>' +
    '<ul class="navbar__nav" id="navbar-nav" role="list">' +
    '<li role="listitem"><a href="index.html" class="navbar__link" aria-label="Trang ch\u1ee7">Trang ch\u1ee7</a></li>' +
    '<li role="listitem"><a href="khoa-hoc.html" class="navbar__link" aria-label="Kh\u00f3a h\u1ecdc">Kh\u00f3a h\u1ecdc</a></li>' +
    '<li role="listitem"><a href="index.html#giang-vien" class="navbar__link" aria-label="Gi\u1ea3ng vi\u00ean">Gi\u1ea3ng vi\u00ean</a></li>' +
    '<li role="listitem"><a href="index.html#faq" class="navbar__link" aria-label="FAQ">FAQ</a></li>' +
    '<li role="listitem"><a href="dang-ky.html" class="navbar__link" aria-label="\u0110\u0103ng k\u00fd">\u0110\u0103ng k\u00fd</a></li>' +
    '</ul>' +
    '<a href="dang-ky.html" class="btn btn-primary navbar__cta" aria-label="\u0110\u0103ng k\u00fd mi\u1ec5n ph\u00ed">\u0110\u0103ng k\u00fd mi\u1ec5n ph\u00ed</a>' +
    '<button class="navbar__toggle" id="nav-toggle" aria-label="M\u1edf menu" aria-expanded="false" aria-controls="navbar-nav">' +
    '<span></span><span></span><span></span>' +
    '</button>' +
    '</div>' +
    '</div>' +
    '</nav>';

  var header = document.querySelector('header');
  if (header) { header.innerHTML = html; }
}());
```

- [ ] **Step 2: Verify the file was created**

```powershell
Get-Content js\navbar.js | Select-Object -First 5
```
Expected: first line is `/* ====...` comment block.

---

### Task 2: Update `index.html`

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `js/navbar.js` (Task 1)
- Produces: `index.html` with empty `<header>` shell + script tag; no inline navbar HTML

- [ ] **Step 1: Add `<script src="js/navbar.js">` to the `<head>` of `index.html`**

In `index.html`, find:
```html
  <link rel="stylesheet" href="css/style.css">
</head>
```
Replace with:
```html
  <link rel="stylesheet" href="css/style.css">
  <script src="js/navbar.js"></script>
</head>
```

- [ ] **Step 2: Replace the navbar block in `<body>` with an empty `<header>` shell**

Find this entire block:
```html
<!-- ============================================================
     NAVBAR
     ============================================================ -->
<header>
  <nav class="navbar" id="navbar" role="navigation" aria-label="Điều hướng chính">
    <div class="container">
      <div class="navbar__inner">
        <a href="index.html" class="navbar__logo" aria-label="EZ Memory – Trang chủ">
          EZ <span class="logo-accent">Memory</span>
        </a>
        <ul class="navbar__nav" id="navbar-nav" role="list">
          <li role="listitem"><a href="index.html"    class="navbar__link" aria-label="Trang chủ">Trang chủ</a></li>
          <li role="listitem"><a href="khoa-hoc.html" class="navbar__link" aria-label="Khóa học">Khóa học</a></li>
          <li role="listitem"><a href="#giang-vien"   class="navbar__link" aria-label="Giảng viên">Giảng viên</a></li>
          <li role="listitem"><a href="#faq"          class="navbar__link" aria-label="FAQ">FAQ</a></li>
          <li role="listitem"><a href="dang-ky.html"  class="navbar__link" aria-label="Đăng ký">Đăng ký</a></li>
        </ul>
        <a href="dang-ky.html" class="btn btn-primary navbar__cta" aria-label="Đăng ký miễn phí">Đăng ký miễn phí</a>
        <button class="navbar__toggle" id="nav-toggle" aria-label="Mở menu" aria-expanded="false" aria-controls="navbar-nav">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
</header>
```

Replace with:
```html
<!-- Navbar injected by js/navbar.js -->
<header></header>
```

- [ ] **Step 3: Commit**

```bash
git add js/navbar.js index.html
git commit -m "feat: extract shared navbar into js/navbar.js, update index.html"
```

---

### Task 3: Update `dang-ky.html`

**Files:**
- Modify: `dang-ky.html`

**Interfaces:**
- Consumes: `js/navbar.js` (Task 1)
- Produces: `dang-ky.html` with empty `<header>` shell + script tag

- [ ] **Step 1: Add `<script src="js/navbar.js">` to the `<head>` of `dang-ky.html`**

Find:
```html
  <link rel="stylesheet" href="css/style.css">
</head>
```
Replace with:
```html
  <link rel="stylesheet" href="css/style.css">
  <script src="js/navbar.js"></script>
</head>
```

- [ ] **Step 2: Replace the navbar block in `<body>` with an empty `<header>` shell**

Find this entire block:
```html
<!-- NAVBAR -->
<header>
  <nav class="navbar" id="navbar" role="navigation" aria-label="Điều hướng chính">
    <div class="container">
      <div class="navbar__inner">
        <a href="index.html" class="navbar__logo" aria-label="EZ Memory – Trang chủ">
          EZ <span class="logo-accent">Memory</span>
        </a>
        <ul class="navbar__nav" id="navbar-nav" role="list">
          <li role="listitem"><a href="index.html"    class="navbar__link">Trang chủ</a></li>
          <li role="listitem"><a href="khoa-hoc.html" class="navbar__link">Khóa học</a></li>
          <li role="listitem"><a href="index.html#giang-vien" class="navbar__link">Giảng viên</a></li>
          <li role="listitem"><a href="index.html#faq"        class="navbar__link">FAQ</a></li>
          <li role="listitem"><a href="dang-ky.html"  class="navbar__link">Đăng ký</a></li>
        </ul>
        <a href="dang-ky.html" class="btn btn-primary navbar__cta">Đăng ký miễn phí</a>
        <button class="navbar__toggle" id="nav-toggle" aria-label="Mở menu" aria-expanded="false" aria-controls="navbar-nav">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
</header>
```

Replace with:
```html
<!-- Navbar injected by js/navbar.js -->
<header></header>
```

- [ ] **Step 3: Commit**

```bash
git add dang-ky.html
git commit -m "feat: update dang-ky.html to use shared navbar"
```

---

### Task 4: Update `khoa-hoc.html`

**Files:**
- Modify: `khoa-hoc.html`

**Interfaces:**
- Consumes: `js/navbar.js` (Task 1)
- Produces: `khoa-hoc.html` with empty `<header>` shell + script tag

- [ ] **Step 1: Add `<script src="js/navbar.js">` to the `<head>` of `khoa-hoc.html`**

Find:
```html
  <link rel="stylesheet" href="css/style.css">
</head>
```
Replace with:
```html
  <link rel="stylesheet" href="css/style.css">
  <script src="js/navbar.js"></script>
</head>
```

- [ ] **Step 2: Replace the navbar block in `<body>` with an empty `<header>` shell**

Find this entire block:
```html
<!-- NAVBAR -->
<header>
  <nav class="navbar" id="navbar" role="navigation" aria-label="Điều hướng chính">
    <div class="container">
      <div class="navbar__inner">
        <a href="index.html" class="navbar__logo" aria-label="EZ Memory – Trang chủ">
          EZ <span class="logo-accent">Memory</span>
        </a>
        <ul class="navbar__nav" id="navbar-nav" role="list">
          <li role="listitem"><a href="index.html"    class="navbar__link">Trang chủ</a></li>
          <li role="listitem"><a href="khoa-hoc.html" class="navbar__link">Khóa học</a></li>
          <li role="listitem"><a href="index.html#giang-vien" class="navbar__link">Giảng viên</a></li>
          <li role="listitem"><a href="index.html#faq"        class="navbar__link">FAQ</a></li>
          <li role="listitem"><a href="dang-ky.html"  class="navbar__link">Đăng ký</a></li>
        </ul>
        <a href="dang-ky.html" class="btn btn-primary navbar__cta">Đăng ký miễn phí</a>
        <button class="navbar__toggle" id="nav-toggle" aria-label="Mở menu" aria-expanded="false" aria-controls="navbar-nav">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
</header>
```

Replace with:
```html
<!-- Navbar injected by js/navbar.js -->
<header></header>
```

- [ ] **Step 3: Commit**

```bash
git add khoa-hoc.html
git commit -m "feat: update khoa-hoc.html to use shared navbar"
```

---

### Task 5: Verify everything works

**Files:**
- No changes

- [ ] **Step 1: Confirm `js/navbar.js` exists and all three HTML files load it**

```powershell
Get-Item "js\navbar.js"
Select-String -Path "*.html" -Pattern "navbar\.js"
```

Expected: `js\navbar.js` exists; matches found in `index.html`, `dang-ky.html`, `khoa-hoc.html` — and **not** in `cam-on.html`.

- [ ] **Step 2: Confirm no inline navbar HTML remains in the 3 pages**

```powershell
Select-String -Path "index.html","dang-ky.html","khoa-hoc.html" -Pattern 'class="navbar"'
```

Expected: **0 matches**.

- [ ] **Step 3: Confirm `cam-on.html` is unchanged**

```powershell
Select-String -Path "cam-on.html" -Pattern "ty-header"
```

Expected: match found (`.ty-header` still present).

- [ ] **Step 4: Visual check — open each page in browser**

Use `npx serve .` or VS Code Live Server. Verify on each of `index.html`, `dang-ky.html`, `khoa-hoc.html`:
- Navbar visible ✓
- Correct active link highlighted per page ✓
- Hamburger menu opens/closes on narrow viewport ✓
- "Giảng viên" and "FAQ" links navigate correctly ✓

On `cam-on.html`: minimal header only, no full navbar ✓

- [ ] **Step 5: Final commit**

```bash
git add docs/
git commit -m "feat: complete navbar deduplication - single source of truth in js/navbar.js"
```
