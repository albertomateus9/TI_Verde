// Visualizador proporcional de 200 dispositivos descartados em Canvas 2D (alta nitidez HiDPI).
// Alterna suavemente entre os cenários reais (Global E-waste Monitor 2024) e o impacto da TI Verde.
window.GreenViz = (() => {
  'use strict';

  const canvas = document.getElementById('storyCanvas');
  if (!canvas || !canvas.getContext) return { init() {} };
  const ctx = canvas.getContext('2d');

  const hudCount = document.getElementById('storyHudCount');
  const hudLabel = document.getElementById('storyHudLabel');
  const narTitle = document.getElementById('storyNarTitle');
  const narText = document.getElementById('storyNarText');
  const btnWrap = document.getElementById('storyStepBtns');
  const buttons = btnWrap ? [...btnWrap.querySelectorAll('[data-scene]')] : [];

  const COUNT = 200;
  const COLS = 20;
  const ROWS = 10;
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const COLORS = {
    neutral: '#8EB3A3',
    recycled: '#86E0B3',
    wasted: '#FF9478',
    saved: '#F2C96B'
  };

  const SCENES = {
    total: {
      hud: '200',
      label: 'equipamentos descartados em uma amostra proporcional',
      title: '200 equipamentos chegam ao fim do uso',
      text: 'Cada ponto representa um computador, celular, monitor ou acessório. Juntos, concentram metais valiosos (cobre, ouro, prata) e substâncias tóxicas que exigem tratamento adequado.',
      classify: () => 'neutral'
    },
    world: {
      hud: '45 de 200',
      label: 'reciclados formalmente no mundo (22,3% · ITU/UNITAR 2024)',
      title: 'No mundo, só 45 de cada 200 têm reciclagem formal',
      text: 'De acordo com o Global E-waste Monitor 2024, apenas 22,3% do lixo eletrônico global tem coleta e reciclagem documentadas. Os outros 155 pontos seguem fora do fluxo formal.',
      classify: (i) => (i < 45 ? 'recycled' : 'wasted')
    },
    brazil: {
      hud: '6 de 200',
      label: 'reciclados formalmente no Brasil (~3% · ITU/UNITAR 2024)',
      title: 'No Brasil, o desafio é ainda maior: apenas 6 de 200',
      text: 'O Brasil gera cerca de 2,4 milhões de toneladas de e-lixo por ano, mas somente ~3% passam por reciclagem formal documentada. O restante fica guardado em gavetas, no lixo comum ou sem rastreio.',
      classify: (i) => (i < 6 ? 'recycled' : 'wasted')
    },
    extend: {
      hud: '100 + 60',
      label: '100 mantidos em uso por upgrade/doação + 60 em logística reversa',
      title: 'Cenário-meta com TI Verde aplicada na escola e em casa',
      text: 'Ao priorizar manutenção (SSD/RAM), doação de itens funcionais e entrega em PEVs (Green Eletron / ABREE), reduzimos drasticamente o descarte irregular e preservamos matérias-primas.',
      classify: (i) => {
        if (i < 100) return 'saved';
        if (i < 160) return 'recycled';
        return 'wasted';
      }
    }
  };

  let points = [];
  let currentScene = 'total';
  let seenScenes = new Set(['total']);
  let animId = null;

  function computeLayout(sceneKey, width, height) {
    const padX = Math.max(22, width * 0.06);
    const padY = Math.max(20, height * 0.1);
    const usableW = width - padX * 2;
    const usableH = height - padY * 2;
    const stepX = usableW / (COLS - 1);
    const stepY = usableH / (ROWS - 1);
    const scene = SCENES[sceneKey];

    return Array.from({ length: COUNT }, (_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      let tx = padX + col * stepX;
      let ty = padY + row * stepY;

      // Agrupamento visual suave por categoria nos cenários comparativos
      if (sceneKey === 'world' || sceneKey === 'brazil') {
        const type = scene.classify(i);
        if (type === 'recycled') ty -= 6;
        else ty += 4;
      } else if (sceneKey === 'extend') {
        const type = scene.classify(i);
        if (type === 'saved') ty -= 6;
        else if (type === 'wasted') ty += 6;
      }

      return { tx, ty, color: COLORS[scene.classify(i)] };
    });
  }

  function resizeAndDraw() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, Math.round(rect.width || 560));
    const height = Math.max(220, Math.round(rect.height || 300));

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const targets = computeLayout(currentScene, width, height);
    if (!points.length) {
      points = targets.map((t) => ({ x: t.tx, y: t.ty, tx: t.tx, ty: t.ty, color: t.color }));
    } else {
      points.forEach((p, i) => {
        p.tx = targets[i].tx;
        p.ty = targets[i].ty;
        p.color = targets[i].color;
        if (reduceMotion()) {
          p.x = p.tx;
          p.y = p.ty;
        }
      });
    }
    draw(width, height);
  }

  function draw(width, height) {
    ctx.clearRect(0, 0, width, height);
    const radius = width < 400 ? 4.2 : 5.4;

    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
  }

  function stepAnimation() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, Math.round(rect.width || 560));
    const height = Math.max(220, Math.round(rect.height || 300));
    let moving = false;

    points.forEach((p) => {
      const dx = p.tx - p.x;
      const dy = p.ty - p.y;
      if (Math.abs(dx) > 0.25 || Math.abs(dy) > 0.25) {
        p.x += dx * 0.16;
        p.y += dy * 0.16;
        moving = true;
      } else {
        p.x = p.tx;
        p.y = p.ty;
      }
    });

    draw(width, height);
    if (moving) animId = requestAnimationFrame(stepAnimation);
    else animId = null;
  }

  function setScene(sceneKey, anchor) {
    const scene = SCENES[sceneKey];
    if (!scene) return;
    currentScene = sceneKey;
    seenScenes.add(sceneKey);

    buttons.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.scene === sceneKey));
    });

    if (hudCount) hudCount.textContent = scene.hud;
    if (hudLabel) hudLabel.textContent = scene.label;
    if (narTitle) narTitle.textContent = scene.title;
    if (narText) narText.textContent = scene.text;

    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, Math.round(rect.width || 560));
    const height = Math.max(220, Math.round(rect.height || 300));
    const targets = computeLayout(sceneKey, width, height);

    points.forEach((p, i) => {
      p.tx = targets[i].tx;
      p.ty = targets[i].ty;
      p.color = targets[i].color;
      if (reduceMotion()) {
        p.x = p.tx;
        p.y = p.ty;
      }
    });

    if (reduceMotion()) {
      draw(width, height);
    } else if (!animId) {
      animId = requestAnimationFrame(stepAnimation);
    }

    if (seenScenes.size === Object.keys(SCENES).length && window.GreenGame) {
      window.GreenGame.unlock('panorama', anchor);
    }
  }

  function init() {
    resizeAndDraw();
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (window.GreenGame) window.GreenGame.sfx.click();
        setScene(btn.dataset.scene, btn);
      });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeAndDraw, 120);
    });
  }

  return { init, setScene };
})();
