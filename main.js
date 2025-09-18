// // ===== Qualitative section scene switcher (NAFSR / Restormer / GT) =====
// (function () {
//   function initQualSceneSwitcher(options) {
//     const cfg = Object.assign({
//       rootSelector: '#qual-section',     // scope to a section
//       selectorId: 'qual-scene-selector', // where scene buttons go
//       base: 'assets/results-comparison',
//       folderSuffix: '_sr',               // <-- NEW: '_sr' or '_full'
//       scenes: [],
//       files: { nafBase:'naf_rgb.png', nafTop:'full_naf_rgb.png',
//                resBase:'restormer_rgb.png', resTop:'full_restormer_rgb.png', gt:'gt_rgb.png' },
//       imgIds: {                          // <-- NEW: per-block image IDs
//         nafBase: '#naf-base', nafTop: '#naf-top',
//         resBase: '#res-base', resTop: '#res-top',
//         gt: '#gt-img'
//       },
//       labels: {                          // <-- NEW: a11y alt base text
//         nafBase: 'NAFSR baseline',
//         nafTop:  'NAFSR + Ours',
//         resBase: 'Restormer baseline',
//         resTop:  'Restormer + Ours',
//         gt:      'Ground Truth'
//       },
//       deepLink: true,
//       deepLinkKey: 'qualScene'
//     }, options || {});

//     const root = document.querySelector(cfg.rootSelector) || document;
//     const selector = root.querySelector('#' + cfg.selectorId);

//     // scoped image elements
//     const imgNafBase = root.querySelector(cfg.imgIds.nafBase);
//     const imgNafTop  = root.querySelector(cfg.imgIds.nafTop);
//     const imgResBase = root.querySelector(cfg.imgIds.resBase);
//     const imgResTop  = root.querySelector(cfg.imgIds.resTop);
//     const imgGT      = root.querySelector(cfg.imgIds.gt);
//     if (!selector || !imgNafBase || !imgNafTop || !imgResBase || !imgResTop || !imgGT) return;

//     function path(sceneId, file) {
//       return `${cfg.base}/${sceneId}${cfg.folderSuffix}/${file}`;
//     }

//     function setScene(sceneId) {
//       imgNafBase.src = path(sceneId, cfg.files.nafBase);
//       imgNafTop.src  = path(sceneId, cfg.files.nafTop);
//       imgResBase.src = path(sceneId, cfg.files.resBase);
//       imgResTop.src  = path(sceneId, cfg.files.resTop);
//       imgGT.src      = path(sceneId, cfg.files.gt);

//       const tag = sceneId.toUpperCase();
//       imgNafBase.alt = `${cfg.labels.nafBase} — ${tag}`;
//       imgNafTop.alt  = `${cfg.labels.nafTop} — ${tag}`;
//       imgResBase.alt = `${cfg.labels.resBase} — ${tag}`;
//       imgResTop.alt  = `${cfg.labels.resTop} — ${tag}`;
//       imgGT.alt      = `${cfg.labels.gt} — ${tag}`;

//       selector.querySelectorAll('button[data-scene]').forEach(b => {
//         const active = b.dataset.scene === sceneId;
//         b.classList.toggle('is-link', active);
//         b.classList.toggle('is-light', !active);
//         b.setAttribute('aria-pressed', String(active));
//       });

//       if (cfg.deepLink) {
//         const params = new URLSearchParams(location.search);
//         params.set(cfg.deepLinkKey, sceneId);
//         history.replaceState(null, '', `?${params.toString()}`);
//       }
//     }

//     function buildSelector() {
//       selector.innerHTML = '';
//       cfg.scenes.forEach(sc => {
//         const btn = document.createElement('button');
//         btn.type = 'button';
//         btn.className = 'button is-small is-light';
//         btn.dataset.scene = sc.id;
//         btn.style.margin = '0.25rem';
//         btn.style.padding = '0';
//         btn.style.borderRadius = '5%';
//         btn.style.overflow = 'hidden';
//         btn.style.width = '120px';
//         btn.style.height = '70px';
//         btn.style.display = 'inline-block';

//         const thumb = new Image();
//         thumb.src = path(sc.id, cfg.files.gt);
//         thumb.alt = sc.label;
//         thumb.style.width = '100%';
//         thumb.style.height = '100%';
//         thumb.style.objectFit = 'cover';
//         thumb.style.borderRadius = '5%';

//         btn.appendChild(thumb);
//         btn.addEventListener('click', () => setScene(sc.id));
//         selector.appendChild(btn);
//       });
//     }

//     buildSelector();

//     let initial = cfg.scenes[0]?.id;
//     if (cfg.deepLink) {
//       const q = new URLSearchParams(location.search).get(cfg.deepLinkKey);
//       if (q && cfg.scenes.some(s => s.id === q)) initial = q;
//     }
//     setScene(initial);

//     return { setScene, config: cfg };
//   }

//   window.initQualSceneSwitcher = initQualSceneSwitcher;
// })();


// // ===================== Dataset Viewer =====================
// (function () {
//   function pad(n, width=2) { return String(n).padStart(width, '0'); }

