# Circuito Integrador 2026 — Arquitetura em Dois Repositórios (`Projetos_Subsequente_2026` e `TI_Verde`)

* **Author:** Alberto Mateus
* **Status:** Proposed
* **Date:** 2026-11-24

--------------------------------------------------------------------------------

## Overview

Este documento especifica a separação do portal web estático do **Circuito Integrador 2026 — Feira de Projetos Integradores** da **EETEPA Vilhena Alves** (**26/11/2026, início às 19h30, Auditório da Escola Vilhena Alves, entrada gratuita**) em dois repositórios independentes publicados no GitHub Pages:

1. **`albertomateus9/Projetos_Subsequente_2026`** (`https://albertomateus9.github.io/Projetos_Subsequente_2026/`): portal principal mobile-first da feira, apresentando o evento, o cartaz oficial final, o protagonismo inicial do Curso Técnico em Informática (com ligação direta na mesma aba para `TI_Verde`) e páginas individuais para **Administração (`Raízes do Norte`)**, **Condomínio (`uCondo`)**, **Transações Imobiliárias (`TCC MCMV`)** e **Eventos (`Organização`)**.
2. **`albertomateus9/TI_Verde`** (`https://albertomateus9.github.io/TI_Verde/`): site autônomo dedicado exclusivamente à produção prática da turma de Informática (2º período subsequente 2026), centrado nas quatro etapas físicas da oficina de triagem e recondicionamento de computadores, três números verificados de contexto, atividade interativa de triagem na bancada e links de descarte gratuito de lixo eletrônico (PEVs).

Todo acesso previsto ocorre via smartphones — a partir de QR Codes impressos em banners físicos de cada projeto e links compartilhados pelo WhatsApp — sem apresentação oral em projetor e sem banca avaliadora.

## The Problem

A versão inicial publicada em `albertomateus9/TI_Verde` nasceu como um site único de nove capítulos voltado para apresentação oral em monitor desktop (tecla `P`, barra flutuante de slides, gamificação de quiosque em `localStorage`, simulador de laboratório, raio-X de data center e quiz cronometrado). Três falhas estruturais tornam esse modelo inadequado para o evento de 26/11 às 19h30:

1. **Conflito de identidade institucional na URL:** usar `.../TI_Verde/` para hospedar o portal dos cinco cursos confunde familiares e visitantes de *Administração*, *Condomínio*, *Transações Imobiliárias* e *Eventos* ao apontarem a câmera do celular para seus respectivos banners ou receberem o link no WhatsApp.
2. **Desalinhamento entre o conteúdo exibido e o que a turma produziu:** como não haverá banca avaliadora e os visitantes querem ver o que os alunos produziram na escola, abrir `TI_Verde` com teoria abstrata de data centers, simulador fictício e ranking single-player de quiosque esconde o trabalho físico real documentado nas fotos da oficina da EETEPA e consome banda 4G escassa no auditório.
3. **Risco de indisponibilidade e quebra de prévia nos QR Codes impressos:** banners físicos são irreversíveis após a gráfica. Encurtadores externos de URL (Bitly, TinyURL, is.gd ou geradores gratuitos de QR dinâmico) introduzem limites de cota, anúncios intersticiais, risco de expiração/paywall, bloqueio em filtros de rede escolar/WhatsApp e latência extra de DNS/TLS no 4G, enquanto tocar no repositório pessoal `albertomateus9.github.io` (aplicação Next.js 16 com CI de testes) introduz acoplamento desnecessário a menos de 48 horas do evento.

A solução separa o hub multi-cursos no repositório `Projetos_Subsequente_2026` e promove a produção enxuta da oficina de Informática para a raiz de `TI_Verde`, utilizando **URLs diretas geradas em QR Codes offline** (sem encurtadores de terceiros e sem alterar `albertomateus9.github.io`), com navegação na mesma aba e metadados Open Graph independentes por rota.

## Goals

* **Publicar dois repositórios independentes com URLs diretas canônicas retornando HTTP 200:**
  * Hub e 4 cursos em `https://albertomateus9.github.io/Projetos_Subsequente_2026/` (`/`, `/adm/`, `/condominio/`, `/imobiliarias/`, `/eventos/`).
  * Produção de Informática na raiz `https://albertomateus9.github.io/TI_Verde/`.
* **Assegurar orientação contínua entre os dois repositórios no celular:** transições entre o Hub e `TI_Verde` sempre na mesma aba (sem `target="_blank"`), retorno explícito no topo e rodapé de `TI_Verde` para todos os projetos da feira, e continuidade automática das preferências de acessibilidade (`tiverde-font` e `tiverde-contrast` no `localStorage` compartilhado na origem `albertomateus9.github.io`).
* **Dar protagonismo à produção física real da turma de Informática em `TI_Verde`:** abertura com foto real da oficina, sequência curada das 4 etapas (*Separar → Testar → Recuperar → Voltar ao uso*) com etiquetas manuscritas legíveis, 3 dados verificados de contexto, Triagem interativa ancorada na bancada e links gratuitos de coleta (Green Eletron e ABREE).
* **Garantir carregamento rápido em 4G congestionado e ergonomia mobile (360–430 px):** zero fontes externas bloqueantes, zero `@import` de CSS, imagens otimizadas em WebP sem metadados EXIF/GPS, lightbox único sob demanda (0 KB de imagem ampliada no carregamento inicial), `CLS = 0`, `scrollWidth <= innerWidth` e alvos de toque `>= 44×44 px`.
* **Garantir compartilhamento íntegro no WhatsApp e leitura confiável dos QR Codes:** metadados Open Graph completos com `og:image` JPEG (`1200×630`, `< 300 KB`, URL HTTPS absoluta) por rota e geração offline/verificada dos 6 QR Codes em alta nitidez (margem silenciosa de 4 módulos, sem logo no centro, recomendação de impressão ≥ 8 cm em acabamento fosco).
* **Executar a migração sem perda de trabalho e sem janela de indisponibilidade:** snapshot local do trabalho atual antes da separação, publicação e verificação do Hub antes de atualizar `TI_Verde`, compatibilidade de hashes legados da v1 e páginas `404.html` autônomas em ambos os repositórios.

## Non-Goals

* Uso de encurtadores de URL de terceiros (`bit.ly`, `tinyurl.com`, `is.gd`, geradores web de QR dinâmico).
* Alteração ou publicação de arquivos no repositório pessoal Next.js (`albertomateus9/albertomateus9.github.io`).
* Renomeação do repositório `Projetos_Subsequente_2026` ou de `TI_Verde`.
* Modo apresentação oral em projetor (`tecla P`, barra de slides), gamificação de quiosque (`js/game.js`, HUD, conquistas, confete, áudio, placar local), Canvas de 200 pontos (`js/viz.js`), simulador de laboratório, bloco técnico de PUE/virtualização/Green Coding ou quiz cronometrado.
* Service Worker / cache offline customizado (`NO-SW`) na janela anterior ao evento.
* Backend, banco de dados, autenticação, coleta de dados pessoais ou rastreadores analíticos de terceiros.
* Fabricação de dados, métricas ou páginas interativas para os outros quatro cursos além dos fatos presentes nos materiais oficiais fornecidos.

## Open Questions

* Nenhuma decisão arquitetural bloqueante em aberto após o encerramento do `/egm-brainstorm` (`concepts_brief.md`).
* **Verificação operacional pendente antes da gráfica:** confirmar visualmente o tamanho físico final dos QR Codes impressos em cada banner (mínimo recomendado: ≥ 8×8 cm, especialmente para `/Projetos_Subsequente_2026/imobiliarias/` com 72 caracteres).

## Critical User Journeys (CUJs)

