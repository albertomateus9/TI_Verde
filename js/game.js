// Motor de gamificação local: XP, níveis, conquistas, toasts, confete e som Web Audio.
// Todos os dados ficam apenas no localStorage do navegador do visitante.
window.GreenGame = (() => {
  'use strict';

  const STORAGE_KEY = 'tiverde-game-v1';
  const SOUND_KEY = 'tiverde-sound-v1';

  const ACHIEVEMENTS = [
    { id: 'start', icon: '▶', title: 'Jornada Verde', desc: 'Iniciou a exploração da TI Verde.', xp: 15 },
    { id: 'panorama', icon: '◎', title: 'Raio-X do E-Lixo', desc: 'Explorou todos os cenários do visualizador proporcional.', xp: 35 },
    { id: 'lab_eco', icon: '⚡', title: 'Laboratório Eficiente', desc: 'Cortou 50%+ do consumo e estendeu a vida útil das máquinas.', xp: 50 },
    { id: 'pue_master', icon: '≈', title: 'Métrica PUE', desc: 'Comparou cenários de eficiência em data centers.', xp: 30 },
    { id: 'pilares', icon: '◈', title: '4 Frentes Técnicas', desc: 'Abriu as 4 abas técnicas e testou a virtualização.', xp: 40 },
    { id: 'lei', icon: '§', title: 'Consciente da Lei', desc: 'Acertou a pergunta sobre PNRS e logística reversa.', xp: 25 },
    { id: 'triagem', icon: '♻', title: 'Mestre da Triagem', desc: 'Classificou corretamente os 6 itens eletrônicos.', xp: 50 },
    { id: 'explorer', icon: '★', title: 'Explorador Completo', desc: 'Passou por todos os capítulos da página.', xp: 40 },
    { id: 'quiz_done', icon: '⏱', title: 'Desafio Concluído', desc: 'Finalizou o Desafio Relâmpago.', xp: 30 },
    { id: 'quiz_perfect', icon: '🏆', title: 'Guardião da TI Verde', desc: 'Acertou todas as 8 perguntas do desafio.', xp: 65 }
  ];

  const LEVELS = [
    { min: 0, name: 'Curioso Digital' },
    { min: 100, name: 'Técnico Consciente' },
    { min: 220, name: 'Agente Sustentável' },
    { min: 340, name: 'Especialista em TI Verde' }
  ];

  const blank = () => ({ xp: 0, unlocked: {}, visited: [] });
  let state = blank();
  try {
    state = { ...blank(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    state = blank();
  }

  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* segue sem salvar */ }
  };

  let soundOn = false;
  try { soundOn = localStorage.getItem(SOUND_KEY) === 'true'; } catch { soundOn = false; }

  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const listeners = [];
  const $ = (id) => document.getElementById(id);

  function levelFor(xp) {
    let idx = 0;
    LEVELS.forEach((lvl, i) => { if (xp >= lvl.min) idx = i; });
    const next = LEVELS[idx + 1];
    const progress = next ? (xp - LEVELS[idx].min) / (next.min - LEVELS[idx].min) : 1;
    return { index: idx, name: LEVELS[idx].name, next, progress };
  }

  // ---------- Som sintético (Web Audio, sem arquivos externos) ----------
  let audioCtx = null;
  function tone(freqs, duration = 0.085, type = 'sine') {
    if (!soundOn) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      freqs.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const t = audioCtx.currentTime + i * duration;
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.1, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + duration + 0.02);
      });
    } catch { /* áudio indisponível */ }
  }

  const sfx = {
    good: () => tone([587, 880], 0.08),
    bad: () => tone([230, 175], 0.11, 'triangle'),
    badge: () => tone([523, 659, 784, 1047], 0.085),
    click: () => tone([510], 0.04)
  };

  // ---------- Confete em Canvas ----------
  const canvas = $('confetti');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  const palette = ['#1B5E3F', '#86E0B3', '#F2C96B', '#B45309', '#0F2E22'];
  let pieces = [];
  let animating = false;

  function confetti(amount = 75, origin) {
    if (!ctx || reduceMotion()) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ox = origin ? origin.x : window.innerWidth / 2;
    const oy = origin ? origin.y : window.innerHeight / 3;
    for (let i = 0; i < amount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3.5 + Math.random() * 6.5;
      pieces.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4.5,
        w: 6 + Math.random() * 5,
        h: 7 + Math.random() * 7,
        r: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.28,
        c: palette[i % palette.length],
        life: 85 + Math.random() * 45
      });
    }
    if (!animating) {
      animating = true;
      requestAnimationFrame(drawConfetti);
    }
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces = pieces.filter((p) => p.life > 0 && p.y < canvas.height + 40);
    pieces.forEach((p) => {
      p.vy += 0.21;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      p.life -= 1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.min(1, p.life / 28);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (pieces.length) requestAnimationFrame(drawConfetti);
    else {
      animating = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // ---------- Toasts e XP flutuante ----------
  function toast(title, detail, kind = 'badge') {
    const box = $('toasts');
    if (!box) return;
    const el = document.createElement('div');
    el.className = `toast toast--${kind}`;
    const strong = document.createElement('strong');
    strong.textContent = title;
    const span = document.createElement('span');
    span.textContent = detail;
    el.append(strong, span);
    box.append(el);
    setTimeout(() => el.classList.add('is-leaving'), 3500);
    setTimeout(() => el.remove(), 4000);
  }

  function floatXP(amount, anchor) {
    if (!anchor || reduceMotion()) return;
    const rect = anchor.getBoundingClientRect();
    const tag = document.createElement('span');
    tag.className = 'xp-float';
    tag.textContent = `+${amount} XP`;
    tag.style.left = `${rect.left + rect.width / 2}px`;
    tag.style.top = `${Math.max(60, rect.top)}px`;
    document.body.append(tag);
    setTimeout(() => tag.remove(), 1200);
  }

  // ---------- Renderização do HUD e do Dialog ----------
  function summary() {
    return {
      xp: state.xp,
      level: levelFor(state.xp),
      count: Object.keys(state.unlocked).length,
      total: ACHIEVEMENTS.length
    };
  }

  function render() {
    const hud = $('hud');
    if (!hud) return;
    hud.hidden = false;

    const info = summary();
    $('hudXp').textContent = String(info.xp);
    $('hudLevel').textContent = `Nível ${info.level.index + 1}`;
    $('hudMeter').style.width = `${Math.round(info.level.progress * 100)}%`;
    $('hudBadges').textContent = `${info.count}/${info.total}`;
    $('hudOpen').setAttribute(
      'aria-label',
      `${info.xp} XP, nível ${info.level.index + 1}: ${info.level.name}. ${info.count} de ${info.total} conquistas.`
    );

    const soundBtn = $('soundBtn');
    if (soundBtn) {
      soundBtn.setAttribute('aria-pressed', String(soundOn));
      soundBtn.title = soundOn ? 'Som ligado' : 'Som desligado';
    }

    const grid = $('conquistasGrid');
    if (grid) {
      grid.replaceChildren();
      ACHIEVEMENTS.forEach((a) => {
        const li = document.createElement('li');
        const got = Boolean(state.unlocked[a.id]);
        if (got) li.className = 'is-unlocked';

        const icon = document.createElement('span');
        icon.className = 'conq__icon';
        icon.textContent = got ? a.icon : '?';
        icon.setAttribute('aria-hidden', 'true');

        const body = document.createElement('div');
        const t = document.createElement('strong');
        t.textContent = a.title;
        const d = document.createElement('span');
        d.textContent = a.desc;
        const xp = document.createElement('em');
        xp.textContent = got ? `+${a.xp} XP · conquistada` : `${a.xp} XP · bloqueada`;
        body.append(t, d, xp);
        li.append(icon, body);
        grid.append(li);
      });
    }

    const dlgLevel = $('dlgLevel');
    if (dlgLevel) {
      dlgLevel.textContent = `${info.xp} XP · ${info.level.name}${
        info.level.next ? ` · faltam ${info.level.next.min - info.xp} XP para ${info.level.next.name}` : ' · nível máximo alcançado'
      }`;
    }

    listeners.forEach((fn) => fn(info));
  }

  function addXP(amount, anchor) {
    const prevIdx = levelFor(state.xp).index;
    state.xp += amount;
    save();
    floatXP(amount, anchor);
    const nextLvl = levelFor(state.xp);
    if (nextLvl.index > prevIdx) {
      setTimeout(() => {
        toast('Subiu de nível!', `Novo posto: ${nextLvl.name}`, 'level');
        sfx.badge();
        confetti(120);
      }, 450);
    }
    render();
  }

  function unlock(id, anchor) {
    const a = ACHIEVEMENTS.find((item) => item.id === id);
    if (!a || state.unlocked[id]) return false;
    state.unlocked[id] = Date.now();
    toast(`Conquista: ${a.title}`, `+${a.xp} XP · ${a.desc}`);
    sfx.badge();

    if (anchor) {
      const rect = anchor.getBoundingClientRect();
      confetti(55, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    } else {
      confetti(55);
    }

    const btn = $('hudOpen');
    if (btn) {
      btn.classList.remove('is-pulsing');
      void btn.offsetWidth;
      btn.classList.add('is-pulsing');
    }

    addXP(a.xp, anchor);

    if (Object.keys(state.unlocked).length === ACHIEVEMENTS.length) {
      setTimeout(() => {
        toast('Todas as conquistas!', 'Você concluiu toda a jornada de TI Verde.', 'level');
        confetti(200);
      }, 850);
    }
    return true;
  }

  function visit(id, totalSteps) {
    if (!state.visited.includes(id)) {
      state.visited.push(id);
      save();
    }
    if (state.visited.length >= totalSteps) unlock('explorer');
  }

  function reset() {
    state = blank();
    save();
    render();
    listeners.forEach((fn) => fn(summary(), 'reset'));
  }

  // Diálogo de conquistas
  const dialog = $('conquistas');
  function openDialog() {
    if (!dialog) return;
    render();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  function closeDialog() {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  $('hudOpen')?.addEventListener('click', openDialog);
  $('conquistasClose')?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', (e) => { if (e.target === dialog) closeDialog(); });
  $('dlgReset')?.addEventListener('click', () => {
    reset();
    closeDialog();
    window.location.hash = '#inicio';
  });

  $('soundBtn')?.addEventListener('click', () => {
    soundOn = !soundOn;
    try { localStorage.setItem(SOUND_KEY, String(soundOn)); } catch { /* segue */ }
    render();
    if (soundOn) sfx.click();
  });

  const api = {
    unlock,
    addXP,
    visit,
    reset,
    sfx,
    confetti,
    toast,
    openDialog,
    summary,
    has: (id) => Boolean(state.unlocked[id]),
    onChange: (fn) => { listeners.push(fn); fn(summary()); }
  };

  render();
  return api;
})();
