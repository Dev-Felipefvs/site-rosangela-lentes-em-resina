/* =========================================================
   Dra. Rosângela Santos — Lentes em Resina · interações
   ========================================================= */
(function () {
  'use strict';

  /* EDITAR: WhatsApp (somente dígitos, com DDI 55) */
  var WHATSAPP = '5582974002213';
  var WA_DEFAULT = 'Olá, Dra. Rosângela! Conheci seu trabalho pelo site e tenho interesse em transformar meu sorriso com lentes em resina. Gostaria de agendar uma avaliação.';

  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function waLink(t) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(t || WA_DEFAULT); }

  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = waLink(); a.target = '_blank'; a.rel = 'noopener';
  });

  /* ---------- Header ---------- */
  var header = document.getElementById('header');
  var wa = document.querySelector('.wa-float');
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    if (!body.classList.contains('menu-open')) {
      if (y > 500 && y > lastY + 4) header.classList.add('is-hidden');
      else if (y < lastY - 4) header.classList.remove('is-hidden');
    }
    wa.classList.toggle('is-visible', y > 420);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    body.classList.toggle('menu-open', open);
    body.classList.toggle('is-locked', open);
    if (open) header.classList.remove('is-hidden');
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1080 && menu.classList.contains('is-open')) setMenu(false); });

  /* ---------- Casos (antes e depois) ---------- */
  var CASES = [];
  for (var i = 1; i <= 9; i++) CASES.push({ src: 'assets/img/caso-' + i + '.jpg', sm: 'assets/img/caso-' + i + '-sm.jpg' });
  var grid = document.getElementById('cases');
  CASES.forEach(function (c, idx) {
    var b = document.createElement('button');
    b.className = 'case';
    b.setAttribute('aria-label', 'Ampliar caso ' + (idx + 1) + ': antes e depois');
    b.innerHTML = '<img src="' + c.sm + '" alt="Caso ' + (idx + 1) + ' de lentes em resina — antes à esquerda e depois à direita" loading="lazy">' +
      '<span class="ba ba--l">Antes</span><span class="ba ba--r">Depois</span><span class="case__zoom" aria-hidden="true">+</span>';
    b.addEventListener('click', function () { openLb(idx); });
    grid.appendChild(b);
  });
  document.querySelectorAll('[data-case]').forEach(function (b) {
    b.addEventListener('click', function () { openLb(Number(b.dataset.case)); });
  });

  /* ---------- Reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Link ativo ---------- */
  var links = document.querySelectorAll('.nav__link');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'lentes', 'resultados', 'sobre', 'duvidas', 'contato'].forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- FAQ ---------- */
  var faqList = document.getElementById('faq-list');
  var faqMore = document.getElementById('faq-more');
  faqMore.addEventListener('click', function () {
    var open = !faqList.classList.contains('is-expanded');
    faqList.classList.toggle('is-expanded', open);
    faqMore.setAttribute('aria-expanded', String(open));
    faqMore.innerHTML = open ? 'Ver menos dúvidas <span aria-hidden="true">−</span>' : 'Ver mais dúvidas <span aria-hidden="true">+</span>';
  });
  // abre uma pergunta por vez
  faqList.querySelectorAll('details').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqList.querySelectorAll('details[open]').forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbIdx = 0, lbReturn = null;
  function show() {
    lbImg.src = CASES[lbIdx].src;
    lbImg.alt = 'Caso ' + (lbIdx + 1) + ' de lentes em resina — antes e depois';
    lbCap.textContent = 'Caso real ' + (lbIdx + 1) + ' de ' + CASES.length + ' · Lentes em resina';
  }
  function openLb(i) {
    lbIdx = i; lbReturn = document.activeElement; show();
    lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); body.classList.add('is-locked');
    lb.querySelector('[data-lb-close]').focus();
  }
  function closeLb() {
    lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); body.classList.remove('is-locked');
    if (lbReturn) lbReturn.focus({ preventScroll: true });
  }
  function step(d) { lbIdx = (lbIdx + d + CASES.length) % CASES.length; show(); }
  lb.querySelector('[data-lb-close]').addEventListener('click', closeLb);
  lb.querySelector('[data-lb-prev]').addEventListener('click', function () { step(-1); });
  lb.querySelector('[data-lb-next]').addEventListener('click', function () { step(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lightbox__figure')) closeLb(); });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    tx = null;
  });
  document.addEventListener('keydown', function (e) {
    if (lb.classList.contains('is-open')) {
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'Tab') {
        var f = lb.querySelectorAll('button'), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    } else if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
  });

  /* ---------- Formulário → WhatsApp ---------- */
  var form = document.getElementById('contact-form');
  var status = form.querySelector('.form__status');
  var tel = form.querySelector('[name="telefone"]');
  tel.addEventListener('input', function () {
    var d = tel.value.replace(/\D/g, '').slice(0, 11), out = d;
    if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length > 7) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
    tel.value = out;
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = form.querySelector('[name="nome"]'), ok = true;
    [[nome, 2], [tel, 10]].forEach(function (p) {
      var valid = p[0].value.replace(/\s/g, '').length >= p[1];
      p[0].closest('.field').classList.toggle('is-invalid', !valid);
      if (!valid && ok) { p[0].focus(); ok = false; }
    });
    if (!ok) { status.textContent = 'Preencha seu nome e WhatsApp para continuar.'; return; }
    var mudar = Array.prototype.map.call(form.querySelectorAll('[name="mudar"]:checked'), function (c) { return c.value; });
    var msg = (form.querySelector('[name="mensagem"]').value || '').trim();
    var lines = ['Olá, Dra. Rosângela! Vim pelo site e gostaria de avaliar meu sorriso.', '', '*Nome:* ' + nome.value.trim(), '*WhatsApp:* ' + tel.value];
    if (mudar.length) lines.push('*Gostaria de mudar:* ' + mudar.join(', '));
    if (msg) lines.push('', '*Mensagem:* ' + msg);
    status.textContent = 'Abrindo o WhatsApp…';
    window.open(waLink(lines.join('\n')), '_blank', 'noopener');
  });
  form.querySelectorAll('input').forEach(function (el) {
    el.addEventListener('input', function () { var f = el.closest('.field'); if (f) f.classList.remove('is-invalid'); status.textContent = ''; });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