### CUJ 1: Visitante escaneia o QR Code do banner geral ou de um dos 4 cursos no auditório
* **Given:** Visitante com smartphone conectado em 4G/5G no Auditório da Escola Vilhena Alves às 19h30 aponta a câmera para o banner geral do Circuito Integrador 2026 ou para o banner de Administração, Condomínio, Transações Imobiliárias ou Eventos.
* **When:** O navegador abre a URL direta correspondente em `https://albertomateus9.github.io/Projetos_Subsequente_2026/...`.
* **Then:** A página carrega rapidamente em 4G sem overflow horizontal (360–430 px) e sem download antecipado de imagens de lightbox, confirma imediatamente o evento e o curso escaneado com informações fiéis aos materiais oficiais, permite ampliar o cartaz em `<dialog>` sob demanda e oferece navegação em 1 toque (na mesma aba) tanto para os demais cursos quanto para o projeto em destaque `T.I Verde` em `https://albertomateus9.github.io/TI_Verde/`.

### CUJ 2: Visitante escaneia o QR Code do banner T.I Verde (entrada fria direta)
* **Given:** Visitante no estande de Informática escaneia o QR Code apontando para `https://albertomateus9.github.io/TI_Verde/` (sem histórico prévio do portal no botão Voltar do celular).
* **When:** A página raiz de `TI_Verde` carrega e o visitante percorre as 4 etapas da oficina, testa os cards de Triagem na bancada e consulta os links de coleta gratuita.
* **Then:** O visitante vê na primeira tela a foto real da oficina da EETEPA, navega pelas 4 etapas (*Separar → Testar → Recuperar → Voltar ao uso*) com etiquetas legíveis e ampliação sob demanda (Foto 1 / Foto 2), recebe retorno imediato em linguagem simples nos 6 cards da Triagem, acessa links diretos para Green Eletron e ABREE e encontra no topo e no rodapé o botão explícito para voltar na mesma aba ao Hub dos cinco cursos (`https://albertomateus9.github.io/Projetos_Subsequente_2026/`).

### CUJ 3: Compartilhamento de qualquer uma das 6 rotas pelo WhatsApp
* **Given:** Estudante, familiar ou professor copia ou envia qualquer uma das 6 URLs canônicas em uma conversa ou grupo de WhatsApp.
* **When:** O crawler do WhatsApp requisita a URL para montar o cartão de pré-visualização.
* **Then:** A URL responde diretamente com `HTTP 200` (sem redirecionamento de terceiro), exibindo título, descrição em português acessível e a imagem `og:image` JPEG (`1200×630`, `< 300 KB`) específica daquela rota.

### CUJ 4: Acesso por link legado da v1 ou erro de digitação de URL
* **Given:** Alguém abre um link compartilhado anteriormente (ex.: `.../TI_Verde/#triagem`, `.../TI_Verde/#panorama` ou `.../TI_Verde/ti-verde/`) ou digita um caminho com erro de maiúsculas/minúsculas dentro de um dos dois repositórios.
* **When:** A página raiz ou o `404.html` autônomo processa o endereço.
* **Then:** O visitante é encaminhado automaticamente para a seção ou rota equivalente (ou recebe uma tela limpa em português com botões clicáveis para o Hub e todos os cinco cursos), sem cair na página 404 padrão em inglês do GitHub.

## Technical Plan (Architecture)

### 1. Topologia em Dois Repositórios no GitHub Pages (Mesma Origem)

O ecossistema roda inteiramente em arquivos estáticos (HTML5, CSS3 e JavaScript nativo sem etapa de build, sem bundler, sem fontes externas e sem Service Worker) servidos pelo GitHub Pages sob a mesma origem HTTPS `https://albertomateus9.github.io`:

```text
QR Codes impressos nos banners físicos (gerados offline, ECC Q, 0 encurtadores)
  │
  ├── Banner Geral & 4 Cursos ───────────────────────────► Repo 1: albertomateus9/Projetos_Subsequente_2026
  │                                                         Origin: https://albertomateus9.github.io/Projetos_Subsequente_2026/
  │                                                         ├── /               (Hub: evento, cartaz final, destaque T.I Verde, grade 5 cursos)
  │                                                         ├── /adm/           (Administração — Raízes do Norte)
  │                                                         ├── /condominio/    (Condomínio — Gestão com uCondo)
  │                                                         ├── /imobiliarias/  (Transações Imobiliárias — TCC MCMV 2026)
  │                                                         ├── /eventos/       (Eventos — Organização do Circuito)
  │                                                         ├── /ti-verde/      (Stub HTTP 200 -> redireciona p/ /TI_Verde/ + hash)
  │                                                         └── /404.html       (Inline: corrige aliases/caixa e links diretos)
  │                                                               │
  │                                                               │ Navegação na mesma aba (sem target="_blank")
  │                                                               │ + localStorage compartilhado na origem albertomateus9.github.io
  │                                                               ▼
  └── Banner T.I Verde ──────────────────────────────────► Repo 2: albertomateus9/TI_Verde
                                                            Origin: https://albertomateus9.github.io/TI_Verde/
                                                            ├── /               (Oficina 4 etapas, 3 KPIs, Triagem, PNRS/PEVs, retorno ao Hub)
                                                            ├── /ti-verde/      (Stub HTTP 200 -> redireciona p/ ../ + hash)
                                                            └── /404.html       (Inline: aliases locais + redirecionamento para cursos no Hub)

Repo 3 (INTOCADO): albertomateus9/albertomateus9.github.io (Portfólio Next.js 16 + CI) — zero alterações, zero acoplamento.
```

Cada repositório é autônomo em CSS, JS e imagens (sem CSS servido cross-repo e sem submódulos Git). A duplicação controlada do núcleo estático (`css/tokens.css`, `css/site.css`, `js/shared.js` e `favicon.svg` — ~33 KB no total antes da compressão gzip) elimina acoplamento de deploy entre os dois repositórios e evita que uma atualização no Hub quebre o carregamento de `TI_Verde` ou vice-versa. Ambos carregam `.nojekyll` na raiz para desativar processamento Jekyll no GitHub Pages.

### 2. Mapa Canônico das 6 Rotas, QR Codes e Metadados Open Graph

| Rota / Banner | URL Canônica (HTTP 200 Direto) | Caracteres | QR (Byte Mode @ ECC Q) | Módulo em 8 cm (com borda de 4 módulos) | `og:image` (JPEG 1200×630) |
| --- | --- | ---: | --- | ---: | --- |
| Hub Circuito 2026 | `https://albertomateus9.github.io/Projetos_Subsequente_2026/` | 59 | V5 (37×37) | 1,78 mm | `Projetos_Subsequente_2026/.../og-circuito.jpg` (110 KB) |
| Administração | `https://albertomateus9.github.io/Projetos_Subsequente_2026/adm/` | 63 | V6 (41×41) | 1,63 mm | `Projetos_Subsequente_2026/.../og-adm.jpg` (97 KB) |
| Condomínio | `https://albertomateus9.github.io/Projetos_Subsequente_2026/condominio/` | 70 | V6 (41×41) | 1,63 mm | `Projetos_Subsequente_2026/.../og-condominio.jpg` (85 KB) |
| Transações Imobiliárias | `https://albertomateus9.github.io/Projetos_Subsequente_2026/imobiliarias/` | 72 | V6 (41×41) | 1,63 mm | `Projetos_Subsequente_2026/.../og-imobiliarias.jpg` (27 KB) |
| Eventos | `https://albertomateus9.github.io/Projetos_Subsequente_2026/eventos/` | 67 | V6 (41×41) | 1,63 mm | `Projetos_Subsequente_2026/.../og-eventos.jpg` (110 KB) |
| Informática (T.I Verde) | `https://albertomateus9.github.io/TI_Verde/` | 42 | V4 (33×33) | 1,95 mm | `TI_Verde/.../og-ti-verde.jpg` (131 KB) |