//   /**
//    * Initialize dataset viewer (scene selector + two carousels + four statics).
//    * @param {Object} opts - see defaults below and override to match your paths.
//    */
//   function initDatasetViewer(opts) {
//     const cfg = Object.assign({
//       rootSelector: '#dataset-viewer',
//       selectorId: 'ds-scene-selector',
//       base: 'assets/dataset',    // folder containing scene subfolders
//       scenes: [                  // 5 scenes (update to match your folders)
//         { id: 's1', label: 'Scene 1' },
//         { id: 's2', label: 'Scene 2' },
//         { id: 's3', label: 'Scene 3' },
//         { id: 's4', label: 'Scene 4' },
//         { id: 's5', label: 'Scene 5' },
//       ],
//       files: {
//         // patterns (replace {ch})
// 			msChannelPattern:  'ms_channel_{ch}.webp',
// 			msMosaic:          'ms_mosaic.webp',
// 			msSRGB:            'ms_view1_srgb.webp',
// 			rgbChannelPattern: 'rgb_view2_channel_{ch}.webp',
// 			rgbMosaic:         'rgb_view2_mosaic.webp',
// 			rgbSRGB:           'rgb_view2_srgb.webp',
// 			thumb:             'ms_view1_srgb.webp'
//       },
//       msCount: 16,
//       rgbCount: 3,
//       // autoplay speeds (ms)
//       msInterval: 1800,
//       rgbInterval: 1800
//     }, opts || {});

//     const root = document.querySelector(cfg.rootSelector);
//     if (!root) return;

//     const selector = root.querySelector('#' + cfg.selectorId);
//     const el = {
//       msImg:   root.querySelector('#ds-ms-channel'),
//       msMos:   root.querySelector('#ds-ms-mosaic'),
//       msSRGB:  root.querySelector('#ds-ms-srgb'),
//       rgbImg:  root.querySelector('#ds-rgb-channel'),
//       rgbMos:  root.querySelector('#ds-rgb-mosaic'),
//       rgbSRGB: root.querySelector('#ds-rgb-srgb'),
//       msIdx:   root.querySelector('#ds-ms-indicator'),
//       rgbIdx:  root.querySelector('#ds-rgb-indicator'),
//     };
//     const btn = {
//       msPrev:  root.querySelector('#ds-ms-prev'),
//       msPlay:  root.querySelector('#ds-ms-play'),
//       msPause: root.querySelector('#ds-ms-pause'),
//       msNext:  root.querySelector('#ds-ms-next'),
//       rgbPrev:  root.querySelector('#ds-rgb-prev'),
//       rgbPlay:  root.querySelector('#ds-rgb-play'),
//       rgbPause: root.querySelector('#ds-rgb-pause'),
//       rgbNext:  root.querySelector('#ds-rgb-next'),
//     };

//     let state = {
//       scene: cfg.scenes[0].id,
//       msIdx: 1,
//       rgbIdx: 1,
//       msTimer: null,
//       rgbTimer: null
//     };

//     function path(sceneId, file) {
//       return `${cfg.base}/${sceneId}/${file}`;
//     }
//     function pathMs(sceneId, ch) {
// 	  const idx0 = ch - 1;                 // 1..16  ->  0..15
//       return path(sceneId, cfg.files.msChannelPattern.replace('{ch}', pad(idx0, 2)));
//     }
//     function pathRgb(sceneId, ch) {
//       const idx0 = ch - 1;                 // 1..3  ->  0..2
//   	  return path(sceneId, cfg.files.msChannelPattern.replace('{ch}', pad(idx0, 2)));
//     }

//     function setScene(sceneId) {
//       state.scene = sceneId;
//       state.msIdx = 1; state.rgbIdx = 1;
//       // statics
//       el.msMos.src   = path(sceneId, cfg.files.msMosaic);
//       el.msSRGB.src  = path(sceneId, cfg.files.msSRGB);
//       el.rgbMos.src  = path(sceneId, cfg.files.rgbMosaic);
//       el.rgbSRGB.src = path(sceneId, cfg.files.rgbSRGB);
//       // channels
//       el.msImg.src   = pathMs(sceneId, state.msIdx);
//       el.rgbImg.src  = pathRgb(sceneId, state.rgbIdx);
//       updateIndicators();
//       highlightActive();
//     }

//     function updateIndicators() {
//       if (el.msIdx)  el.msIdx.textContent  = `${state.msIdx} / ${cfg.msCount}`;
//       if (el.rgbIdx) el.rgbIdx.textContent = `${state.rgbIdx} / ${cfg.rgbCount}`;
//     }

//     function highlightActive() {
//       selector?.querySelectorAll('button[data-scene]').forEach(b => {
//         const active = b.dataset.scene === state.scene;
//         b.classList.toggle('is-link', active);
//         b.classList.toggle('is-light', !active);
//         b.setAttribute('aria-pressed', String(active));
//       });
//     }

//     function msStep(dir) {
//       state.msIdx += dir;
//       if (state.msIdx < 1) state.msIdx = cfg.msCount;
//       if (state.msIdx > cfg.msCount) state.msIdx = 1;
//       el.msImg.src = pathMs(state.scene, state.msIdx);
//       updateIndicators();
//     }
//     function rgbStep(dir) {
//       state.rgbIdx += dir;
//       if (state.rgbIdx < 1) state.rgbIdx = cfg.rgbCount;
//       if (state.rgbIdx > cfg.rgbCount) state.rgbIdx = 1;
//       el.rgbImg.src = pathRgb(state.scene, state.rgbIdx);
//       updateIndicators();
//     }

//     function msPlay() { msPause(); state.msTimer = setInterval(() => msStep(+1), cfg.msInterval); }
//     function msPause() { if (state.msTimer) clearInterval(state.msTimer); state.msTimer = null; }
//     function rgbPlay() { rgbPause(); state.rgbTimer = setInterval(() => rgbStep(+1), cfg.rgbInterval); }
//     function rgbPause() { if (state.rgbTimer) clearInterval(state.rgbTimer); state.rgbTimer = null; }

