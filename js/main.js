/* ============================================================
   EZ Memory – main.js
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     1. HEADER SCROLL CLASS
     ============================================================ */
  function initHeaderScroll() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;
    function onScroll() {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     2. MOBILE MENU
     ============================================================ */
  function initMobileMenu() {
    var toggle = document.querySelector('.navbar__toggle');
    var nav    = document.querySelector('.navbar__nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    nav.querySelectorAll('.navbar__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  /* ============================================================
     3. SMOOTH ANCHOR SCROLL
     ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href   = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var offset = 80;
          var top    = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ============================================================
     4. INTERSECTION FADE-IN
     ============================================================ */
  function initFadeIn() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     5. FAQ ACCORDION
     ============================================================ */
  function initFAQ() {
    document.querySelectorAll('.faq-item__question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item   = this.closest('.faq-item');
        var answer = item.querySelector('.faq-item__answer');
        var isOpen = this.getAttribute('aria-expanded') === 'true';

        // Close all
        document.querySelectorAll('.faq-item__question').forEach(function (q) {
          q.setAttribute('aria-expanded', 'false');
          var a = q.closest('.faq-item').querySelector('.faq-item__answer');
          if (a) a.classList.remove('open');
        });

        if (!isOpen) {
          this.setAttribute('aria-expanded', 'true');
          if (answer) answer.classList.add('open');
        }
      });
    });
  }

  /* ============================================================
     6. COURSE / SESSION ACCORDION
     ============================================================ */
  function initAccordion() {
    document.querySelectorAll('.accordion-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item    = this.closest('.accordion-item');
        var content = item.querySelector('.accordion-content');
        var isOpen  = this.getAttribute('aria-expanded') === 'true';

        // Close all
        document.querySelectorAll('.accordion-trigger').forEach(function (t) {
          t.setAttribute('aria-expanded', 'false');
          var c = t.closest('.accordion-item').querySelector('.accordion-content');
          if (c) c.classList.remove('open');
        });

        if (!isOpen) {
          this.setAttribute('aria-expanded', 'true');
          if (content) content.classList.add('open');
        }
      });
    });
  }

  /* ============================================================
     7. ACTIVE NAV HIGHLIGHTING
     ============================================================ */
  function initActiveNav() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === '') currentPage = 'index.html';

    document.querySelectorAll('.navbar__link[href]').forEach(function (link) {
      var href = link.getAttribute('href').split('/').pop().split('#')[0];
      if (!href) href = 'index.html';
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================================
     8. COUNTER ANIMATION
     ============================================================ */
  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el       = entry.target;
        var target   = parseFloat(el.dataset.counter);
        var suffix   = el.dataset.suffix  || '';
        var prefix   = el.dataset.prefix  || '';
        var duration = 2000;
        var start    = performance.now();
        var isFloat  = String(target).indexOf('.') !== -1;

        function update(now) {
          var progress = Math.min((now - start) / duration, 1);
          var ease     = 1 - Math.pow(1 - progress, 4);
          var current  = target * ease;
          el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    }, { threshold: 0.3 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ============================================================
     9. COOKIE BANNER
     ============================================================ */
  function initCookieBanner() {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    if (localStorage.getItem('ez-cookie')) return;

    setTimeout(function () { banner.classList.add('visible'); }, 1200);

    var accept  = banner.querySelector('[data-cookie-accept]');
    var decline = banner.querySelector('[data-cookie-decline]');

    if (accept) {
      accept.addEventListener('click', function () {
        localStorage.setItem('ez-cookie', '1');
        banner.classList.remove('visible');
      });
    }
    if (decline) {
      decline.addEventListener('click', function () {
        banner.classList.remove('visible');
      });
    }
  }

  /* ============================================================
     10. REGISTRATION FORM VALIDATION
     ============================================================ */
  function initRegistrationForm() {
    var form = document.getElementById('registration-form');
    if (!form) return;

    function getField(id) { return form.querySelector('#' + id); }
    function getError(id) { return form.querySelector('#' + id + '-error'); }

    function showError(id, msg) {
      var field = getField(id);
      var errEl = getError(id);
      if (field)  { field.classList.add('error');    field.classList.remove('valid'); }
      if (errEl)  { errEl.textContent = msg;         errEl.classList.add('visible'); }
    }

    function clearError(id) {
      var field = getField(id);
      var errEl = getError(id);
      if (field)  { field.classList.remove('error'); field.classList.add('valid'); }
      if (errEl)  { errEl.classList.remove('visible'); }
    }

    function clearAll() {
      form.querySelectorAll('.form-control').forEach(function (f) {
        f.classList.remove('error', 'valid');
      });
      form.querySelectorAll('.form-error').forEach(function (e) {
        e.classList.remove('visible');
      });
    }

    function validateField(id) {
      var field = getField(id);
      if (!field) return true;
      var val = field.value.trim();

      switch (id) {
        case 'fullname':
          if (!val || val.length < 2) {
            showError(id, 'Vui lòng nhập họ và tên đầy đủ (ít nhất 2 ký tự).');
            return false;
          }
          clearError(id); return true;

        case 'email':
          if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            showError(id, 'Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại.');
            return false;
          }
          clearError(id); return true;

        case 'phone':
          if (val && !/^(\+84|0)\d{9}$/.test(val)) {
            showError(id, 'Số điện thoại không hợp lệ. Vui lòng nhập 10 số (0xxxxxxxxx) hoặc dạng +84xxxxxxxxx.');
            return false;
          }
          clearError(id); return true;

        case 'education':
          if (!val) {
            showError(id, 'Vui lòng chọn trình độ học vấn của bạn.');
            return false;
          }
          clearError(id); return true;

        case 'study-style':
          if (!val) {
            showError(id, 'Vui lòng chọn cách học hiện tại của bạn.');
            return false;
          }
          clearError(id); return true;

        case 'reason':
          if (!val || val.length < 20) {
            showError(id, 'Vui lòng nhập lý do tham gia (ít nhất 20 ký tự).');
            return false;
          }
          clearError(id); return true;

        default: return true;
      }
    }

    // Live blur validation
    ['fullname', 'email', 'phone', 'education', 'study-style', 'reason'].forEach(function (id) {
      var field = getField(id);
      if (field) {
        field.addEventListener('blur', function () { validateField(id); });
        field.addEventListener('input', function () {
          if (this.classList.contains('error')) validateField(id);
        });
      }
    });

    // Form submit
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAll();

      var fields  = ['fullname', 'email', 'phone', 'education', 'study-style', 'reason'];
      var valid   = true;
      fields.forEach(function (id) { if (!validateField(id)) valid = false; });

      var terms   = form.querySelector('#terms');
      var termsErr = form.querySelector('#terms-error');
      if (!terms || !terms.checked) {
        if (termsErr) {
          termsErr.textContent = 'Bạn cần đồng ý với điều khoản để hoàn tất đăng ký.';
          termsErr.classList.add('visible');
        }
        valid = false;
      }

      if (!valid) {
        // Scroll to first error
        var firstErr = form.querySelector('.form-control.error');
        if (firstErr) firstErr.focus();
        return;
      }

      // ---- Thay URL bên dưới bằng Web App URL sau khi deploy Apps Script ----
      var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyChSxfp1n_J7aueX-4BBK2VDhr0J2FN5BUXu6FI5YXB0fltuDsv2StDu9EhxhFE3WvRg/exec';
      // -----------------------------------------------------------------------

      var data = {
        name:        getField('fullname').value.trim(),
        email:       getField('email').value.trim(),
        phone:       getField('phone').value.trim(),
        education:   getField('education').value,
        studyStyle:  getField('study-style').value,
        reason:      getField('reason').value.trim(),
        source:      getField('source') ? getField('source').value : '',
        newsletter:  !!(getField('newsletter') && getField('newsletter').checked),
        registeredAt: new Date().toISOString()
      };
      try { localStorage.setItem('ez-registrant', JSON.stringify(data)); } catch (err) {}

      var nameEncoded = encodeURIComponent(data.name);

      // Gửi dữ liệu lên Google Sheets nếu URL đã được cấu hình
      if (APPS_SCRIPT_URL && APPS_SCRIPT_URL !== 'PASTE_YOUR_WEB_APP_URL_HERE') {
        fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(data)
        })
        .catch(function () { /* lỗi mạng – vẫn chuyển trang bình thường */ })
        .finally(function () {
          window.location.href = 'cam-on.html?name=' + nameEncoded;
        });
      } else {
        // Redirect ngay nếu chưa cấu hình URL
        window.location.href = 'cam-on.html?name=' + nameEncoded;
      }
    });
  }

  /* ============================================================
     11. THANK-YOU PAGE – name insertion
     ============================================================ */
  function initThankYou() {
    var nameEl = document.getElementById('registrant-name');
    if (!nameEl) return;

    var name = '';
    // 1) Try query param
    try {
      var params = new URLSearchParams(window.location.search);
      name = params.get('name') || '';
    } catch (e) {}

    // 2) Fallback to localStorage
    if (!name) {
      try {
        var stored = JSON.parse(localStorage.getItem('ez-registrant') || '{}');
        name = stored.name || '';
      } catch (e) {}
    }

    if (name) {
      document.querySelectorAll('.registrant-name').forEach(function (el) {
        el.textContent = name;
      });
    }
  }

  /* ============================================================
     12. SHARE BUTTON
     ============================================================ */
  function initShareButton() {
    var shareBtn = document.querySelector('[data-share]');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', function () {
      var shareData = {
        title: 'EZ Memory – Học ít hơn, Nhớ lâu hơn, Hiệu quả hơn',
        text:  'Tôi vừa đăng ký khóa học EZ Memory miễn phí về kỹ năng học tập! Bạn cũng thử nhé 🎓',
        url:   'https://ezmemory.edu.vn'
      };

      if (navigator.share) {
        navigator.share(shareData).catch(function () {});
      } else {
        var text = shareData.text + ' ' + shareData.url;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            var orig = shareBtn.innerHTML;
            shareBtn.textContent = '✓ Đã sao chép liên kết!';
            setTimeout(function () { shareBtn.innerHTML = orig; }, 2500);
          }).catch(function () { alert('Link: https://ezmemory.edu.vn'); });
        } else {
          alert('Link: https://ezmemory.edu.vn');
        }
      }
    });
  }

  /* ============================================================
     INIT ALL
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initFadeIn();
    initFAQ();
    initAccordion();
    initActiveNav();
    initCounters();
    initCookieBanner();
    initRegistrationForm();
    initThankYou();
    initShareButton();
  });

}());