**Regras de geração e impressão dos QR Codes:**
* Todos os 6 QR Codes são gerados localmente/offline (Python `qrcode`, modo Byte, correção de erro `Q` = 25% de tolerância a reflexos/dobras, preto puro `#000000` sobre branco puro `#FFFFFF`, margem silenciosa de 4 módulos, sem logo inserido no centro) e validados por decodificação automatizada contra a string exata da tabela acima antes do envio à gráfica.
* Todos os módulos permanecem entre `1,63 mm` e `1,95 mm` mesmo no piso físico de `8×8 cm` (mais de 3× acima do limite mínimo de `0,5 mm` para câmeras de celular) e atingem `2,45–2,93 mm` em `12×12 cm`.
* A URL canônica de cada rota usa barra final (`/`) e todas as referências a ativos dentro do próprio repositório são **estritamente relativas** (`./` na raiz e `../` em subpastas de 1 nível), nunca root-relative (`/assets/...`), garantindo funcionamento igual tanto no GitHub Pages quanto em prévia local.

### 3. Navegação Cross-Repo, Estado Compartilhado e Compatibilidade Retroativa

* **Navegação na mesma aba (Zero `target="_blank"` interno):** todas as transições entre `Projetos_Subsequente_2026` e `TI_Verde` usam links HTTPS absolutos sem `target="_blank"`:
  * No Hub (`Projetos_Subsequente_2026/index.html` e nas 4 subpáginas `/adm/`, `/condominio/`, `/imobiliarias/`, `/eventos/`): os links de destaque, topo, banner cruzado e rodapé para Informática apontam diretamente para `https://albertomateus9.github.io/TI_Verde/` (e `https://albertomateus9.github.io/TI_Verde/#oficina` no botão secundário de fotos).
  * Em `TI_Verde/index.html`: o botão fixo no topo (`← Circuito 2026`), o link `5 Cursos` no menu (`.../#cursos`), o bloco de encerramento (`← Voltar ao portal do Circuito`), os 4 chips de cursos irmãos (`/adm/`, `/condominio/`, `/imobiliarias/`, `/eventos/`) e o link do rodapé apontam diretamente para `https://albertomateus9.github.io/Projetos_Subsequente_2026/...`.
  * Somente links externos de terceiros (Green Eletron, ABREE, Planalto, Global E-waste Monitor 2024 e código no GitHub) abrem em nova aba com `target="_blank" rel="noopener noreferrer"`.
* **Continuidade de acessibilidade pela mesma origem:** como ambos os repositórios compartilham a origem `https://albertomateus9.github.io`, as chaves `tiverde-font` (escala `90–150%` aplicada à variável CSS `--font-scale` e classe `body.texto-grande` a partir de `135%`) e `tiverde-contrast` (classe `body.alto-contraste`, paleta WCAG AAA) gravadas em `localStorage` persistem automaticamente quando o visitante salta do Hub para `TI_Verde` ou retorna. Um snippet inline mínimo no `<head>` aplica a preferência antes da primeira pintura para evitar piscar de fonte ou contraste.
* **Compatibilidade com hashes da v1 e stubs defensivos:**
  * Em `TI_Verde/index.html`, um mapa de hashes no `<head>` traduz âncoras da v1 que já tenham circulado (`#panorama` → `#dados`, `#legislacao` e `#agir` → `#descarte`, `#simulador` → `#oficina`, `#datacenter` → `#dados`, `#desafio` → `#triagem`), enquanto `#triagem` e `#turma` existem nativamente na página.
  * Em `Projetos_Subsequente_2026/index.html`, o mapa de hashes da v1 é **removido** (não pertence ao Hub).
  * `Projetos_Subsequente_2026/ti-verde/index.html` atua como stub leve HTTP 200 redirecionando via `location.replace` para `https://albertomateus9.github.io/TI_Verde/` (preservando `location.hash`), com link manual visível caso JavaScript esteja desativado.
  * `TI_Verde/ti-verde/index.html` atua como stub leve HTTP 200 redirecionando para `../` (preservando `location.hash`), cobrindo eventuais links temporários da etapa anterior.
* **Páginas `404.html` autônomas (100% inline, sem CSS/JS externos):**
  * **`Projetos_Subsequente_2026/404.html`:** calcula o slug com `base = '/Projetos_Subsequente_2026/'` e `path.slice(idx + base.length)` (corrigindo o offset fixo `idx + 10` do protótipo anterior). Normaliza aliases locais (`adm`, `administracao`, `raizes-do-norte`, `condominio`, `ucondo`, `imobiliarias`, `imobiliaria`, `transacoes-imobiliarias`, `mcmv`, `eventos`) para o Hub e aliases de Informática (`ti-verde`, `tiverde`, `ti`, `informatica`) para `https://albertomateus9.github.io/TI_Verde/`.
  * **`TI_Verde/404.html`:** usa `base = '/TI_Verde/'` e `path.slice(idx + base.length)`. Redireciona aliases de Informática para `/TI_Verde/` e aliases dos outros 4 cursos para `https://albertomateus9.github.io/Projetos_Subsequente_2026/<rota>/`, exibindo fallback em português com botões `>= 46 px` para todas as 6 rotas.

### 4. Arquitetura Front-End, Mídia 2-Tier e Componentes Interativos

* **Design system estático (`css/tokens.css` + `css/site.css`, ~27 KB não comprimidos / ~6 KB gzip):**
  * Carregado por dois `<link rel="stylesheet">` diretos com parâmetro de versão (`?v=20261125`) — zero `@import`, zero webfonts externas (`Georgia` / `system-ui` / `ui-monospace`).
  * Barra de acessibilidade `.a11y-bar` **não-sticky** no topo; cabeçalho `.site-header` sticky em linha única (`--nav-h: 56px`), com `.brand` flexível (`flex: 1 1 auto; min-width: 0`) e elipse para impedir overflow horizontal em 360–430 px. Em larguras `<= 820px` ou com `body.texto-grande`, o menu colapsa atrás do botão `Menu` (`nav-ready` só é adicionado via JS após o listener ser registrado — degradação graciosa sem JS).
  * Sobrescrita de cor por curso no `<body>` via duas custom properties (`--course-accent` e `--course-soft`), preservando um único arquivo `site.css` nos dois repositórios.
* **Pipeline de mídia 2-tier sem EXIF/GPS (`scratch/build_media.py`):**
  * Todas as imagens são transpostas via `ImageOps.exif_transpose` e regravadas em RGB puro, eliminando 100% dos metadados EXIF/GPS.
  * **Tier 1 (carregamento inicial):** fotos da oficina em proporção fixa `4:3` (`hero-oficina-960.webp` com `85,8 KB` e `fetchpriority="high"`; quatro miniaturas `etapa-0{1..4}-a-640.webp` entre `28,5 KB` e `44,4 KB` com `loading="lazy"` e `width="640" height="480"`). O Hub carrega apenas `circuito-integrador-2026-640.webp` (`98,6 KB`), `oficina/hero-oficina-640.webp` (`46,7 KB`) e `cursos/ti-verde-logo-320.webp` (`20,9 KB`). Ativos não referenciados (`circuito-integrador-2026.jpg` e `hero-oficina-1200.webp`) não são copiados para os repositórios de produção.
  * **Tier 2 (sob demanda no lightbox):** `<dialog id="mediaLightbox">` nasce com `<img id="lightboxImg" src="" alt="">` vazio (`0 KB` baixados no carregamento inicial). Apenas ao toque do visitante, `js/shared.js` (~4,6 KB não comprimido) lê `data-full` (e `data-full2` nas 4 etapas da oficina) e carrega a versão `1200.webp` / `1024.webp`, com alternância `Foto 1` / `Foto 2` e fechamento por botão, backdrop ou `Escape`.
* **Interatividade exclusiva de `TI_Verde` (`js/triage.js`, ~2,6 KB não comprimido):**
  * **Trilho horizontal das 4 etapas:** `.stage-track` usa `scroll-snap-type: x mandatory` no mobile (`< 768px`) e vira grade `2×2` em desktop (`>= 768px`). Um `IntersectionObserver` sincroniza os 4 botões `.stage-tabs` (`01 · Separar` até `04 · Voltar ao uso`).
  * **Triagem na bancada (6 cards, 3 destinos):** cada card traz o destino correto em `data-answer` (`ok`, `conserto` ou `descarte`) e o texto explicativo já no HTML (ocultado apenas após `body.triage-ready`, garantindo leitura integral mesmo sem JS). Ao toque, o card exibe feedback visual imediato e atualiza o contador acessível `aria-live="polite"`.