//     function buildSelector() {
//       if (!selector) return;
//       selector.innerHTML = '';
//       cfg.scenes.forEach(sc => {
//         const btnEl = document.createElement('button');
//         btnEl.type = 'button';
//         btnEl.className = 'button is-small is-light';
//         btnEl.dataset.scene = sc.id;
//         // small rectangular thumb (cropped)
//         btnEl.style.margin = '.25rem'; btnEl.style.padding = '0';
//         btnEl.style.borderRadius = '5%'; btnEl.style.overflow = 'hidden';
//         btnEl.style.width = '120px'; btnEl.style.height = '70px';

//         const img = new Image();
//         img.src = path(sc.id, cfg.files.thumb);
//         img.alt = sc.label; img.loading = 'lazy';
//         img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover';
//         img.style.borderRadius = '5%';

//         btnEl.appendChild(img);
//         btnEl.addEventListener('click', () => setScene(sc.id));
//         selector.appendChild(btnEl);
//       });
//     }

//     // wire controls
//     btn.msPrev?.addEventListener('click', () => msStep(-1));
//     btn.msNext?.addEventListener('click', () => msStep(+1));
//     btn.msPlay?.addEventListener('click', msPlay);
//     btn.msPause?.addEventListener('click', msPause);

//     btn.rgbPrev?.addEventListener('click', () => rgbStep(-1));
//     btn.rgbNext?.addEventListener('click', () => rgbStep(+1));
//     btn.rgbPlay?.addEventListener('click', rgbPlay);
//     btn.rgbPause?.addEventListener('click', rgbPause);

//     // init
//     buildSelector();
//     setScene(state.scene);
//     // start autoplay (optional: comment out one or both)
//     msPlay();
//     rgbPlay();

//     // expose if needed
//     return {
//       setScene, msPlay, msPause, rgbPlay, rgbPause,
//       nextMs: () => msStep(+1), prevMs: () => msStep(-1),
//       nextRgb: () => rgbStep(+1), prevRgb: () => rgbStep(-1),
//       state, config: cfg
//     };
//   }

//   window.initDatasetViewer = initDatasetViewer;
// })();

// // === Scenes overview carousel: 28 samples, autoplay 1800ms ===
// (function () {
//   function pad2(n){ return String(n).padStart(2, '0'); }

//   function initScenesOverview(opts){
//     const cfg = Object.assign({
//       root: '#scenes-overview',
//       imgId: '#so-image',
//       indicatorId: '#so-indicator',
//       prevId: '#so-prev', playId: '#so-play', pauseId: '#so-pause', nextId: '#so-next',
//       base: 'assets/dataset/smaples',
//       pattern: '{nn}.webp',
//       count: 28,
//       interval: 4000
//     }, opts || {});

//     const root = document.querySelector(cfg.root);
//     if (!root) return;

//     //const img = root.querySelector(cfg.imgId);
//     const btnPrev  = root.querySelector(cfg.prevId);
//     const btnPlay  = root.querySelector(cfg.playId);
//     const btnPause = root.querySelector(cfg.pauseId);
//     const btnNext  = root.querySelector(cfg.nextId);

//     const imgA = root.querySelector('#so-a');
//     const imgB = root.querySelector('#so-b');
//     const ind  = root.querySelector(cfg.indicatorId);

//     let idx = 1;
//     let timer = null;
//     let showingA = true; // 

//     function srcFor(i){
//       const nn = pad2(i);
//       const base = cfg.base.endsWith('/') ? cfg.base.slice(0, -1) : cfg.base;
//       return `${base}/${cfg.pattern.replace('{nn}', nn)}`;
//     }


//     function set(i){
//       if (i < 1) i = cfg.count;
//       if (i > cfg.count) i = 1;
//       idx = i;

//       const url = srcFor(idx);
//       const cur = showingA ? imgA : imgB;
//       const nxt = showingA ? imgB : imgA;

//       // load next image offscreen, then fade it in
//       nxt.onload = () => {
//         // preload the following frame for smoothness
//         const pre = new Image();
//         pre.src = srcFor(idx === cfg.count ? 1 : idx + 1);

//         nxt.classList.add('is-active');
//         cur.classList.remove('is-active');

//         nxt.alt = `Scene ${idx} sample`;
//         if (ind) ind.textContent = `${idx} / ${cfg.count}`;

//         showingA = !showingA;
//         nxt.onload = null; // cleanup
//       };

//       // start loading the next frame (may hit cache instantly)
//       nxt.src = url;
//     }

//     function step(d){ set(idx + d); }
//     function play(){ pause(); timer = setInterval(() => step(+1), cfg.interval); }
//     function pause(){ if (timer) clearInterval(timer); timer = null; }

//     btnPrev?.addEventListener('click', () => step(-1));
//     btnNext?.addEventListener('click', () => step(+1));
//     btnPlay?.addEventListener('click', play);
//     btnPause?.addEventListener('click', pause);

//     // Optional keyboard: ←/→ to navigate, space to toggle
//     document.addEventListener('keydown', (e) => {
//       const tag = (document.activeElement?.tagName || '').toLowerCase();
//       if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
//       if (!root.isConnected) return;
//       if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); }
//       if (e.key === 'ArrowRight') { e.preventDefault(); step(+1); }
//       if (e.key === ' ')          { e.preventDefault(); timer ? pause() : play(); }
//     });

//     // init
//     set(1);
//     play(); // start autoplay
//     return { set, next:()=>step(+1), prev:()=>step(-1), play, pause };
//   }

//   // call after DOM is ready
//   document.addEventListener('DOMContentLoaded', () => {
//     initScenesOverview({
//       // if you converted images, switch pattern to 's{nn}.webp'
//       // base: 'assets/scenes_overview', pattern: 's{nn}.webp',
//       interval: 4000, count: 28
//     });
//   });
// })();


