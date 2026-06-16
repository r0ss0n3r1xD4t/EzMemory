/* ============================================================
   EZ Memory – navbar.js
   Injects shared navbar HTML into <header> synchronously.
   Place <script src="js/navbar.js"> right after <header></header>
   in <body> so the element exists in DOM when this runs.
   ============================================================ */
(function () {
  var html =
    '<nav class="navbar" id="navbar" role="navigation" aria-label="Điều hướng chính">' +
    '<div class="container">' +
    '<div class="navbar__inner">' +
    '<a href="index.html" class="navbar__logo" aria-label="EZ Memory – Trang chủ">' +
    'EZ <span class="logo-accent">Memory</span>' +
    '</a>' +
    '<ul class="navbar__nav" id="navbar-nav" role="list">' +
    '<li role="listitem"><a href="index.html" class="navbar__link" aria-label="Trang chủ">Trang chủ</a></li>' +
    '<li role="listitem"><a href="courses.html" class="navbar__link" aria-label="Khóa học">Khóa học</a></li>' +
    '<li role="listitem"><a href="index.html#giang-vien" class="navbar__link" aria-label="Giảng viên">Giảng viên</a></li>' +
    '<li role="listitem"><a href="index.html#faq" class="navbar__link" aria-label="FAQ">FAQ</a></li>' +
    '<li role="listitem"><a href="register.html" class="navbar__link" aria-label="Đăng ký">Đăng ký</a></li>' +
    '</ul>' +
    '<a href="register.html" class="btn btn-primary navbar__cta" aria-label="Đăng ký miễn phí">Đăng ký miễn phí</a>' +
    '<button class="navbar__toggle" id="nav-toggle" aria-label="Mở menu" aria-expanded="false" aria-controls="navbar-nav">' +
    '<span></span><span></span><span></span>' +
    '</button>' +
    '</div>' +
    '</div>' +
    '</nav>';

  var header = document.querySelector('header');
  if (header) { header.innerHTML = html; }
}());