### 5. Separação de Ativos e Fronteiras entre Repositórios

| Grupo de arquivos | `Projetos_Subsequente_2026` (Hub + 4 cursos) | `TI_Verde` (Informática na raiz) |
| --- | --- | --- |
| Páginas HTML | `index.html`, `adm/index.html`, `condominio/index.html`, `imobiliarias/index.html`, `eventos/index.html`, `ti-verde/index.html` (stub), `404.html` | `index.html` (promovido), `ti-verde/index.html` (stub), `404.html` |
| Estilos e Scripts | `css/tokens.css`, `css/site.css`, `js/shared.js` | `css/tokens.css`, `css/site.css`, `js/shared.js`, `js/triage.js` |
| Imagens de cartazes/cursos | `circuito-integrador-2026-{640,1024}.webp`, `cursos/*` (7 arquivos), `oficina/hero-oficina-640.webp` (apenas card de destaque) | Nenhuma imagem dos outros 4 cursos |
| Imagens da oficina | Apenas `oficina/hero-oficina-640.webp` | `oficina/hero-oficina-960.webp`, `etapa-0{1..4}-a-640.webp`, `etapa-0{1..4}-{a,b}-1200.webp` (13 arquivos) |
| Imagens Open Graph | `og-{circuito,adm,condominio,imobiliarias,eventos}.jpg` (5 arquivos) | `og-ti-verde.jpg` (1 arquivo) |
| Configuração Pages | `.nojekyll`, `favicon.svg`, `README.md` | `.nojekyll`, `favicon.svg`, `README.md` |

## Alternatives Considered

### Alternativa A: Encurtadores de URL de terceiros (`bit.ly`, `tinyurl.com`, `is.gd`, geradores gratuitos de QR dinâmico)

* **Prós:** URLs curtas (20–28 caracteres), reduzindo a matriz do QR Code para versão V2 (25×25).
* **Contras:** O plano gratuito do Bitly limita a 5 links e 2 QR Codes por mês, injeta página intersticial com anúncio e não permite alterar o destino; geradores gratuitos de QR dinâmico expiram em 7–14 dias ou impõem paywall após 50–100 leituras. Introduz latência extra de DNS+TLS frio (400–2.500 ms em 4G congestionado), risco de bloqueio por filtros anti-phishing em redes públicas/operadoras, desconfiança de familiares brasileiros quanto a links encurtados opacos, perda de cartão Open Graph no WhatsApp em intersticiais e ausência de rollback caso o serviço terceirizado falhe às 19h30 em banners já impressos.
* **Motivo da rejeição:** Rejeitada por unanimidade na análise técnica (5/5 revisores) e pelo autor. Como as URLs diretas já operam em V4–V6 (`1,63–1,95 mm/módulo` em 8 cm), o ganho marginal de matriz não compensa o ponto único de falha externo irreversível em mídia impressa.

### Alternativa B: Renomear o repositório `Projetos_Subsequente_2026` para um nome curto (ex.: `ci26`)

* **Prós:** Encurtaria as URLs diretas do Hub de 59–72 caracteres para 38–51 caracteres (V3–V5 @ ECC Q) sem depender de terceiros nem tocar em um terceiro repositório.
* **Contras:** Exige renomear o repositório já criado (`Projetos_Subsequente_2026`) e congelar imediatamente o novo nome, pois o GitHub não cria redirecionamento HTTP para URLs `*.github.io/<repo>/` após renomeação (qualquer QR apontando para o nome anterior retornaria HTTP 404). Reduz também a autodescrição da URL para quem recebe o link no WhatsApp.
* **Motivo da rejeição:** Rejeitada pelo autor: optou por manter o nome institucional `Projetos_Subsequente_2026` já criado para o repositório principal do evento.

### Alternativa C: Encurtador próprio first-party no repositório raiz `albertomateus9.github.io` (`public/c/...` ou `public/0.html`..`5.html`)

* **Prós:** Permite URLs curtíssimas sob domínio próprio (ex.: `HTTPS://ALBERTOMATEUS9.GITHUB.IO/1` com 34 caracteres em Modo Alfanumérico QR = V2–V3 mesmo com ECC H de 30% de recuperação) mantendo controle total sobre os redirecionamentos.
* **Contras:** A auditoria do repositório `albertomateus9/albertomateus9.github.io` confirmou tratar-se de uma aplicação **Next.js 16.2.10 + TypeScript + Tailwind + Vitest + Docker** (`output: "export"`), com CI executando `npm ci && npm test && npm run typecheck && npm run build:pages` a cada push na `main`. Exigiria manter stubs estáticos em `public/` fora de colisões com rotas existentes, duplicar tags Open Graph (incluindo `og:image`) em um terceiro repositório sem `<meta http-equiv="refresh">` (que quebra o crawler do WhatsApp) e aceitar um salto adicional de HTML/JS antes de carregar o destino.
* **Motivo da rejeição:** Rejeitada pelo autor: optou por manter o portfólio pessoal Next.js completamente intocado e sem acoplamento operacional com o evento.

### Alternativa D: Manter todas as 6 rotas em um único repositório (`TI_Verde`)

* **Prós:** Um único repositório para publicar, caminhos relativos diretos entre todos os cursos e zero duplicação dos ~33 KB de `css/` e `js/shared.js`.
* **Contras:** Todos os QR Codes e links compartilhados no WhatsApp para *Administração*, *Condomínio*, *Transações Imobiliárias* e *Eventos* exibiriam `/TI_Verde/` no endereço, gerando confusão institucional e subordinando o evento inteiro à URL de um único curso.
* **Motivo da rejeição:** Rejeitada pelo autor ao criar `Projetos_Subsequente_2026` como hub principal do Circuito Integrador 2026 e reservar `TI_Verde` exclusivamente para a produção de Informática.

### Alternativa E: Escopo expandido em `TI_Verde` (simulador de laboratório, PUE/virtualização, quiz cronometrado, placar e modo apresentação)

* **Prós:** Reaproveitaria componentes teóricos e gamificados construídos na v1 (`js/game.js`, `js/viz.js`, tecla `P`, barra de slides).
* **Contras:** O evento não terá apresentação oral em projetor nem banca avaliadora; visitantes da comunidade acessam em pé pelo celular para ver o que os alunos produziram. Manter teoria abstrata de data centers, placar single-player local e Canvas de 200 pontos atrasaria o contato com as fotos reais da oficina e aumentaria código e tempo de leitura sem ganho para o público real.
* **Motivo da rejeição:** Rejeitada pelo autor em favor do escopo enxuto centrado na oficina real da EETEPA (4 etapas + 3 números verificados + Triagem na bancada + descarte gratuito).

### Alternativa F: Service Worker (`sw.js`) para cache offline no auditório

* **Prós:** Permitiria reabrir páginas já visitadas caso o sinal 4G oscilasse dentro do auditório.
* **Contras:** Não acelera a primeira visita ao escanear o QR Code (momento crítico do evento) e introduz risco elevado de servir versões obsoletas de HTML/CSS/JS em dispositivos de teste ou dos primeiros visitantes durante correções de última hora na véspera de 26/11.
* **Motivo da rejeição:** Rejeitada na auditoria técnica e aceita pelo autor (`NO-SW`), substituída por páginas estáticas leves com cache HTTP padrão do GitHub Pages e query string de versão nos arquivos CSS/JS (`?v=20261125`).

--------------------------------------------------------------------------------

## Non-Functional Requirements

### Segurança e Privacidade