// /* ============================================================
//    Dark-Room Illumination Sweep  (binds to Dataset Viewer)
//    Expects HTML ids:
//      #ds-darkroom-stage, #ds-dark-a, #ds-dark-b
//      #ds-dark-prev, #ds-dark-next, #ds-dark-toggle, #ds-dark-indicator
//    ============================================================ */
// (function () {
//   function slashSafe(s){ return s.endsWith('/') ? s.slice(0,-1) : s; }

//   function initDarkroom(opts){
//     const cfg = Object.assign({
//       // paths
//       base: 'assets/dataset',        // parent folder (same as your dataset viewer)
//       illumPattern: 'i{n}.webp',     // i1..i7.webp in each scene folder
//       msDark: 'ms_channel_00.webp',  // dark transition image in each scene folder
//       rgbSRGB: 'rgb_srgb.webp',      // D65 image in each scene folder
//       // timing
//       litMs: 1200,                   // how long each lit frame stays
//       darkMs: 500,                   // how long the dark frame stays
//       // glow colors for i1..i7 and D65
//       glows: ['#2ecc71', '#4169e1', '#ffd200', '#ff7e00', '#1e90ff', '#c81d25', '#7f00ff'],
//       glowD65: '#ffffff'
//     }, opts || {});

//     // elements
//     const stage = document.querySelector('#ds-darkroom-stage');
//     const a = document.querySelector('#ds-dark-a');
//     const b = document.querySelector('#ds-dark-b');
//     const btnPrev   = document.querySelector('#ds-dark-prev');
//     const btnNext   = document.querySelector('#ds-dark-next');
//     const btnToggle = document.querySelector('#ds-dark-toggle');
//     const indicator = document.querySelector('#ds-dark-indicator');
//     if (!stage || !a || !b) return null; // HTML not present → do nothing

//     // state
//     let scene = 's1';
//     let showingA = true;   // which <img> is visible
//     let litIndex = 0;      // 0..7 (i1..i7, then D65)
//     let phase = 'dark';    // 'dark' | 'lit'
//     let timer = null;

//     // helpers
//     function baseScenePath(id){ return `${slashSafe(cfg.base)}/${id}`; }
//     function srcIllum(id,k){
//       if (k < 7) return `${baseScenePath(id)}/${cfg.illumPattern.replace('{n}', String(k+1))}`;
//       return `${baseScenePath(id)}/${cfg.rgbSRGB}`;
//     }
//     function srcDark(id){ return `${baseScenePath(id)}/${cfg.msDark}`; }
//     function glowFor(k){ return (k < 7) ? cfg.glows[k] : cfg.glowD65; }

//     function swap(url, {lit=false, idx=null}={}){
//       const cur = showingA ? a : b;
//       const nxt = showingA ? b : a;

//       nxt.onload = () => {
//         nxt.classList.toggle('is-lit', !!lit);
//         stage.style.setProperty('--glow', lit ? glowFor(idx ?? 0) : '#000');
//         nxt.classList.add('is-active');
//         cur.classList.remove('is-active');
//         showingA = !showingA;
//         nxt.onload = null;
//       };
//       nxt.src = url;

//       if (indicator) indicator.textContent = lit && idx!=null ? `${idx+1} / 8` : '—';
//     }

//     function schedule(ms){ timer = setTimeout(step, ms); }
//     function step(){
//       if (phase === 'dark'){
//         swap(srcIllum(scene, litIndex), {lit:true, idx:litIndex});
//         phase = 'lit';
//         schedule(cfg.litMs);
//       } else {
//         litIndex = (litIndex + 1) % 8;
//         swap(srcDark(scene), {lit:false});
//         phase = 'dark';
//         schedule(cfg.darkMs);
//       }
//     }

//     function play(){ pause(); step(); updateToggle(); }
//     function pause(){ if (timer) clearTimeout(timer); timer = null; updateToggle(); }
//     function isPlaying(){ return !!timer; }
//     function updateToggle(){
//       if (!btnToggle) return;
//       btnToggle.textContent = isPlaying() ? '⏸' : '▶';
//       btnToggle.setAttribute('aria-pressed', String(isPlaying()));
//       btnToggle.setAttribute('aria-label', isPlaying() ? 'Pause (Space)' : 'Play (Space)');
//     }

//     function resetForScene(id){
//       scene = id;
//       pause();
//       showingA = true; litIndex = 0; phase = 'dark';
//       swap(srcDark(scene), {lit:false});
//     }

//     // wire controls
//     btnPrev && btnPrev.addEventListener('click', () => {
//       pause(); phase='dark';
//       litIndex = (litIndex + 7) % 8;
//       swap(srcIllum(scene, litIndex), {lit:true, idx:litIndex});
//     });
//     btnNext && btnNext.addEventListener('click', () => {
//       pause(); phase='dark';
//       litIndex = (litIndex + 1) % 8;
//       swap(srcIllum(scene, litIndex), {lit:true, idx:litIndex});
//     });
//     btnToggle && btnToggle.addEventListener('click', () => (isPlaying() ? pause() : play()));

//     // keyboard (optional)
//     document.addEventListener('keydown', (e) => {
//       const tag = (document.activeElement?.tagName || '').toLowerCase();
//       if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
//       if (!stage.isConnected) return;
//       if (e.key === 'ArrowLeft')  { e.preventDefault(); btnPrev?.click(); }
//       if (e.key === 'ArrowRight') { e.preventDefault(); btnNext?.click(); }
//       if (e.key === ' ')          { e.preventDefault(); btnToggle?.click(); }
//     });

