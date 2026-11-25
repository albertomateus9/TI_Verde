// Script exclusivo de TI_Verde (~2,6 KB não comprimido / ~1,1 KB gzip):
// 1) Triagem interativa por toque ancorada nas etiquetas reais da oficina
// 2) Sincronização leve dos 4 botões do trilho horizontal de etapas no mobile
(() => {
  'use strict';

  // 1. Triagem na bancada (só oculta feedback após inicializar listeners)
  const triageGrid = document.getElementById('triageGrid');
  const triageScore = document.getElementById('triageScore');
  if (triageGrid) {
    document.body.classList.add('triage-ready');
    const cards = [...triageGrid.querySelectorAll('.triage-card')];
    const solved = new Set();

    cards.forEach((card, idx) => {
      const answer = card.dataset.answer;
      const btns = [...card.querySelectorAll('.triage-opts button')];
      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const ok = btn.dataset.choice === answer;
          card.classList.add('is-answered');
          card.classList.toggle('is-right', ok);
          card.classList.toggle('is-wrong', !ok);
          btns.forEach((b) => b.classList.remove('is-selected-right', 'is-selected-wrong'));
          btn.classList.add(ok ? 'is-selected-right' : 'is-selected-wrong');
          if (ok) solved.add(idx);
          if (triageScore) {
            triageScore.textContent = `${solved.size} de ${cards.length} itens encaminhados corretamente${
              solved.size === cards.length ? ' — Triagem concluída!' : ''
            }`;
          }
        });
      });
    });
  }

  // 2. Botões do trilho horizontal das 4 etapas da oficina
  const track = document.getElementById('stageTrack');
  const tabWrap = document.getElementById('stageTabs');
  if (track && tabWrap) {
    const tabBtns = [...tabWrap.querySelectorAll('button[data-stage]')];
    const cards = [...track.querySelectorAll('.stage-card[data-stage]')];
    let suppressObserverUntil = 0;

    const setActive = (stage) => {
      tabBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.stage === stage)));
    };

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = cards.find((c) => c.dataset.stage === btn.dataset.stage);
        suppressObserverUntil = Date.now() + 600;
        setActive(btn.dataset.stage);
        if (target) target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
    });

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (Date.now() < suppressObserverUntil) return;
        // Só sincroniza automaticamente no modo trilho horizontal (mobile)
        if (track.scrollWidth <= track.clientWidth + 4) return;
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio >= 0.6)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActive(visible[0].target.dataset.stage);
        }
      }, { root: track, threshold: 0.6 });
      cards.forEach((c) => io.observe(c));
    }
  }
})();