* **Superfície estática sem dados pessoais:** zero backend, zero formulários, zero cookies, zero rastreadores analíticos de terceiros e zero armazenamento de dados identificáveis (apenas as preferências locais `tiverde-font` e `tiverde-contrast` no `localStorage` do navegador do visitante).
* **Higienização de mídia (EXIF/GPS):** 100% das imagens raster publicadas (`.webp` e `.jpg`) passam por transposição de orientação e regravação em RGB puro, garantindo zero tags EXIF ou coordenadas GPS no histórico público dos dois repositórios Git.
* **Autorização de imagem e autoria:** todas as fotografias da oficina e a exibição da capa/autoria do TCC de Transações Imobiliárias (*Ana Cláudia, Bernadete Cardoso, Nilton Thiago, Silvana Santiago*) foram expressamente autorizadas pelos estudantes segundo declaração do autor.
* **Isolamento de links externos:** todo link para domínios de terceiros (Green Eletron, ABREE, Planalto, Global E-waste Monitor 2024, GitHub) utiliza `target="_blank" rel="noopener noreferrer"`.

### Performance, Orçamento 4G e Acessibilidade

* **Orçamento de carregamento inicial (mobile 4G):**
  * `TI_Verde/` (raiz): ~296 KB não comprimidos (~255 KB sobre HTTP com gzip do Fastly/GitHub Pages), sendo `85,8 KB` na imagem LCP (`hero-oficina-960.webp`, `fetchpriority="high"`), `148,2 KB` distribuídos em 4 miniaturas `loading="lazy"`, `~27 KB` de CSS, `~7,4 KB` de JS e `0 KB` de imagens ampliadas do lightbox no load inicial.
  * `Projetos_Subsequente_2026/` (Hub): ~215 KB não comprimidos no carregamento inicial (`circuito-integrador-2026-640.webp` 98,6 KB + `hero-oficina-640.webp` 46,7 KB + `ti-verde-logo-320.webp` 20,9 KB + CSS/JS/HTML).
  * Subpáginas de curso (`/adm/`, `/condominio/`, `/imobiliarias/`, `/eventos/`): uma única imagem Tier 1 por rota (`23–177 KB`), zero `js/triage.js` carregado e lightbox sob demanda.
  * Todos os 6 arquivos `og-*.jpg` ficam abaixo de `135 KB` (teto do WhatsApp: `< 300 KB`).
* **Estabilidade visual e ergonomia mobile:** zero fontes externas bloqueantes, zero `@import` de CSS, dimensões explícitas (`width`/`height`) e `aspect-ratio: 4 / 3` nas fotos da oficina (`CLS = 0`), zero overflow horizontal (`scrollWidth <= innerWidth`) em `360×800 px` e `390×844 px` (incluindo escala de texto até `150%`) e alvos de toque `>= 44×44 px`.
* **Acessibilidade (WCAG 2.2 AA+ / AAA sob demanda):** hierarquia estrita de títulos (`1 H1`, sem saltos de nível), link `Pular para o conteúdo`, `aria-live="polite"` na Triagem, fechamento por teclado (`Escape`) no menu e no `<dialog>`, degradação funcional com JS desativado e persistência automática de tamanho de texto e Alto Contraste AAA entre ambos os repositórios pela mesma origem `https://albertomateus9.github.io`.

### Rollout Zero-Downtime e Rollback

* **Sequência obrigatória sem janela de indisponibilidade:**
  1. **Passo 0 (Proteção local):** criar branch local `backup/pre-split-6-rotas` em `c:\Projetos\TI_Verde` contendo o protótipo atual de 6 rotas não commitado (sem enviar para o remoto) antes de qualquer edição ou remoção.
  2. **Passo 1 (Publicação do Hub):** montar, validar localmente, enviar à `main` e ativar GitHub Pages em `albertomateus9/Projetos_Subsequente_2026`. **Gate 1:** confirmar `HTTP 200` em `/`, `/adm/`, `/condominio/`, `/imobiliarias/`, `/eventos/`, `/ti-verde/` e nos 5 arquivos `og-*.jpg` enquanto `TI_Verde` segue live na v1 intacta.
  3. **Passo 2 (Atualização de `TI_Verde`):** promover a página da oficina para a raiz de `c:\Projetos\TI_Verde`, validar localmente (checks estáticos + navegador desktop/mobile 360px e 390px), enviar para `origin/main` e executar **Gate 2:** confirmar `HTTP 200` em `/TI_Verde/`, `/TI_Verde/ti-verde/`, `og-ti-verde.jpg`, navegação na mesma aba ida e volta com o Hub e redirecionamento de hashes legados.
  4. **Passo 3 (QR Codes offline):** gerar os 6 arquivos SVG/PNG somente após os Gates 1 e 2 passarem, e validar por decodificação automatizada + leitura real em câmera de celular.
* **Procedimento de Rollback:**
  * Para `TI_Verde`: `git revert <commit_v2>` ou restauração do commit live anterior `d4418ea` na `main` (redeploy automático do GitHub Pages em ~1–2 min).
  * Para `Projetos_Subsequente_2026`: `git revert` do commit problemático na `main` (ou correção pontual direta sem alterar as URLs canônicas já congeladas).
  * Recuperação do protótipo unificado pré-split (se necessário para consulta): disponível localmente no branch `backup/pre-split-6-rotas` em `c:\Projetos\TI_Verde`.

### Additional Resources

* Cartaz oficial final do Circuito Integrador 2026 e artes oficiais das turmas (*Raízes do Norte*, *Condomínio/uCondo*, *Capa do TCC de Transações Imobiliárias*, *Emblema T.I Verde* e 15 fotografias autorizadas da oficina da EETEPA Vilhena Alves).
* Dados externos verificados citados em `TI_Verde`: **ADEME / Fraunhofer IZM** (~78% de emissões concentradas na fabricação de computadores); **ONU — ITU / UNITAR, Global E-waste Monitor 2024** (~3% de reciclagem formal no Brasil; 22,3% global); **Lei nº 12.305/2010 (PNRS)** e **Decreto nº 10.240/2020**; localizadores gratuitos **Green Eletron** e **ABREE**.
* Especificação ISO/IEC 18004 (capacidade de bytes por versão de QR Code e nível de correção de erro `Q`).

--------------------------------------------------------------------------------

## Detailed Implementation Plan

### Ordem Obrigatória de Execução (Rollout Zero-Downtime)

1. **Passo 0 — Snapshot local de proteção em `c:\Projetos\TI_Verde`:**
   * Criar e commitar um snapshot local do trabalho atual não commitado (protótipo de 6 rotas + mídia otimizada) em um branch estritamente local `backup/pre-split-6-rotas` (sem `git push`), e retornar ao branch `main` no commit live `d4418ea`.
2. **Passo 1 — Construção, validação local e publicação do Hub (`albertomateus9/Projetos_Subsequente_2026`):**
   * Clonar `https://github.com/albertomateus9/Projetos_Subsequente_2026` em `c:\Projetos\Projetos_Subsequente_2026`.
   * Criar/editar todos os arquivos listados na seção *Repositório 1* abaixo a partir dos ativos do snapshot local `backup/pre-split-6-rotas`, executando as reescritas de URLs canônicas, Open Graph, links cross-repo e `404.html`.
   * Validar localmente (`node --check`, auditoria estática e navegador 1440px / 390px / 360px), fazer commit e `git push origin main`, ativar GitHub Pages (`branch: main`, `path: /`) via `gh api` e atualizar descrição/homepage do repositório via `gh repo edit`.
   * **Gate 1 (bloqueante para o Passo 2):** aguardar deploy `built` e confirmar `HTTP 200` em todas as 5 rotas do Hub, no stub `/ti-verde/` e nos 5 arquivos `og-*.jpg` publicados.
3. **Passo 2 — Promoção da oficina para a raiz e limpeza de `albertomateus9/TI_Verde`:**
   * Com o Hub já respondendo `HTTP 200`, aplicar na `main` de `c:\Projetos\TI_Verde` todas as criações, modificações e remoções listadas na seção *Repositório 2* abaixo.
   * Validar localmente (`node --check`, auditoria estática de ambos os repositórios e navegador 1440px / 390px / 360px + escala 150% + alto contraste), fazer commit, `git push origin main` e atualizar a descrição do repositório via `gh repo edit`.
   * **Gate 2 (bloqueante para o Passo 3):** confirmar deploy `built`, `HTTP 200` em `/TI_Verde/`, `/TI_Verde/ti-verde/` e `og-ti-verde.jpg`, navegação na mesma aba ida e volta entre os dois repositórios, persistência de `localStorage` (`tiverde-font`/`tiverde-contrast`) e tradução de hashes legados da v1.