//     // initial frame
//     resetForScene(scene);
//     updateToggle();

//     // public API
//     return { resetForScene, play, pause, isPlaying, config: cfg };
//   }

//   // Bind helper: plug the darkroom into your Dataset Viewer instance
//   window.__bindDarkroomToDataset = function(datasetViewerInstance){
//     if (!datasetViewerInstance) return;
//     const ds = datasetViewerInstance;
//     const dr = initDarkroom({
//       base: ds.config?.base || 'assets/dataset',
//       rgbSRGB: ds.config?.files?.rgbSRGB || 'rgb_srgb.webp'
//     });
//     if (!dr) return;

//     // reset now & start
//     dr.resetForScene(ds.state?.scene || 's1');
//     dr.play();

//     // patch setScene so the darkroom follows your scene changes
//     if (typeof ds.setScene === 'function'){
//       const original = ds.setScene.bind(ds);
//       ds.setScene = function(sceneId){
//         original(sceneId);
//         dr.resetForScene(sceneId);
//         dr.play();
//       };
//     }
//   };
// })();




// ===== Qualitative section scene switcher (NAFSR / Restormer / GT) =====
(function () {
  function initQualSceneSwitcher(options) {
    const cfg = Object.assign({
      rootSelector: '#qual-section',
      selectorId: 'qual-scene-selector',
      base: 'assets/results-comparison',
      folderSuffix: '_sr',
      scenes: [],
      files: { nafBase:'naf_rgb.png', nafTop:'full_naf_rgb.png',
               resBase:'restormer_rgb.png', resTop:'full_restormer_rgb.png', gt:'gt_rgb.png' },
      imgIds: {
        nafBase: '#naf-base', nafTop: '#naf-top',
        resBase: '#res-base', resTop: '#res-top',
        gt: '#gt-img'
      },
      labels: {
        nafBase: 'NAFSR baseline',
        nafTop:  'NAFSR + Ours',
        resBase: 'Restormer baseline',
        resTop:  'Restormer + Ours',
        gt:      'Ground Truth'
      },
      deepLink: true,
      deepLinkKey: 'qualScene'
    }, options || {});

    const root = document.querySelector(cfg.rootSelector) || document;
    const selector = root.querySelector('#' + cfg.selectorId);

    const imgNafBase = root.querySelector(cfg.imgIds.nafBase);
    const imgNafTop  = root.querySelector(cfg.imgIds.nafTop);
    const imgResBase = root.querySelector(cfg.imgIds.resBase);
    const imgResTop  = root.querySelector(cfg.imgIds.resTop);
    const imgGT      = root.querySelector(cfg.imgIds.gt);
    if (!selector || !imgNafBase || !imgNafTop || !imgResBase || !imgResTop || !imgGT) return;

    function path(sceneId, file) {
      return `${cfg.base}/${sceneId}${cfg.folderSuffix}/${file}`;
    }

    function setScene(sceneId) {
      imgNafBase.src = path(sceneId, cfg.files.nafBase);
      imgNafTop.src  = path(sceneId, cfg.files.nafTop);
      imgResBase.src = path(sceneId, cfg.files.resBase);
      imgResTop.src  = path(sceneId, cfg.files.resTop);
      imgGT.src      = path(sceneId, cfg.files.gt);

      const tag = sceneId.toUpperCase();
      imgNafBase.alt = `${cfg.labels.nafBase} — ${tag}`;
      imgNafTop.alt  = `${cfg.labels.nafTop} — ${tag}`;
      imgResBase.alt = `${cfg.labels.resBase} — ${tag}`;
      imgResTop.alt  = `${cfg.labels.resTop} — ${tag}`;
      imgGT.alt      = `${cfg.labels.gt} — ${tag}`;

      selector.querySelectorAll('button[data-scene]').forEach(b => {
        const active = b.dataset.scene === sceneId;
        b.classList.toggle('is-link', active);
        b.classList.toggle('is-light', !active);
        b.setAttribute('aria-pressed', String(active));
      });

      if (cfg.deepLink) {
        const params = new URLSearchParams(location.search);
        params.set(cfg.deepLinkKey, sceneId);
        history.replaceState(null, '', `?${params.toString()}`);
      }
    }

    function buildSelector() {
      selector.innerHTML = '';
      cfg.scenes.forEach(sc => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'button is-small is-light';
        btn.dataset.scene = sc.id;
        btn.style.margin = '0.25rem';
        btn.style.padding = '0';
        btn.style.borderRadius = '5%';
        btn.style.overflow = 'hidden';
        btn.style.width = '120px';
        btn.style.height = '70px';
        btn.style.display = 'inline-block';

        const thumb = new Image();
        thumb.src = path(sc.id, cfg.files.gt);
        thumb.alt = sc.label;
        thumb.style.width = '100%';
        thumb.style.height = '100%';
        thumb.style.objectFit = 'cover';
        thumb.style.borderRadius = '5%';

        btn.appendChild(thumb);
        btn.addEventListener('click', () => setScene(sc.id));
        selector.appendChild(btn);
      });
    }

    buildSelector();

    let initial = cfg.scenes[0]?.id;
    if (cfg.deepLink) {
      const q = new URLSearchParams(location.search).get(cfg.deepLinkKey);
      if (q && cfg.scenes.some(s => s.id === q)) initial = q;
    }
    setScene(initial);

    return { setScene, config: cfg };
  }

  window.initQualSceneSwitcher = initQualSceneSwitcher;
})();


