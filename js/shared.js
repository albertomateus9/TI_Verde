// Script compartilhado ultraleve (< 3 KB): acessibilidade (A-/A+/Alto contraste),
// menu móvel acessível e lightbox único sob demanda (0 KB de imagem ampliada no load).
(() => {
  'use strict';

  const readPref = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const savePref = (k, v) => { try { localStorage.setItem(k, v); } catch { /* segue sem salvar */ } };

  // 1. Acessibilidade persistida entre as 6 rotas (mesma origem GitHub Pages)
  const fontMinus = document.getElementById('fontMinus');
  const fontPlus = document.getElementById('fontPlus');
  const contrastBtn = document.getElementById('contrastBtn');

  let fontSize = Number(readPref('tiverde-font')) || 100;
  fontSize = Math.max(90, Math.min(150, fontSize));

  function applyFont() {
    document.documentElement.style.setProperty('--font-scale', String(fontSize / 100));
    document.body.classList.toggle('texto-grande', fontSize >= 135);
    if (fontMinus) fontMinus.disabled = fontSize <= 90;
    if (fontPlus) fontPlus.disabled = fontSize >= 150;
    savePref('tiverde-font', String(fontSize));
  }
  applyFont();

  fontMinus?.addEventListener('click', () => { fontSize = Math.max(90, fontSize - 10); applyFont(); });
  fontPlus?.addEventListener('click', () => { fontSize = Math.min(150, fontSize + 10); applyFont(); });

  function applyContrast(on) {
    document.body.classList.toggle('alto-contraste', on);
    contrastBtn?.setAttribute('aria-pressed', String(on));
    savePref('tiverde-contrast', String(on));
  }
  applyContrast(readPref('tiverde-contrast') === 'true');
  contrastBtn?.addEventListener('click', () => applyContrast(contrastBtn.getAttribute('aria-pressed') !== 'true'));

  // 2. Menu móvel (só ativa ocultamento após registrar o listener)
  const menuBtn = document.getElementById('menuButton');
  const navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    document.body.classList.add('nav-ready');
    const closeMenu = () => {
      navLinks.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    };
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuBtn.focus();
      }
    });
  }

  // 3. Lightbox único sob demanda (data-full / opcional data-full2)
  const dialog = document.getElementById('mediaLightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbTitle = document.getElementById('lightboxTitle');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbSwitch = document.getElementById('lightboxSwitch');
  const lbBtn1 = document.getElementById('lightboxPhoto1');
  const lbBtn2 = document.getElementById('lightboxPhoto2');
  const lbClose = document.getElementById('lightboxClose');

  if (dialog && lbImg) {
    let activePhotos = [];

    const showPhoto = (idx) => {
      const item = activePhotos[idx];
      if (!item) return;
      lbImg.src = item.src;
      lbImg.alt = item.alt;
      if (lbCaption) lbCaption.textContent = item.caption;
      if (lbBtn1) lbBtn1.setAttribute('aria-pressed', String(idx === 0));
      if (lbBtn2) lbBtn2.setAttribute('aria-pressed', String(idx === 1));
    };

    const closeLightbox = () => {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    };

    document.querySelectorAll('[data-full]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        activePhotos = [{
          src: trigger.dataset.full,
          alt: trigger.dataset.alt || '',
          caption: trigger.dataset.caption || ''
        }];
        if (trigger.dataset.full2) {
          activePhotos.push({
            src: trigger.dataset.full2,
            alt: trigger.dataset.alt2 || trigger.dataset.alt || '',
            caption: trigger.dataset.caption2 || trigger.dataset.caption || ''
          });
        }

        if (lbTitle) lbTitle.textContent = trigger.dataset.title || 'Imagem ampliada';
        if (lbSwitch) lbSwitch.hidden = activePhotos.length < 2;
        showPhoto(0);

        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
      });
    });

    lbBtn1?.addEventListener('click', () => showPhoto(0));
    lbBtn2?.addEventListener('click', () => showPhoto(1));
    lbClose?.addEventListener('click', closeLightbox);
    dialog.addEventListener('click', (e) => { if (e.target === dialog) closeLightbox(); });
  }
})();