4. **Passo 3 — Geração offline e validação dos 6 QR Codes:**
   * Executar `scratch/generate_qrs.py` gerando SVG vetorial e PNG em alta resolução (`1200×1200 px`, modo Byte, ECC `Q`, margem silenciosa de 4 módulos, `#000000` sobre `#FFFFFF`, sem logo) para as 6 URLs canônicas, decodificar programaticamente cada imagem confirmando correspondência exata byte a byte e testar leitura em câmera de smartphone + cartão de prévia no WhatsApp antes do envio à gráfica.

---

### Target Files to Create, Modify, or Delete

#### Repositório 1: `c:\Projetos\Projetos_Subsequente_2026` (Hub Principal — Circuito Integrador 2026)

1. **`.nojekyll` (`Create`)**
   * **Escopo:** Configuração GitHub Pages.
   * **Alterações propostas:** Arquivo vazio na raiz para impedir processamento Jekyll e preservar nomes/pastas exatamente como publicados.
2. **`favicon.svg` (`Create`)**
   * **Escopo:** Ícone institucional vetorial.
   * **Alterações propostas:** Copiar do snapshot `backup/pre-split-6-rotas` (`favicon.svg`, 645 B) para uso em todas as rotas do Hub via caminho relativo (`./favicon.svg` ou `../favicon.svg`).
3. **`css/tokens.css` (`Create`)**
   * **Escopo:** Design tokens compartilhados (WCAG 2.2 AA+ e Alto Contraste AAA).
   * **Alterações propostas:** Copiar `css/tokens.css` do snapshot mantendo pilha tipográfica nativa do sistema, paleta neutra + acentos dos cursos e modo `body.alto-contraste`.
4. **`css/site.css` (`Create`)**
   * **Escopo:** Folha de estilos mobile-first compartilhada.
   * **Alterações propostas:** Copiar `css/site.css` do snapshot (barra `.a11y-bar` não-sticky, cabeçalho sticky `<= 56px` sem overflow em 360px, grade de cursos, destaque `.spotlight`, `<dialog class="media-lightbox">` e alvos `>= 44×44 px`).
5. **`js/shared.js` (`Create`)**
   * **Escopo:** Script compartilhado (~4,6 KB não comprimido).
   * **Alterações propostas:** Copiar `js/shared.js` do snapshot, preservando exatamente as chaves `tiverde-font` e `tiverde-contrast` no `localStorage` (compartilhado pela origem `https://albertomateus9.github.io` com `TI_Verde`), o menu móvel acessível (`nav-ready`, tecla `Escape`) e o lightbox único sob demanda (`[data-full]` / `[data-full2]`).
6. **`index.html` (`Create`)**
   * **Escopo:** Página inicial do Circuito Integrador 2026.
   * **Alterações propostas:** Basear no `index.html` do snapshot aplicando cinco mudanças obrigatórias:
     * Atualizar `link[rel="canonical"]` e `og:url` para `https://albertomateus9.github.io/Projetos_Subsequente_2026/`.
     * Atualizar `og:image` para `https://albertomateus9.github.io/Projetos_Subsequente_2026/assets/images/og/og-circuito.jpg`.
     * Remover o mapa de redirecionamento de hashes da v1 (`#panorama`, `#triagem`, etc.) do `<script>` inline no `<head>`, mantendo apenas a restauração pré-pintura de `tiverde-font` e `tiverde-contrast`.
     * Reescrever os 6 links internos de Informática (`.nav__links`, `.quick-courses`, dois botões do `.spotlight`, `.course-card#informatica` e `.footer__links`) de `./ti-verde/` para `https://albertomateus9.github.io/TI_Verde/` (e `./ti-verde/#oficina` para `https://albertomateus9.github.io/TI_Verde/#oficina`), todos na mesma aba (sem `target="_blank"`).
     * Atualizar a versão de cache dos links CSS/JS para `?v=20261125`.
7. **`adm/index.html` (`Create`)**
   * **Escopo:** Página do Curso Técnico de Administração (*Raízes do Norte*).
   * **Alterações propostas:** Copiar `adm/index.html` do snapshot, atualizar `canonical`/`og:url` para `.../Projetos_Subsequente_2026/adm/`, atualizar `og:image` para `.../Projetos_Subsequente_2026/assets/images/og/og-adm.jpg`, reescrever os 3 links `../ti-verde/` (cabeçalho, banner cruzado e rodapé) para `https://albertomateus9.github.io/TI_Verde/` na mesma aba e atualizar `?v=20261125`.
8. **`condominio/index.html` (`Create`)**
   * **Escopo:** Página do Curso Técnico em Condomínio (*uCondo*).
   * **Alterações propostas:** Copiar `condominio/index.html` do snapshot, atualizar `canonical`/`og:url` para `.../Projetos_Subsequente_2026/condominio/`, `og:image` para `.../Projetos_Subsequente_2026/assets/images/og/og-condominio.jpg`, reescrever os 3 links `../ti-verde/` para `https://albertomateus9.github.io/TI_Verde/` na mesma aba e atualizar `?v=20261125`.
9. **`imobiliarias/index.html` (`Create`)**
   * **Escopo:** Página do Curso Técnico em Transações Imobiliárias (*TCC MCMV 2026*).
   * **Alterações propostas:** Copiar `imobiliarias/index.html` do snapshot, atualizar `canonical`/`og:url` para `.../Projetos_Subsequente_2026/imobiliarias/`, `og:image` para `.../Projetos_Subsequente_2026/assets/images/og/og-imobiliarias.jpg`, reescrever os 3 links `../ti-verde/` para `https://albertomateus9.github.io/TI_Verde/` na mesma aba e atualizar `?v=20261125`.
10. **`eventos/index.html` (`Create`)**
    * **Escopo:** Página do Curso Técnico em Eventos (*Organização do Circuito*).
    * **Alterações propostas:** Copiar `eventos/index.html` do snapshot, atualizar `canonical`/`og:url` para `.../Projetos_Subsequente_2026/eventos/`, `og:image` para `.../Projetos_Subsequente_2026/assets/images/og/og-eventos.jpg`, reescrever os 3 links `../ti-verde/` para `https://albertomateus9.github.io/TI_Verde/` na mesma aba e atualizar `?v=20261125`.
11. **`ti-verde/index.html` (`Create`)**
    * **Escopo:** Stub defensivo HTTP 200 no Hub para redirecionar acessos manuais em `/Projetos_Subsequente_2026/ti-verde/`.
    * **Alterações propostas:** Documento HTML mínimo (100% inline, sem `<meta http-equiv="refresh">`) com `canonical`/`og:url` para `https://albertomateus9.github.io/TI_Verde/` e `og:image` para `.../TI_Verde/assets/images/og/og-ti-verde.jpg`. Pseudocódigo do script no `<head>`:
      ```text
      target = "https://albertomateus9.github.io/TI_Verde/" + (location.hash || "")
      location.replace(target)
      ```
      Corpo visível em português com botão direto `Abrir projeto T.I Verde →` (`>= 46 px`) e link de retorno `../` caso JavaScript esteja desativado.