// ===================== Dataset Viewer =====================
(function () {
  function pad(n, width=2) { return String(n).padStart(width, '0'); }

  function initDatasetViewer(opts) {
    const cfg = Object.assign({
      rootSelector: '#dataset-viewer',
      selectorId: 'ds-scene-selector',
      base: 'assets/dataset',
      scenes: [
        { id: 's1', label: 'Scene 1' },
        { id: 's2', label: 'Scene 2' },
        { id: 's3', label: 'Scene 3' },
        { id: 's4', label: 'Scene 4' },
        { id: 's5', label: 'Scene 5' },
      ],
      files: {
        msChannelPattern:  'ms_channel_{ch}.webp',
        msMosaic:          'ms_mosaic.webp',
        msSRGB:            'ms_view1_srgb.webp',
        rgbChannelPattern: 'rgb_view2_channel_{ch}.webp',
        rgbMosaic:         'rgb_view2_mosaic.webp',
        rgbSRGB:           'rgb_view2_srgb.webp',
        thumb:             'ms_view1_srgb.webp'
      },
      msCount: 16,
      rgbCount: 3,
      msInterval: 1800,
      rgbInterval: 1800
    }, opts || {});

    const root = document.querySelector(cfg.rootSelector);
    if (!root) return;

    const selector = root.querySelector('#' + cfg.selectorId);
    const el = {
      msImg:   root.querySelector('#ds-ms-channel'),
      msMos:   root.querySelector('#ds-ms-mosaic'),
      msSRGB:  root.querySelector('#ds-ms-srgb'),
      rgbImg:  root.querySelector('#ds-rgb-channel'),
      rgbMos:  root.querySelector('#ds-rgb-mosaic'),
      rgbSRGB: root.querySelector('#ds-rgb-srgb'),
      msIdx:   root.querySelector('#ds-ms-indicator'),
      rgbIdx:  root.querySelector('#ds-rgb-indicator'),
    };
    const btn = {
      msPrev:  root.querySelector('#ds-ms-prev'),
      msPlay:  root.querySelector('#ds-ms-play'),
      msPause: root.querySelector('#ds-ms-pause'),
      msNext:  root.querySelector('#ds-ms-next'),
      rgbPrev:  root.querySelector('#ds-rgb-prev'),
      rgbPlay:  root.querySelector('#ds-rgb-play'),
      rgbPause: root.querySelector('#ds-rgb-pause'),
      rgbNext:  root.querySelector('#ds-rgb-next'),
    };

    let state = {
      scene: cfg.scenes[0].id,
      msIdx: 1,
      rgbIdx: 1,
      msTimer: null,
      rgbTimer: null
    };

    function path(sceneId, file) {
      return `${cfg.base}/${sceneId}/${file}`;
    }
    function pathMs(sceneId, ch) {
      const idx0 = ch - 1;                 // 1..16 -> 0..15
      return path(sceneId, cfg.files.msChannelPattern.replace('{ch}', pad(idx0, 2)));
    }
    function pathRgb(sceneId, ch) {
      const idx0 = ch - 1;                 // 1..3 -> 0..2
      return path(sceneId, cfg.files.rgbChannelPattern.replace('{ch}', pad(idx0, 2))); // FIX: use rgbChannelPattern
    }

    function setScene(sceneId) {
      state.scene = sceneId;
      state.msIdx = 1; state.rgbIdx = 1;
      // statics
      el.msMos.src   = path(sceneId, cfg.files.msMosaic);
      el.msSRGB.src  = path(sceneId, cfg.files.msSRGB);
      el.rgbMos.src  = path(sceneId, cfg.files.rgbMosaic);
      el.rgbSRGB.src = path(sceneId, cfg.files.rgbSRGB);
      // channels
      el.msImg.src   = pathMs(sceneId, state.msIdx);
      el.rgbImg.src  = pathRgb(sceneId, state.rgbIdx);
      updateIndicators();
      highlightActive();

      // announce scene change for any listeners (dark-room, etc.)  // FIX: event
      document.dispatchEvent(new CustomEvent('dataset:scenechange', { detail: { sceneId } }));
    }

    function updateIndicators() {
      if (el.msIdx)  el.msIdx.textContent  = `${state.msIdx} / ${cfg.msCount}`;
      if (el.rgbIdx) el.rgbIdx.textContent = `${state.rgbIdx} / ${cfg.rgbCount}`;
    }

    function highlightActive() {
      selector?.querySelectorAll('button[data-scene]').forEach(b => {
        const active = b.dataset.scene === state.scene;
        b.classList.toggle('is-link', active);
        b.classList.toggle('is-light', !active);
        b.setAttribute('aria-pressed', String(active));
      });
    }

    function msStep(dir) {
      state.msIdx += dir;
      if (state.msIdx < 1) state.msIdx = cfg.msCount;
      if (state.msIdx > cfg.msCount) state.msIdx = 1;
      el.msImg.src = pathMs(state.scene, state.msIdx);
      updateIndicators();
    }
    function rgbStep(dir) {
      state.rgbIdx += dir;
      if (state.rgbIdx < 1) state.rgbIdx = cfg.rgbCount;
      if (state.rgbIdx > cfg.rgbCount) state.rgbIdx = 1;
      el.rgbImg.src = pathRgb(state.scene, state.rgbIdx);
      updateIndicators();
    }

    function msPlay() { msPause(); state.msTimer = setInterval(() => msStep(+1), cfg.msInterval); }
    function msPause() { if (state.msTimer) clearInterval(state.msTimer); state.msTimer = null; }
    function rgbPlay() { rgbPause(); state.rgbTimer = setInterval(() => rgbStep(+1), cfg.rgbInterval); }
    function rgbPause() { if (state.rgbTimer) clearInterval(state.rgbTimer); state.rgbTimer = null; }

    function buildSelector() {
      if (!selector) return;
      selector.innerHTML = '';
      cfg.scenes.forEach(sc => {
        const btnEl = document.createElement('button');
        btnEl.type = 'button';
        btnEl.className = 'button is-small is-light';
        btnEl.dataset.scene = sc.id;
        btnEl.style.margin = '.25rem'; btnEl.style.padding = '0';
        btnEl.style.borderRadius = '5%'; btnEl.style.overflow = 'hidden';
        btnEl.style.width = '120px'; btnEl.style.height = '70px';

        const img = new Image();
        img.src = path(sc.id, cfg.files.thumb);
        img.alt = sc.label; img.loading = 'lazy';
        img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover';
        img.style.borderRadius = '5%';

        btnEl.appendChild(img);
        btnEl.addEventListener('click', () => setScene(sc.id));
        selector.appendChild(btnEl);
      });
    }

    // wire controls
    btn.msPrev?.addEventListener('click', () => msStep(-1));
    btn.msNext?.addEventListener('click', () => msStep(+1));
    btn.msPlay?.addEventListener('click', msPlay);
    btn.msPause?.addEventListener('click', msPause);

    btn.rgbPrev?.addEventListener('click', () => rgbStep(-1));
    btn.rgbNext?.addEventListener('click', () => rgbStep(+1));
    btn.rgbPlay?.addEventListener('click', rgbPlay);
    btn.rgbPause?.addEventListener('click', rgbPause);

    // init
    buildSelector();
    setScene(state.scene);
    msPlay();
    rgbPlay();

    const api = {
      setScene, msPlay, msPause, rgbPlay, rgbPause,
      nextMs: () => msStep(+1), prevMs: () => msStep(-1),
      nextRgb: () => rgbStep(+1), prevRgb: () => rgbStep(-1),
      state, config: cfg
    };

    // let listeners auto-bind (e.g., dark-room)                      // FIX: ready event
    document.dispatchEvent(new CustomEvent('dataset:viewer-ready', { detail: { instance: api } }));
    return api;
  }

  window.initDatasetViewer = initDatasetViewer;
})();

