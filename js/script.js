(() => {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];
  const Game = window.GreenGame || {
    unlock() {}, addXP() {}, visit() {}, reset() {}, openDialog() {}, onChange() {},
    sfx: { good() {}, bad() {}, click() {}, badge() {} },
    summary: () => ({ xp: 0, level: { name: 'Curioso Digital' }, count: 0, total: 10 })
  };

  const readPref = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const savePref = (k, v) => { try { localStorage.setItem(k, v); } catch { /* segue sem salvar */ } };
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTyping = (el) => Boolean(el && el.closest && el.closest('input, select, textarea, [contenteditable="true"]'));

  function bump(el, text) {
    if (!el || el.textContent === text) return;
    el.textContent = text;
    if (reduceMotion()) return;
    el.classList.remove('is-bumped');
    void el.offsetWidth;
    el.classList.add('is-bumped');
  }

  // =========================================================
  // 1. ACESSIBILIDADE (A− / A+ / Alto Contraste) & MENU MÓVEL
  // =========================================================
  let fontSize = Number(readPref('tiverde-font')) || 100;
  fontSize = Math.max(90, Math.min(150, fontSize));
  function applyFont() {
    document.documentElement.style.setProperty('--font-scale', String(fontSize / 100));
    document.body.classList.toggle('texto-grande', fontSize >= 135);
    savePref('tiverde-font', String(fontSize));
  }
  applyFont();

  $('#fontMinus')?.addEventListener('click', () => { fontSize = Math.max(90, fontSize - 10); applyFont(); });
  $('#fontPlus')?.addEventListener('click', () => { fontSize = Math.min(150, fontSize + 10); applyFont(); });

  const contrastBtn = $('#contrastBtn');
  function applyContrast(on) {
    document.body.classList.toggle('alto-contraste', on);
    contrastBtn?.setAttribute('aria-pressed', String(on));
    savePref('tiverde-contrast', String(on));
  }
  applyContrast(readPref('tiverde-contrast') === 'true');
  contrastBtn?.addEventListener('click', () => applyContrast(contrastBtn.getAttribute('aria-pressed') !== 'true'));

  const menuBtn = $('#menuButton');
  const navLinks = $('#navLinks');
  function closeMenu() {
    navLinks?.classList.remove('is-open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  }
  menuBtn?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  navLinks?.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });

  // =========================================================
  // 2. HERO INTERATIVO (22,3% vs Meta Circular)
  // =========================================================
  $('#startMission')?.addEventListener('click', () => Game.unlock('start', $('#startMission')));

  const heroToggle = $('#heroToggle');
  const heroCard = $('#heroCard');
  const heroDevices = $$('#heroDevices .device-dot');
  if (heroToggle && heroCard && heroDevices.length === 10) {
    heroToggle.hidden = false;
    let ecoMode = false;
    heroToggle.addEventListener('click', () => {
      ecoMode = !ecoMode;
      heroCard.classList.toggle('is-green', ecoMode);
      heroToggle.textContent = ecoMode ? 'Voltar ao cenário atual' : 'Simular meta circular';
      $('#heroStatValue').innerHTML = ecoMode ? '80<small>%</small>' : '22,3<small>%</small>';
      $('#heroStatTag').textContent = ecoMode ? 'Com TI Verde' : 'Cenário atual';
      $('#heroCardCaption').innerHTML = ecoMode
        ? 'Com <strong>manutenção, doação e logística reversa</strong>, até 8 em cada 10 dispositivos evitam o descarte irregular.'
        : 'Apenas <strong>2 em cada 10</strong> toneladas de lixo eletrônico no mundo têm reciclagem formal documentada.';
      heroDevices.forEach((dot, idx) => {
        const good = ecoMode ? idx < 8 : idx < 2;
        dot.classList.toggle('is-recycled', good);
        dot.classList.toggle('is-wasted', !good);
      });
      Game.sfx.click();
      Game.unlock('start', heroToggle);
    });
  }

  // =========================================================
  // 3. PANORAMA: WAFFLE 100 PONTOS, ANIMAÇÕES DE REVEAL E CANVAS
  // =========================================================
  const waffle = $('#waffleBrazil');
  if (waffle) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 100; i += 1) {
      const s = document.createElement('span');
      if (i < 3) s.className = 'is-on';
      frag.append(s);
    }
    waffle.append(frag);
  }

  function animateCount(el) {
    const target = Number(el.dataset.countTo);
    if (!Number.isFinite(target)) return;
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    const format = (v) => v.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

    if (reduceMotion()) {
      el.textContent = format(target);
      return;
    }
    const start = performance.now();
    const duration = 900;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = format(target);
    }
    requestAnimationFrame(tick);
  }

  function animateStatBlock(root) {
    root.querySelectorAll('.count-up').forEach((el) => {
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      animateCount(el);
    });
    if (!reduceMotion()) {
      root.querySelectorAll('[data-target-width]').forEach((bar) => {
        bar.style.width = '0%';
        requestAnimationFrame(() => { bar.style.width = `${bar.dataset.targetWidth}%`; });
      });
      root.querySelectorAll('[data-target-height]').forEach((bar) => {
        bar.style.height = '0%';
        requestAnimationFrame(() => { bar.style.height = `${bar.dataset.targetHeight}%`; });
      });
    }
  }

  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion()) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        animateStatBlock(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.16 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  if (window.GreenViz) window.GreenViz.init();

  // =========================================================
  // 4. SIMULADOR DO LABORATÓRIO DE INFORMÁTICA
  // =========================================================
  const pcCountEl = $('#pcCount');
  const idleHoursEl = $('#idleHours');
  const optSleep = $('#optSleep');
  const optStrip = $('#optStrip');
  const optUpgrade = $('#optUpgrade');
  const optThin = $('#optThin');
  const optPaperless = $('#optPaperless');
  const labRoom = $('#labRoom');

  function updateSimulator(triggerAnchor) {
    if (!pcCountEl || !idleHoursEl) return;
    const n = Number(pcCountEl.value);
    const idleH = Number(idleHoursEl.value);
    const days = 200;
    const activeH = 4;
    const offH = 16;
    const tariff = 0.85; // R$/kWh referência PA
    const gridCo2 = 0.085; // kg CO2/kWh referência SIN/MCTI

    $('#pcCountOut').textContent = `${n} PCs`;
    $('#idleHoursOut').textContent = `${idleH} h/dia`;

    const baseWhDay = 115 * activeH + 65 * idleH + 5 * offH;
    const baseKwh = (n * days * baseWhDay) / 1000;

    let activeW = optThin.checked ? 38 : (optUpgrade.checked ? 110 : 115);
    let idleW = optSleep.checked ? 3 : (optThin.checked ? 22 : 65);
    let standbyW = optStrip.checked ? 0 : 5;

    const curWhDay = activeW * activeH + idleW * idleH + standbyW * offH;
    const curKwh = (n * days * curWhDay) / 1000;

    const savedKwh = Math.max(0, Math.round(baseKwh - curKwh));
    const reductionPct = baseKwh > 0 ? Math.round(((baseKwh - curKwh) / baseKwh) * 100) : 0;

    const paperMoney = optPaperless.checked ? Math.round(n * 9) : 0;
    const savedMoney = Math.round(savedKwh * tariff + paperMoney);

    const embodiedCo2 = optUpgrade.checked ? n * 32 : 0;
    const paperCo2 = optPaperless.checked ? Math.round(n * 1.4) : 0;
    const savedCo2 = Math.round(savedKwh * gridCo2 + embodiedCo2 + paperCo2);
    const savedPcs = optUpgrade.checked ? n : 0;

    // Renderizar bancada visual do laboratório
    if (labRoom) {
      const activeCount = [optSleep.checked, optStrip.checked, optUpgrade.checked, optThin.checked, optPaperless.checked].filter(Boolean).length;
      const ecoPcs = Math.round((activeCount / 5) * n);
      labRoom.replaceChildren();
      const frag = document.createDocumentFragment();
      for (let i = 0; i < n; i += 1) {
        const unit = document.createElement('span');
        unit.className = i < ecoPcs ? 'pc-unit is-eco' : 'pc-unit';
        unit.textContent = `P${String(i + 1).padStart(2, '0')}`;
        frag.append(unit);
      }
      labRoom.append(frag);
    }

    bump($('#kpiKwh'), `${savedKwh.toLocaleString('pt-BR')} kWh`);
    bump($('#kpiMoney'), `R$ ${savedMoney.toLocaleString('pt-BR')}`);
    bump($('#kpiCo2'), `${savedCo2.toLocaleString('pt-BR')} kg`);
    bump($('#kpiSavedPcs'), `${savedPcs} PCs`);

    $('#simReductionPct').textContent = `${reductionPct}%`;
    $('#simReductionFill').style.width = `${Math.min(100, reductionPct)}%`;

    const sentence = $('#simSentence');
    if (savedKwh === 0 && !optUpgrade.checked && !optPaperless.checked) {
      sentence.innerHTML = `Sem ações de TI Verde, um laboratório de <strong>${n} computadores</strong> consome cerca de <strong>${Math.round(baseKwh).toLocaleString('pt-BR')} kWh/ano</strong> em 200 dias letivos. Ative as práticas ao lado para simular o ganho.`;
    } else {
      sentence.innerHTML = `Com as práticas escolhidas, o consumo anual cai de <strong>${Math.round(baseKwh).toLocaleString('pt-BR')} kWh</strong> para <strong>${Math.round(curKwh).toLocaleString('pt-BR')} kWh</strong> (−${reductionPct}%), economizando cerca de <strong>R$&nbsp;${savedMoney.toLocaleString('pt-BR')}/ano</strong> e evitando <strong>${savedCo2.toLocaleString('pt-BR')} kg de CO₂e</strong>.`;
    }

    const mission = $('#simMission');
    const missionStatus = $('#simMissionStatus');
    const goalHit = reductionPct >= 50 && optUpgrade.checked;
    mission?.classList.toggle('is-done', goalHit);
    if (missionStatus) {
      if (goalHit) {
        missionStatus.textContent = 'Missão concluída! Consumo elétrico reduzido em 50%+ e vida útil das máquinas estendida.';
        Game.unlock('lab_eco', triggerAnchor || mission);
      } else if (reductionPct >= 50) {
        missionStatus.textContent = `Consumo reduzido em ${reductionPct}%! Falta ativar o upgrade de SSD + RAM para estender a vida útil.`;
      } else if (optUpgrade.checked) {
        missionStatus.textContent = `Vida útil estendida! Redução elétrica atual: ${reductionPct}% (meta: 50% ou mais).`;
      } else {
        missionStatus.textContent = `Redução elétrica atual: ${reductionPct}%. Combine gestão de energia e upgrade de hardware.`;
      }
    }
  }

  [pcCountEl, idleHoursEl, optSleep, optStrip, optUpgrade, optThin, optPaperless].forEach((input) => {
    input?.addEventListener('input', () => updateSimulator(input));
    input?.addEventListener('change', () => { Game.sfx.click(); updateSimulator(input); });
  });
  updateSimulator();

  // =========================================================
  // 5. RAIO-X PUE, ABAS TÉCNICAS & DEMO DE VIRTUALIZAÇÃO
  // =========================================================
  const PUE_DATA = {
    '2.10': {
      label: 'Sala legada sem controle de fluxo de ar',
      explain: 'Mais da metade da eletricidade (52%) vai para refrigeração e perdas elétricas — cada 1,00 kWh nos servidores custa 1,10 kWh extras.'
    },
    '1.56': {
      label: 'Média global · Uptime Institute 2024',
      explain: 'Para cada 1,00 kWh usado pelos servidores, outros 0,56 kWh são gastos em ar-condicionado e perdas elétricas.'
    },
    '1.25': {
      label: 'Data center com corredor quente/frio',
      explain: 'Apenas 20% de sobrecarga de infraestrutura: separação térmica e fontes eficientes reduzem drasticamente a conta elétrica.'
    },
    '1.10': {
      label: 'Instalação hyperscale moderna',
      explain: '91% da eletricidade vira processamento útil de TI. Apenas 0,10 kWh extras por kWh de TI vão para apoio e refrigeração.'
    }
  };

  const pueButtons = $$('#puePresets button');
  const seenPue = new Set(['1.56']);
  pueButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.pue;
      const num = Number(val);
      const info = PUE_DATA[val];
      if (!info) return;
      pueButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const itPct = Math.round((1 / num) * 100);
      const overPct = 100 - itPct;
      bump($('#pueValue'), `PUE ${val.replace('.', ',')}`);
      $('#pueLabel').textContent = info.label;
      $('#pueItBar').style.width = `${itPct}%`;
      $('#pueItBar').textContent = `TI: ${itPct}%`;
      $('#pueOverBar').style.width = `${overPct}%`;
      $('#pueOverBar').textContent = `Apoio: ${overPct}%`;
      $('#pueExplain').textContent = info.explain;
      seenPue.add(val);
      Game.sfx.click();
      if (seenPue.size >= 3) Game.unlock('pue_master', btn);
    });
  });

  // Abas reutilizáveis (acessíveis via setas ← → Home End)
  function initTablist(containerId, onSwitch) {
    const list = document.getElementById(containerId);
    if (!list) return;
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    if (!tabs.length || panels.some((p) => !p)) return;

    function activate(idx, focus = false) {
      tabs.forEach((t, i) => {
        const active = i === idx;
        t.setAttribute('aria-selected', String(active));
        t.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
      });
      if (focus) tabs[idx].focus();
      if (onSwitch) onSwitch(idx, tabs[idx]);
    }

    activate(0);
    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => { Game.sfx.click(); activate(idx); });
      tab.addEventListener('keydown', (e) => {
        let next = null;
        if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        if (next === null) return;
        e.preventDefault();
        e.stopPropagation();
        activate(next, true);
      });
    });
  }

  const seenTechTabs = new Set([0]);
  let virtTested = false;
  const techProgress = $('#techTabProgress');
  function checkTechAchievement(anchor) {
    if (techProgress) {
      techProgress.hidden = false;
      techProgress.textContent = seenTechTabs.size === 4
        ? (virtTested ? '4 de 4 frentes concluídas ✓' : '4 de 4 frentes · teste a virtualização')
        : `Frentes exploradas: ${seenTechTabs.size} de 4`;
    }
    if (seenTechTabs.size === 4 && virtTested) Game.unlock('pilares', anchor);
  }
  initTablist('techTabs', (idx, tab) => {
    seenTechTabs.add(idx);
    checkTechAchievement(tab);
  });
  initTablist('actTabs');

  // Demo de virtualização dentro da aba 2
  const virtToggle = $('#virtToggle');
  const virtServers = $$('#virtRacks .virt-server');
  const virtSummary = $('#virtSummary');
  if (virtToggle && virtServers.length === 6) {
    let consolidated = false;
    const originals = virtServers.map((s) => s.innerHTML);
    virtToggle.addEventListener('click', () => {
      consolidated = !consolidated;
      virtTested = true;
      virtToggle.textContent = consolidated ? 'Voltar para 6 servidores físicos' : 'Simular consolidação em 1 host';
      virtServers.forEach((srv, idx) => {
        if (!consolidated) {
          srv.className = 'virt-server';
          srv.innerHTML = originals[idx];
        } else if (idx === 0) {
          srv.className = 'virt-server is-consolidated';
          srv.innerHTML = '<strong>HOST-01</strong><br>6 VMs · 70% CPU';
        } else {
          srv.className = 'virt-server is-off';
          srv.innerHTML = `<strong>SRV-0${idx + 1}</strong><br>Desligado`;
        }
      });
      virtSummary.innerHTML = consolidated
        ? '<strong>Depois:</strong> 1 servidor físico virtualizado (~300 W) executa os 6 serviços com folga — queda estimada de até <strong>75% no consumo elétrico</strong> e muito menos calor.'
        : '<strong>Antes:</strong> 6 servidores físicos ligados 24h (~1.200 W totais) com uso médio de apenas 12% por máquina.';
      Game.sfx.click();
      checkTechAchievement(virtToggle);
    });
  }

  // =========================================================
  // 6. PERGUNTA RÁPIDA DE LEGISLAÇÃO
  // =========================================================
  const lawBtns = $$('#lawQuick button');
  const lawFb = $('#lawQuickFb');
  lawBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const ok = btn.dataset.correct === '1';
      lawBtns.forEach((b) => b.classList.remove('is-right', 'is-wrong'));
      btn.classList.add(ok ? 'is-right' : 'is-wrong');
      if (ok) {
        lawFb.textContent = 'Correto! A PNRS (Lei 12.305/2010) estabelece a responsabilidade compartilhada pelo ciclo de vida dos produtos.';
        Game.sfx.good();
        Game.unlock('lei', btn);
      } else {
        lawFb.textContent = 'Quase lá! Pela PNRS, a responsabilidade não cai sobre um único ator — ela é compartilhada entre toda a cadeia e os consumidores.';
        Game.sfx.bad();
      }
    });
  });

  // =========================================================
  // 7. TRIAGEM INTERATIVA DO E-LIXO
  // =========================================================
  const triageCards = $$('#triageGrid .triage-card');
  const triageScore = $('#triageScore');
  const solvedTriage = new Set();

  triageCards.forEach((card, idx) => {
    const answer = card.dataset.answer;
    const btns = [...card.querySelectorAll('.triage-opts button')];
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const right = btn.dataset.choice === answer;
        card.classList.add('is-answered');
        card.classList.toggle('is-right', right);
        card.classList.toggle('is-wrong', !right);
        btns.forEach((b) => b.classList.remove('is-selected-right', 'is-selected-wrong'));
        btn.classList.add(right ? 'is-selected-right' : 'is-selected-wrong');

        if (right) {
          solvedTriage.add(idx);
          Game.sfx.good();
        } else {
          Game.sfx.bad();
        }

        if (triageScore) {
          triageScore.textContent = `${solvedTriage.size} de ${triageCards.length} itens classificados corretamente${
            solvedTriage.size === triageCards.length ? ' ✓' : ''
          }`;
        }
        if (solvedTriage.size === triageCards.length) {
          Game.unlock('triagem', btn);
        }
      });
    });
  });

  // =========================================================
  // 8. DESAFIO RELÂMPAGO (8 PERGUNTAS + PLACAR LOCAL)
  // =========================================================
  const QUESTIONS = [
    {
      q: 'Qual percentual aproximado do lixo eletrônico mundial teve reciclagem formal documentada segundo o Global E-waste Monitor 2024?',
      opts: ['22,3%', '68,5%', '89,0%'],
      ans: 0,
      fb: 'Apenas 22,3% das 62 milhões de toneladas geradas em 2022 tiveram coleta e reciclagem formal documentadas.'
    },
    {
      q: 'Em qual fase ocorre a maior parte da pegada de carbono de um notebook (cerca de 70% a 80%)?',
      opts: ['No uso diário na tomada', 'Na extração mineral e fabricação', 'No envio de e-mails'],
      ans: 1,
      fb: 'A fabricação concentra a maior fatia das emissões. Por isso, estender a vida útil do hardware é uma das medidas mais fortes da TI Verde.'
    },
    {
      q: 'O que indica um PUE igual a 1,10 em um data center?',
      opts: ['Alta eficiência: quase toda energia vai para os servidores', 'Desperdício extremo de energia', 'Que o data center está desligado'],
      ans: 0,
      fb: 'Quanto mais próximo de 1,00 está o PUE (Energia Total ÷ Energia de TI), menos eletricidade é perdida em refrigeração e infraestrutura.'
    },
    {
      q: 'Qual medida recupera um computador escolar lento com menor impacto ambiental?',
      opts: ['Descartar tudo e comprar máquina nova', 'Trocar HD por SSD e ampliar a memória RAM', 'Deixar ligado 24h para evitar reinicialização'],
      ans: 1,
      fb: 'Upgrade de SSD + RAM evita descarte prematuro e poupa o carbono incorporado de fabricar um equipamento novo.'
    },
    {
      q: 'O que a virtualização faz para tornar um parque de servidores mais sustentável?',
      opts: ['Consolida vários serviços em menos máquinas físicas', 'Aumenta o número de placas de vídeo ligadas', 'Dispensa qualquer refrigeração'],
      ans: 0,
      fb: 'Consolidar servidores subutilizados em um host virtualizado reduz drasticamente consumo elétrico, espaço e geração de calor.'
    },
    {
      q: 'Qual lei brasileira instituiu a Política Nacional de Resíduos Sólidos e a logística reversa de eletrônicos?',
      opts: ['Lei nº 12.305/2010 (PNRS)', 'Lei nº 13.709/2018 (LGPD)', 'Código de Trânsito Brasileiro'],
      ans: 0,
      fb: 'A PNRS (Lei 12.305/2010), regulamentada pelo Decreto 10.240/2020, obriga a logística reversa de eletroeletrônicos.'
    },
    {
      q: 'Para onde deve ir uma bateria inchada de celular ou nobreak?',
      opts: ['Lixo reciclável seco comum', 'Ponto de Entrega Voluntária (PEV) de logística reversa', 'Enterrada em quintal'],
      ans: 1,
      fb: 'Baterias contêm substâncias tóxicas e inflamáveis e devem ir sempre para pontos de logística reversa especializados.'
    },
    {
      q: 'Qual prática representa Green Coding no desenvolvimento web?',
      opts: ['Carregar vídeos automáticos pesados em segundo plano', 'Criar páginas leves, otimizar imagens e evitar código inútil', 'Executar consultas repetidas a cada milissegundo'],
      ans: 1,
      fb: 'Software enxuto transfere menos bytes pela rede, exige menos CPU nos servidores e economiza bateria no celular do usuário.'
    }
  ];

  const RANK_KEY = 'tiverde-rank-v1';
  const quizStart = $('#quizStart');
  const quizPlay = $('#quizPlay');
  const quizEnd = $('#quizEnd');
  const quizCount = $('#quizCount');
  const quizStreak = $('#quizStreak');
  const quizPoints = $('#quizPoints');
  const quizTimer = $('#quizTimer');
  const quizQuestion = $('#quizQuestion');
  const quizOpts = $('#quizOpts');
  const quizFb = $('#quizFb');
  const quizNext = $('#quizNext');
  const rankBox = $('#ranking');
  const rankList = $('#rankList');
  const rankMask = $('#rankMask');

  let qIdx = 0;
  let score = 0;
  let hits = 0;
  let streak = 0;
  let remaining = 20;
  let timerId = null;
  let locked = false;

  function loadRank() {
    try { return JSON.parse(localStorage.getItem(RANK_KEY) || '[]'); } catch { return []; }
  }
  function saveRank(list) {
    try { localStorage.setItem(RANK_KEY, JSON.stringify(list)); } catch { /* segue */ }
  }
  function maskNick(name) {
    if (name.length <= 2) return '**';
    return `${name[0]}${'*'.repeat(Math.max(2, name.length - 2))}${name[name.length - 1]}`;
  }
  function renderRank() {
    if (!rankBox || !rankList) return;
    const list = loadRank();
    rankBox.hidden = list.length === 0;
    rankList.replaceChildren();
    list.slice(0, 6).forEach((entry, i) => {
      const li = document.createElement('li');
      const left = document.createElement('span');
      const nick = rankMask?.checked ? maskNick(entry.nick) : entry.nick;
      left.textContent = `${i + 1}. ${nick} (${entry.hits}/8)`;
      const right = document.createElement('strong');
      right.textContent = `${entry.score} pts`;
      li.append(left, right);
      rankList.append(li);
    });
  }
  rankMask?.addEventListener('change', renderRank);
  renderRank();

  function stopTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  function showQuestion() {
    stopTimer();
    locked = false;
    remaining = 20;
    const item = QUESTIONS[qIdx];
    quizCount.textContent = `Pergunta ${qIdx + 1} de ${QUESTIONS.length}`;
    quizStreak.textContent = streak >= 2 ? `🔥 Sequência ×${streak}` : '';
    quizPoints.textContent = String(score);
    quizQuestion.textContent = item.q;
    quizFb.textContent = '';
    quizNext.hidden = true;
    quizTimer.style.width = '100%';
    quizTimer.classList.remove('is-low');

    quizOpts.replaceChildren();
    item.opts.forEach((optText, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.idx = String(i);
      const key = document.createElement('span');
      key.className = 'opt-key';
      key.textContent = String(i + 1);
      const label = document.createElement('span');
      label.textContent = optText;
      btn.append(key, label);
      btn.addEventListener('click', () => answerQuestion(i, btn));
      quizOpts.append(btn);
    });

    timerId = setInterval(() => {
      remaining = Math.max(0, remaining - 0.2);
      quizTimer.style.width = `${(remaining / 20) * 100}%`;
      quizTimer.classList.toggle('is-low', remaining <= 6);
      if (remaining <= 0) {
        stopTimer();
        answerQuestion(-1);
      }
    }, 200);
  }

  function answerQuestion(choice, clickedBtn) {
    if (locked) return;
    locked = true;
    stopTimer();

    const item = QUESTIONS[qIdx];
    const buttons = [...quizOpts.querySelectorAll('button')];
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === item.ans) b.classList.add('is-right');
      else if (i === choice) b.classList.add('is-wrong');
    });

    if (choice === item.ans) {
      hits += 1;
      streak += 1;
      const timeBonus = Math.round(remaining * 5);
      const streakBonus = (streak - 1) * 25;
      const gained = 100 + timeBonus + streakBonus;
      score += gained;
      quizPoints.textContent = String(score);
      quizStreak.textContent = streak >= 2 ? `🔥 Sequência ×${streak}` : '';
      quizFb.textContent = `Correto! +${gained} pts. ${item.fb}`;
      Game.sfx.good();
    } else {
      streak = 0;
      quizStreak.textContent = '';
      quizFb.textContent = choice === -1
        ? `Tempo esgotado. ${item.fb}`
        : `Não foi dessa vez. ${item.fb}`;
      Game.sfx.bad();
    }

    quizNext.hidden = false;
    quizNext.textContent = qIdx + 1 < QUESTIONS.length ? 'Próxima pergunta →' : 'Ver resultado final';
    quizNext.focus();
  }

  function finishQuiz() {
    stopTimer();
    quizPlay.hidden = true;
    quizEnd.hidden = false;
    $('#quizFinal').textContent = `${score} pontos`;
    $('#quizSummary').textContent = `Você acertou ${hits} de ${QUESTIONS.length} perguntas sobre TI Verde.`;
    Game.unlock('quiz_done', quizEnd);
    if (hits === QUESTIONS.length) Game.unlock('quiz_perfect', quizEnd);
  }

  function startQuiz() {
    qIdx = 0;
    score = 0;
    hits = 0;
    streak = 0;
    quizStart.hidden = true;
    quizEnd.hidden = true;
    quizPlay.hidden = false;
    showQuestion();
  }

  if (quizStart) {
    quizStart.hidden = false;
    $('#quizBegin')?.addEventListener('click', startQuiz);
    $('#quizAgain')?.addEventListener('click', startQuiz);
    quizNext?.addEventListener('click', () => {
      qIdx += 1;
      if (qIdx < QUESTIONS.length) showQuestion();
      else finishQuiz();
    });

    $('#quizSave')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('#quizNick');
      const nick = (input.value || '').trim().slice(0, 16);
      if (!nick) return;
      const list = loadRank();
      list.push({ nick, score, hits, ts: Date.now() });
      list.sort((a, b) => b.score - a.score);
      saveRank(list.slice(0, 10));
      renderRank();
      input.value = '';
      Game.toast('Placar atualizado!', `${nick} entrou com ${score} pontos.`);
      Game.sfx.badge();
    });
  }

  // =========================================================
  // 9. RESUMO FINAL, SLIDE NAV & MODO APRESENTAÇÃO (TECLA P)
  // =========================================================
  const finalCard = $('#finalCard');
  if (finalCard) {
    finalCard.hidden = false;
    Game.onChange((info) => {
      $('#finalXp').textContent = String(info.xp);
      $('#finalLevel').textContent = info.level.name;
      $('#finalBadges').textContent = `${info.count} de ${info.total} conquistas desbloqueadas`;
    });
    $('#finalOpen')?.addEventListener('click', () => Game.openDialog());
    $('#finalReset')?.addEventListener('click', () => {
      Game.reset();
      window.location.hash = '#inicio';
      Game.toast('Pronto para o próximo visitante', 'XP e conquistas reiniciados.');
    });
  }

  const steps = $$('section[data-step]');
  const slideNav = $('#slideNav');
  const slideNum = $('#slideNum');
  const slideTotal = $('#slideTotal');
  const slideTitle = $('#slideTitle');
  const slideExit = $('#slideExit');
  const presentBtn = $('#presentBtn');
  const navAnchors = $$('#navLinks a');
  const readProgress = $('#readProgress');
  const siteHeader = $('#siteHeader');
  const toTop = $('#toTop');

  let currentStep = 0;
  let presenting = false;

  if (slideTotal) slideTotal.textContent = String(steps.length);
  if (slideNav && steps.length) slideNav.hidden = false;

  function updateStepUI(idx) {
    currentStep = Math.max(0, Math.min(steps.length - 1, idx));
    const sec = steps[currentStep];
    if (!sec) return;
    if (slideNum) slideNum.textContent = String(currentStep + 1);
    if (slideTitle) slideTitle.textContent = sec.dataset.title || '';

    navAnchors.forEach((a) => {
      const match = a.getAttribute('href') === `#${sec.id}`;
      if (match) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });

    Game.visit(sec.id, steps.length);
  }

  function goToStep(idx) {
    const targetIdx = Math.max(0, Math.min(steps.length - 1, idx));
    const sec = steps[targetIdx];
    if (!sec) return;
    updateStepUI(targetIdx);
    sec.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  $('#slidePrev')?.addEventListener('click', () => goToStep(currentStep - 1));
  $('#slideNext')?.addEventListener('click', () => goToStep(currentStep + 1));

  function setPresenting(on) {
    presenting = on;
    document.body.classList.toggle('is-presenting', on);
    presentBtn?.setAttribute('aria-pressed', String(on));
    if (slideExit) slideExit.hidden = !on;
    if (on) {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      goToStep(currentStep);
    } else if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }

  presentBtn?.addEventListener('click', () => setPresenting(!presenting));
  slideExit?.addEventListener('click', () => setPresenting(false));
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && presenting) setPresenting(false);
  });

  // Atalhos de teclado: P (apresentar), setas, 1/2/3 no desafio, Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (menuBtn?.getAttribute('aria-expanded') === 'true') { closeMenu(); menuBtn.focus(); }
      if (presenting) setPresenting(false);
      return;
    }
    if (isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;

    if (!quizPlay.hidden && !locked && ['1', '2', '3'].includes(e.key)) {
      const idx = Number(e.key) - 1;
      const btn = quizOpts.querySelectorAll('button')[idx];
      if (btn) { e.preventDefault(); btn.click(); }
      return;
    }

    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      setPresenting(!presenting);
    } else if (presenting || window.innerWidth >= 1200) {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        goToStep(currentStep + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToStep(currentStep - 1);
      } else if (presenting && e.key === 'ArrowDown') {
        e.preventDefault();
        goToStep(currentStep + 1);
      } else if (presenting && e.key === 'ArrowUp') {
        e.preventDefault();
        goToStep(currentStep - 1);
      }
    }
  });

  // Acompanhamento da rolagem (barra de progresso, seção ativa e botão voltar ao topo)
  function onScroll() {
    const y = window.scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (readProgress) readProgress.style.width = `${Math.min(100, (y / max) * 100)}%`;
    siteHeader?.classList.toggle('is-scrolled', y > 20);
    toTop?.classList.toggle('is-visible', y > 460);

    const probe = y + window.innerHeight * 0.34;
    let activeIdx = 0;
    steps.forEach((sec, i) => {
      if (sec.offsetTop <= probe) activeIdx = i;
    });
    if (activeIdx !== currentStep) updateStepUI(activeIdx);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' });
  });

  // Lightbox do cartaz oficial do Circuito Integrador 2026
  const posterDialog = $('#posterDialog');
  $('#posterOpen')?.addEventListener('click', () => {
    if (!posterDialog) return;
    if (typeof posterDialog.showModal === 'function') posterDialog.showModal();
    else posterDialog.setAttribute('open', '');
  });
  $('#posterClose')?.addEventListener('click', () => {
    if (!posterDialog) return;
    if (typeof posterDialog.close === 'function') posterDialog.close();
    else posterDialog.removeAttribute('open');
  });
  posterDialog?.addEventListener('click', (e) => {
    if (e.target === posterDialog && typeof posterDialog.close === 'function') posterDialog.close();
  });
})();