12. **`404.html` (`Create`)**
    * **Escopo:** Recuperação de erro de digitação/caixa 100% inline (sem CSS/JS externos).
    * **Alterações propostas:** Adaptar `404.html` do snapshot substituindo o offset fixo `idx + 10` por `base.length`. Contrato de resolução:
      ```text
      base = "/Projetos_Subsequente_2026/"
      tiBase = "https://albertomateus9.github.io/TI_Verde/"
      slug = normalizar(path após base, removendo index.html, .html e barras finais)
      se slug em {adm, administracao, raizes-do-norte, condominio, ucondo, imobiliarias, imobiliaria, transacoes-imobiliarias, mcmv, eventos}:
          location.replace(base + rotaLocal[slug] + location.hash)
      senão se slug em {ti-verde, tiverde, ti, informatica}:
          location.replace(tiBase + location.hash)
      ```
      Lista de fallback em português com 6 links clicáveis (`>= 46 px`) apontando para `/Projetos_Subsequente_2026/{,adm/,condominio/,imobiliarias/,eventos/}` e `https://albertomateus9.github.io/TI_Verde/`.
13. **`assets/images/` — 15 arquivos de mídia otimizada sem EXIF (`Create`)**
    * **Escopo:** Imagens exclusivas do Hub e dos 4 cursos (excluindo `circuito-integrador-2026.jpg`, `hero-oficina-960/1200.webp`, `etapa-0*` e `og-ti-verde.jpg` para manter zero arquivos órfãos):
      * `assets/images/circuito-integrador-2026-640.webp` e `circuito-integrador-2026-1024.webp` (cartaz oficial final Tier 1/2).
      * `assets/images/cursos/ti-verde-logo-320.webp` (emblema no card de destaque da home).
      * `assets/images/cursos/adm-cartaz-640.webp` e `adm-cartaz-1200.webp`.
      * `assets/images/cursos/condominio-cartaz-640.webp` e `condominio-cartaz-1200.webp`.
      * `assets/images/cursos/imobiliarias-tcc-640.webp` e `imobiliarias-tcc-1200.webp`.
      * `assets/images/oficina/hero-oficina-640.webp` (miniatura única usada no card `.spotlight` da home).
      * `assets/images/og/og-circuito.jpg`, `og-adm.jpg`, `og-condominio.jpg`, `og-imobiliarias.jpg`, `og-eventos.jpg` (5 cartões Open Graph `1200×630` JPEG, `< 115 KB`).
14. **`README.md` (`Modify`)**
    * **Escopo:** Documentação pública do repositório principal do evento.
    * **Alterações propostas:** Substituir o stub inicial do repositório pela apresentação do Circuito Integrador 2026, tabela definitiva das 6 URLs canônicas dos QR Codes (5 rotas no Hub + `TI_Verde` na raiz), diretrizes de geração offline/impressão dos banners, imagem embutida `assets/images/circuito-integrador-2026-640.webp` e comando de prévia local.

---

#### Repositório 2: `c:\Projetos\TI_Verde` (Site Autônomo — Curso Técnico em Informática)

*(Inalterados na raiz: `.nojekyll`, `favicon.svg` já presentes em `HEAD d4418ea` e `docs/designs/circuito_integrador_2026_two_repos.md`.)*

1. **`index.html` (`Modify`)**
   * **Escopo:** Página principal da oficina T.I Verde promovida da subpasta `ti-verde/` para a raiz do repositório.
   * **Alterações propostas:** Basear no `ti-verde/index.html` do snapshot aplicando cinco transformações obrigatórias:
     * Atualizar `canonical` e `og:url` para `https://albertomateus9.github.io/TI_Verde/` e manter `og:image` em `https://albertomateus9.github.io/TI_Verde/assets/images/og/og-ti-verde.jpg`.
     * Adicionar no `<script>` inline do `<head>` (antes da restauração de `tiverde-font`/`tiverde-contrast`) o tradutor local de hashes da v1:
       ```text
       hashMap = {
         "#panorama": "#dados",
         "#legislacao": "#descarte",
         "#agir": "#descarte",
         "#simulador": "#oficina",
         "#datacenter": "#dados",
         "#desafio": "#triagem"
       }
       se hashMap[location.hash] existir: location.replace(hashMap[location.hash])
       ```
     * Converter todos os **19 caminhos locais de ativos** de `../` para `./`: `favicon.svg` (×2), `css/tokens.css`, `css/site.css`, `assets/images/oficina/hero-oficina-960.webp`, 4× `etapa-0{1..4}-a-640.webp`, 8× `etapa-0{1..4}-{a,b}-1200.webp`, `js/shared.js` e `js/triage.js` (atualizando query string para `?v=20261125`).
     * Reescrever os **8 links de retorno ao Hub** de `../...` para URLs HTTPS absolutas na mesma aba (sem `target="_blank"`): botão `.nav__back` (`← Circuito 2026` → `.../Projetos_Subsequente_2026/`), link `5 Cursos` no menu (`.../Projetos_Subsequente_2026/#cursos`), botão `.cross-banner` (`← Voltar ao portal do Circuito` → `.../Projetos_Subsequente_2026/`), os 4 links `.sibling-links` (`/adm/`, `/condominio/`, `/imobiliarias/`, `/eventos/`) e o link `Portal Circuito 2026` no rodapé.
     * Preservar o link do código-fonte no rodapé (`https://github.com/albertomateus9/TI_Verde`) e os 4 links externos de referência (`greeneletron.org.br`, `abree.org.br`, `planalto.gov.br`, `ewastemonitor.info`) com `target="_blank" rel="noopener noreferrer"`.
2. **`ti-verde/index.html` (`Create` em relação ao `HEAD d4418ea` / `Modify` em relação ao snapshot)**
   * **Escopo:** Stub defensivo HTTP 200 para compatibilidade caso `/TI_Verde/ti-verde/` tenha circulado em testes.
   * **Alterações propostas:** Substituir o HTML completo por stub mínimo 100% inline (sem `<meta http-equiv="refresh">`) com `canonical`/`og:url` apontando para `https://albertomateus9.github.io/TI_Verde/`, script `location.replace('../' + (location.hash || ''))` e link manual `../` em português.
3. **`404.html` (`Create`)**
   * **Escopo:** Recuperação de caminhos incorretos e ponte cross-repo 100% inline (sem CSS/JS externos).
   * **Alterações propostas:** Usar `base = '/TI_Verde/'`, `hubBase = 'https://albertomateus9.github.io/Projetos_Subsequente_2026/'` e `path.slice(idx + base.length)`. Aliases de Informática (`ti-verde`, `tiverde`, `ti`, `informatica`) redirecionam para `base + location.hash`; aliases dos outros 4 cursos (`adm`, `administracao`, `raizes-do-norte`, `condominio`, `ucondo`, `imobiliarias`, `imobiliaria`, `transacoes-imobiliarias`, `mcmv`, `eventos`) redirecionam para `hubBase + rotaHub[slug] + location.hash`. Fallback visual em português com 6 botões (`>= 46 px`), sendo o primário `Projeto T.I Verde (Oficina) → /TI_Verde/` seguido do Hub e dos outros 4 cursos em `Projetos_Subsequente_2026`.
4. **`css/tokens.css` (`Modify`)**
   * **Escopo:** Substituir tokens da v1 pelos tokens v2 mobile-first do snapshot (sem fontes externas, com Alto Contraste AAA).
5. **`css/site.css` (`Create`)**
   * **Escopo:** Nova folha única mobile-first (substituindo `css/style.css` e `css/interactive.css`).
6. **`js/shared.js` (`Create`)**
   * **Escopo:** Script compartilhado (~4,6 KB) para acessibilidade same-origin (`tiverde-font`/`tiverde-contrast`), menu móvel e lightbox `<dialog>` sob demanda.
7. **`js/triage.js` (`Create`)**
   * **Escopo:** Script exclusivo de `TI_Verde` (~2,6 KB) para Triagem na bancada (6 cards) e sincronização do trilho das 4 etapas (`IntersectionObserver`), ajustando apenas o comentário inicial da linha 1 para refletir a raiz de `TI_Verde`.