// === Scenes overview carousel: 28 samples, autoplay 4000ms ===
(function () {
  function pad2(n){ return String(n).padStart(2, '0'); }

  function initScenesOverview(opts){
    const cfg = Object.assign({
      root: '#scenes-overview',
      imgId: '#so-image',
      indicatorId: '#so-indicator',
      prevId: '#so-prev', playId: '#so-play', pauseId: '#so-pause', nextId: '#so-next',
      base: 'assets/dataset/smaples',
      pattern: '{nn}.webp',
      count: 28,
      interval: 4000
    }, opts || {});

    const root = document.querySelector(cfg.root);
    if (!root) return;

    const btnPrev  = root.querySelector(cfg.prevId);
    const btnPlay  = root.querySelector(cfg.playId);
    const btnPause = root.querySelector(cfg.pauseId);
    const btnNext  = root.querySelector(cfg.nextId);

    const imgA = root.querySelector('#so-a');
    const imgB = root.querySelector('#so-b');
    const ind  = root.querySelector(cfg.indicatorId);

    let idx = 1;
    let timer = null;
    let showingA = true;

    function srcFor(i){
      const nn = pad2(i);
      const base = cfg.base.endsWith('/') ? cfg.base.slice(0, -1) : cfg.base;
      return `${base}/${cfg.pattern.replace('{nn}', nn)}`;
    }

    function set(i){
      if (i < 1) i = cfg.count;
      if (i > cfg.count) i = 1;
      idx = i;

      const url = srcFor(idx);
      const cur = showingA ? imgA : imgB;
      const nxt = showingA ? imgB : imgA;

      nxt.onload = () => {
        const pre = new Image();
        pre.src = srcFor(idx === cfg.count ? 1 : idx + 1);

        nxt.classList.add('is-active');
        cur.classList.remove('is-active');

        nxt.alt = `Scene ${idx} sample`;
        if (ind) ind.textContent = `${idx} / ${cfg.count}`;

        showingA = !showingA;
        nxt.onload = null;
      };
      nxt.src = url;
    }

    function step(d){ set(idx + d); }
    function play(){ pause(); timer = setInterval(() => step(+1), cfg.interval); }
    function pause(){ if (timer) clearInterval(timer); timer = null; }

    btnPrev?.addEventListener('click', () => step(-1));
    btnNext?.addEventListener('click', () => step(+1));
    btnPlay?.addEventListener('click', play);
    btnPause?.addEventListener('click', pause);

    document.addEventListener('keydown', (e) => {
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (!root.isConnected) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(+1); }
      if (e.key === ' ')          { e.preventDefault(); timer ? pause() : play(); }
    });

    set(1);
    play();
    return { set, next:()=>step(+1), prev:()=>step(-1), play, pause };
  }

  document.addEventListener('DOMContentLoaded', () => {
    initScenesOverview({ interval: 4000, count: 28 });
  });
})();

/* ============================================================
   Dark-Room Illumination Sweep  (labels + tuned glow colors)
   ============================================================ */