8. **`assets/images/` — 14 arquivos exclusivos da oficina e OG sem EXIF (`Create`)**
   * **Escopo:** Apenas as imagens efetivamente referenciadas pela raiz de `TI_Verde` (excluindo `hero-oficina-640.webp` e `hero-oficina-1200.webp` não referenciados aqui):
     * `assets/images/oficina/hero-oficina-960.webp` (Tier 1 LCP, 85,8 KB).
     * `assets/images/oficina/etapa-01-a-640.webp`, `etapa-01-a-1200.webp`, `etapa-01-b-1200.webp`.
     * `assets/images/oficina/etapa-02-a-640.webp`, `etapa-02-a-1200.webp`, `etapa-02-b-1200.webp`.
     * `assets/images/oficina/etapa-03-a-640.webp`, `etapa-03-a-1200.webp`, `etapa-03-b-1200.webp`.
     * `assets/images/oficina/etapa-04-a-640.webp`, `etapa-04-a-1200.webp`, `etapa-04-b-1200.webp`.
     * `assets/images/og/og-ti-verde.jpg` (JPEG `1200×630`, 131 KB).
9. **`README.md` (`Modify`)**
   * **Escopo:** Documentação pública do repositório `TI_Verde`.
   * **Alterações propostas:** Focar exclusivamente na produção da turma de Informática (4 etapas reais da oficina, 3 dados verificados, Triagem na bancada e descarte gratuito/PNRS), exibir miniatura `assets/images/oficina/hero-oficina-960.webp` (no lugar da imagem deletada do cartaz geral) e incluir link direto para o portal completo em `https://albertomateus9.github.io/Projetos_Subsequente_2026/`.
10. **Remoções em `c:\Projetos\TI_Verde` (`Delete`)**
    * **Arquivos versionados na v1 (`HEAD d4418ea`) a remover via `git rm`:**
      * `css/style.css` e `css/interactive.css` (substituídos por `css/site.css`).
      * `js/game.js`, `js/viz.js` e `js/script.js` (recursos de apresentação oral, Canvas e gamificação de quiosque fora de escopo).
      * `assets/images/circuito-integrador-2026.jpg` (cartaz geral movido em WebP otimizado para `Projetos_Subsequente_2026`).
    * **Pastas/arquivos temporários do protótipo pré-split (não presentes em `HEAD`, mantidos no branch local `backup/pre-split-6-rotas`) a excluir da working tree de `main`:**
      * `adm/`, `condominio/`, `imobiliarias/`, `eventos/`.
      * `assets/images/circuito-integrador-2026-640.webp`, `assets/images/circuito-integrador-2026-1024.webp`.
      * `assets/images/cursos/` (todos os 7 arquivos).
      * `assets/images/oficina/hero-oficina-640.webp` e `assets/images/oficina/hero-oficina-1200.webp`.
      * `assets/images/og/og-circuito.jpg`, `og-adm.jpg`, `og-condominio.jpg`, `og-imobiliarias.jpg`, `og-eventos.jpg`.

---

#### Scripts Auxiliares em `scratch/` (Fora dos Repositórios Públicos)

1. **`scratch/verify_two_repos.py` (`Create`)**
   * **Escopo:** Verificador estático automatizado para os dois repositórios simultaneamente (evoluindo `scratch/verify_v2.py`).
   * **Alterações propostas:** Validar nos dois repositórios: ausência de caminhos root-relative (`/`) em `href`/`src`/`data-full`/`data-full2`; existência com caixa exata de todos os arquivos referenciados; **zero ativos órfãos** (todo arquivo em `assets/images/` deve estar referenciado por pelo menos uma página ou `og:image` daquele repositório); zero `target="_blank"` em links entre `Projetos_Subsequente_2026` e `TI_Verde`; `canonical`/`og:url`/`og:image` coerentes com o repositório dono e `og:image < 300 KB`; zero metadados EXIF/GPS em todas as imagens raster; exatamente 1 `<h1>` sem salto de nível; zero `<img src="...">` preenchido em `<dialog>`; e `404.html` 100% inline usando `base.length` (sem offset numérico fixo).
2. **`scratch/generate_qrs.py` (`Create`)**
   * **Escopo:** Gerador e validador offline dos 6 QR Codes finais para impressão nos banners.
   * **Alterações propostas:** Gerar em `scratch/qrcodes/` pares `.svg` + `.png` (`1200×1200 px`, modo Byte, ECC `Q`, `border=4`, `#000000` sobre `#FFFFFF`, sem logo) para cada uma das 6 URLs canônicas, emitir tabela de versão QR e dimensão de módulo em 8 cm / 12 cm, e decodificar automaticamente todos os 6 PNGs verificando igualdade literal (`decoded == canonical_url`).

---

### Verification Plan

* **1. Sintaxe e Validação Estática Local (antes de cada commit):**
  * `node --check` em `js/shared.js` (ambos os repositórios) e `js/triage.js` (`TI_Verde`).
  * `python scratch/verify_two_repos.py` retornando código de saída `0` (`ALL_TWO_REPO_CHECKS_PASSED`): 0 links quebrados ou com caixa divergente, 0 paths root-relative, 0 arquivos órfãos em `assets/images/`, 0 EXIF/GPS, 0 `target="_blank"` interno, 0 `<img src>` eager em `<dialog>`, todos os 6 `og-*.jpg` `< 300 KB`.
* **2. Auditoria em Navegador Local (Desktop + Mobile + Acessibilidade):**
  * Subir servidor HTTP local sobre cada repositório e inspecionar via navegador real em `1440×900`, `390×844` e `360×800`:
    * `0` erros no console e `0` requisições com falha (`>= 400`).
    * `document.documentElement.scrollWidth <= window.innerWidth` em todas as 6 páginas, inclusive após aumentar fonte até `150%` (`body.texto-grande`) e ativar `Alto contraste`.
    * No carregamento inicial de `TI_Verde/`, nenhuma imagem `*-1200.webp` requisitada na aba de rede (`0 KB` Tier 2); ao tocar em uma etapa da oficina, `<dialog>` abre, carrega `etapa-0X-a-1200.webp`, alterna para `Foto 2` (`etapa-0X-b-1200.webp`) e fecha por botão e por `Escape`.
    * Na Triagem na bancada, testar resposta errada + acerto nos 6 itens confirmando classes visuais e texto `6 de 6 itens encaminhados corretamente — Triagem concluída!` no elemento `aria-live="polite"`.
    * Testar abertura sem JS ou inspeção de fallback garantindo visibilidade das respostas da Triagem e do menu.
* **3. Gates de Produção no GitHub Pages (Gate 1 após Passo 1; Gate 2 após Passo 2):**
  * Verificar status `built` na API de Pages de ambos os repositórios.
  * Confirmar `HTTP 200` via requisição real nas 6 URLs canônicas, nos 2 stubs `/ti-verde/` e nos 6 arquivos `og-*.jpg` (conferindo `Content-Type: image/jpeg` e tamanho `< 300 KB`).
  * Validar no navegador em produção: clique no Hub → `TI_Verde/` abre na mesma aba mantendo `tiverde-font`/`tiverde-contrast` gravados no `localStorage`; clique em `← Circuito 2026` retorna ao Hub na mesma aba; acesso a `/TI_Verde/#panorama` pousa em `#dados`; acesso a `/Projetos_Subsequente_2026/Raizes-Do-Norte` redireciona via `404.html` para `/Projetos_Subsequente_2026/adm/`; acesso a `/TI_Verde/adm` redireciona via `404.html` para `/Projetos_Subsequente_2026/adm/`.
* **4. Validação Real no WhatsApp:**
  * Enviar cada uma das 6 URLs canônicas em mensagem privada no WhatsApp e confirmar cartão de pré-visualização distinto por rota (título, descrição e imagem `1200×630` carregados sem redirecionamento de terceiro).
* **5. Validação Offline e Física dos 6 QR Codes:**
  * Decodificação automatizada em `scratch/generate_qrs.py` retornando `6/6 MATCH` contra as URLs canônicas literais.
  * Leitura real com câmera nativa (Android e iOS) sobre os 6 códigos gerados e conferência final na arte da gráfica confirmando margem branca intacta (4 módulos), ausência de logo central e dimensão mínima `>= 8×8 cm` em acabamento fosco.

--------------------------------------------------------------------------------

*Drafted with EGM*