(function () {
  function slashSafe(s){ return s.endsWith('/') ? s.slice(0,-1) : s; }

  function initDarkroom(opts){
    const cfg = Object.assign({
      base: 'assets/dataset',
      illumPattern: 'i{n}.webp',     // i1..i7.webp
      msDark: 'ms_channel_00.webp',  // dark transition image
      rgbSRGB: 'rgb_srgb.webp',      // D65 image
      litMs: 3800,
      darkMs: 900,
      // Lights in order: Violet, Royal Blue, Blue, Green, Yellow, Amber, Deep Red
      lightLabels: ['Violet','Royal Blue','Blue','Green','Yellow','Amber','Deep Red'],
      glows: ['#3B06FB','#3462EB','#1E90FF','#2ECC71','#E7D47D','#FF8F00','#C81D25'],
      glowD65: '#FFFFFF'
    }, opts || {});

    // elements
    const stage   = document.querySelector('#ds-darkroom-stage');
    const a       = document.querySelector('#ds-dark-a');
    const b       = document.querySelector('#ds-dark-b');
    const btnPrev = document.querySelector('#ds-dark-prev');
    const btnNext = document.querySelector('#ds-dark-next');
    const btnPlay = document.querySelector('#ds-dark-play');
    const btnPause= document.querySelector('#ds-dark-pause');
    const indicator = document.querySelector('#ds-dark-indicator');
    if (!stage || !a || !b) return null;

    // state
    let scene = 's1';
    let showingA = true;   // which <img> is visible
    let litIndex = 0;      // 0..7 (i1..i7, then D65)
    let phase = 'dark';    // 'dark' | 'lit'
    let timer = null;

    // helpers
    const baseScenePath = id => `${slashSafe(cfg.base)}/${id}`;
    const srcIllum = (id,k) => k < 7
      ? `${baseScenePath(id)}/${cfg.illumPattern.replace('{n}', String(k+1))}`
      : `${baseScenePath(id)}/${cfg.rgbSRGB}`;
    const srcDark  = id => `${baseScenePath(id)}/${cfg.msDark}`;
    const glowFor  = k => (k < 7 ? cfg.glows[k] : cfg.glowD65);
    const labelFor = k => (k < 7 ? cfg.lightLabels[k] : 'D65');

    function swap(url, {lit=false, idx=null}={}){
      const cur = showingA ? a : b;
      const nxt = showingA ? b : a;

      nxt.onload = () => {
        nxt.classList.toggle('is-lit', !!lit);
        stage.style.setProperty('--glow', lit ? glowFor(idx ?? 0) : '#000');
        nxt.classList.add('is-active');
        cur.classList.remove('is-active');
        showingA = !showingA;
        nxt.onload = null;
      };
      nxt.src = url;

      // Update label ONLY on lit frames (keep previous during dark)
      if (indicator && lit && idx != null) {
        indicator.textContent = `${labelFor(idx)} (${idx+1} / 8)`;
      }
    }

    function schedule(ms){ timer = setTimeout(step, ms); }
    function step(){
      if (phase === 'dark'){
        swap(srcIllum(scene, litIndex), {lit:true, idx:litIndex});
        phase = 'lit';
        schedule(cfg.litMs);
      } else {
        litIndex = (litIndex + 1) % 8;
        swap(srcDark(scene), {lit:false});
        phase = 'dark';
        schedule(cfg.darkMs);
      }
    }

    function play(){ pause(); step(); }
    function pause(){ if (timer) clearTimeout(timer); timer = null; }
    function isPlaying(){ return !!timer; }

    function resetForScene(id){
      scene = id;
      pause();
      showingA = true; litIndex = 0; phase = 'dark';
      swap(srcDark(scene), {lit:false});                  // show dark frame
      if (indicator) indicator.textContent = `${labelFor(0)} (1 / 8)`; // seed label
    }

    // controls
    btnPrev?.addEventListener('click', () => {
      pause(); phase='dark';
      litIndex = (litIndex + 7) % 8; // previous lit frame
      swap(srcIllum(scene, litIndex), {lit:true, idx:litIndex});
    });
    btnNext?.addEventListener('click', () => {
      pause(); phase='dark';
      litIndex = (litIndex + 1) % 8; // next lit frame
      swap(srcIllum(scene, litIndex), {lit:true, idx:litIndex});
    });
    btnPlay?.addEventListener('click', play);
    btnPause?.addEventListener('click', pause);

    // keyboard like Scenes Overview: ←/→ and Space
    document.addEventListener('keydown', (e) => {
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (!stage.isConnected) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); btnPrev?.click(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); btnNext?.click(); }
      if (e.key === ' ')          { e.preventDefault(); (isPlaying() ? pause() : play()); }
    });

    // stay in sync with dataset viewer (via event)
    document.addEventListener('dataset:scenechange', (e) => {
      const id = e.detail?.sceneId;
      if (!id) return;
      const was = isPlaying();
      resetForScene(id);
      if (was) play();
    });

    // init (no autoplay here; we start it when viewer is ready)
    resetForScene(scene);
    return { resetForScene, play, pause, isPlaying, config: cfg };
  }

  // Auto-init when dataset viewer is ready (and start autoplay)
  document.addEventListener('dataset:viewer-ready', (e) => {
    const ds = e.detail?.instance;
    if (!ds) return;
    const dr = initDarkroom({
      base: ds.config?.base || 'assets/dataset',
      rgbSRGB: ds.config?.files?.rgbSRGB || 'rgb_srgb.webp'
    });
    if (dr) dr.play();   // autoplay
  });

  // Optional manual binder
  window.__bindDarkroomToDataset = function(ds){
    if (!ds) return;
    const dr = initDarkroom({
      base: ds.config?.base || 'assets/dataset',
      rgbSRGB: ds.config?.files?.rgbSRGB || 'rgb_srgb.webp'
    });
    if (!dr) return;
    dr.play(); // autoplay

    if (typeof ds.setScene === 'function'){
      const original = ds.setScene.bind(ds);
      ds.setScene = function(sceneId){
        const playing = dr.isPlaying();
        original(sceneId);
        dr.resetForScene(sceneId);
        if (playing) dr.play(); else dr.pause();
      };
    }
  };
})();
