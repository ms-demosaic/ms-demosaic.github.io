


var methods = ['global','semantic','saliency','entropy'];
var evs = ['15','8','6','4','2','1','1/2','1/4','1/8','1/15','1/30','1/60','1/125','1/250','1/500']
class Sample_viewer{
	/*
	Viewer setup needs a mix of HTML and JS
	See the HTML and this class to see how to structure the HTML elements, their ids, and JS callbacks
	The prefix argument i used to identify the viewer, needs to be consistent with HTML for the JS to find the right elements
	*/
	constructor(prefix,max_idx,n_scenes){
		// this.variants = variants;
		this.n_scenes = n_scenes;
		this.prefix = prefix;
		this.max_idx = max_idx;
		this.cur_frame = 0;
		this.cur_sample = 0;
		// this.variant = 'orbit';
		this.base_im = '0000';
		this.need_stop_anim = false;
		this.interval_id = null;
		this.anim_dir = 1;

		//add data variables
		this.n_scenes_data = 4;
		this.cur_frame_data = 0;
		this.cur_ev_data = 0;
		this.base_im_data = '0000';

		for (let i=0;i<this.n_scenes;i++){
			document.getElementById(`${this.prefix}-scene-selector`).innerHTML += `<div onclick="${this.prefix}_viewer.change_scene(\'${i.toString().padStart(4,0)}\');"> <img style="border-radius:1em; max-width: 7em" class=selectable src="assets/icons/${this.prefix}/${i.toString().padStart(4,0)}.jpg"> </div>`;
		}


		for (let i=0;i<this.n_scenes_data;i++){
			document.getElementById(`${this.prefix}-scene-selector_data`).innerHTML += `<div onclick="${this.prefix}_viewer.change_scene_data(\'${i.toString().padStart(4,0)}\');"> <img style="border-radius:1em; max-width: 7em" class=selectable src="assets/icons/data/${i.toString().padStart(2,0)}.jpg"> </div>`;
		}


	}
	update_ims(){
		/*
		This is the main method that takes all the image parameters and updates the images in the web page
		*/
		for (let method of methods){
			if (this.cur_frame == 0){
				// This is a hack used by my project to reduce the size of the supplemental material
				// In this project the first frame is always the same so this code just reuses the same image
				document.getElementById(`${this.prefix}-${method}`).src = `assets/individual-frames/initial-frames/${this.prefix}/${this.base_im}.jpg`;
			}else{
				let frame_padded = this.cur_frame.toString().padStart(4,0);
				let sample_padded = this.cur_sample.toString().padStart(2,0);
				document.getElementById(`${this.prefix}-${method}`).src = `assets/individual-frames/${this.base_im}/${method}/${sample_padded}/${frame_padded}.jpg`;
			}
		}
	}

	update_ims_data(){
		/*
		This is the main method that takes all the image parameters and updates the images in the web page
		*/
		document.getElementById(`text-ev`).textContent = "Shutter Speed: " + evs[this.cur_ev_data] + " s";
		let i=0

		let frame_padded = ((this.cur_frame_data+i)*5).toString().padStart(2,0);
		let ev_padded = this.cur_ev_data.toString().padStart(2,0);
		document.getElementById(`data-${i}`).src = `assets/images/data/${this.base_im_data}/${frame_padded}${ev_padded}.jpg`;
		document.getElementById(`text-${i}`).textContent = 'Time: '+frame_padded;
		
		
	}

	/* ===================================================================================
	The methods below are used for image control, called by pushing buttons on the HTML
	=================================================================================== */
	change_scene(idx){
		this.base_im = idx;
		this.update_ims();

		this.imgs = [];

		var sample_padded = this.cur_sample.toString().padStart(2,0);
		//this trick lets you load in all images for scene in the background so playback is smooth
		for (let j=0; j<4; j++){
			let method = methods[j];
			for (let i=0;i<100;i++) {
			    this.imgs.push(new Image());
				let frame_padded = i.toString().padStart(4,0);
			    this.imgs[j*100+i].src = `assets/individual-frames/${this.base_im}/${method}/${sample_padded}/${frame_padded}.jpg`;
			}
		}
	}

	change_scene_data(idx){
		this.base_im_data = idx;
		this.update_ims_data();

		// this.imgs = [];

		// var sample_padded = this.cur_sample.toString().padStart(2,0);
		// //this trick lets you load in all images for scene in the background so playback is smooth
		// for (let j=0; j<4; j++){
		// 	let method = methods[j];
		// 	for (let i=0;i<100;i++) {
		// 	    this.imgs.push(new Image());
		// 		let frame_padded = i.toString().padStart(4,0);
		// 	    this.imgs[j*100+i].src = `assets/individual-frames/${this.base_im}/${method}/${sample_padded}/${frame_padded}.jpg`;
		// 	}
		// }
	}
	// change_variant(name){
	// 	this.variant = name;
	// 	if (this.variants){
	// 		for (let nn of this.variants){
	// 			document.getElementById(`${nn}_selector`).style.backgroundColor = '';
	// 			document.getElementById(`${nn}_selector`).style.borderRadius = '1em';
	// 		}
	// 		document.getElementById(`${name}_selector`).style.backgroundColor = 'lightgrey';
	// 		document.getElementById(`${name}_selector`).style.borderRadius = '1em';
	// 	}
	// 	this.update_ims();
	// }
	change_sample(idx){
		this.cur_sample = idx;
		this.update_ims();

		
		// for (let i=0;i<3;i++){
		// 	document.getElementById(`${this.prefix}_sample_selector_${i+1}`).style.backgroundColor = 'rgb(240,240,240)';
		// }
		//document.getElementById(`${this.prefix}_sample_selector_${idx+1}`).style.backgroundColor = 'lightgrey';
	}


	/* ===================================================================================
	The methods below are used for automatic playback
	=================================================================================== */
	change_frame(idx){
		/*
		This is called when the user clicks and drags on the slider to see a specific frame
		This also stops the automatic playback
		*/
		this.stop_anim();
		this.cur_frame = parseInt(idx);
		this.update_ims();
	}

	change_frame_data(idx){
		/*
		This is called when the user clicks and drags on the slider to see a specific frame
		*/
		// this.stop_anim();
		this.cur_frame_data = parseInt(idx);
		this.update_ims_data();
	}

	change_ev_data(idx){
		/*
		This is called when the user clicks and drags on the slider to see a specific ev
		*/
		// this.stop_anim();
		this.cur_ev_data= parseInt(idx); // swap order
		this.update_ims_data();
	}


	next_frame(){
		/*
		This is used internally to play the sequence forward and backward, and also moves the slider to show the user what frame is being shown
		*/
		this.cur_frame += this.anim_dir;
		if (this.cur_frame >= this.max_idx) {this.anim_dir=-1;}
		if (this.cur_frame <= 0) {this.anim_dir=1;}
		document.getElementById(`${this.prefix}_frame_control`).value = this.cur_frame;
		this.update_ims();
	}
	cycle_frames(delay){
		/*
		Starts the automatic playback using JS intervals, see next_frame() to see the cycling behavior
		*/
		this.stop_anim();
		this.interval_id = setInterval(function() {
			this.next_frame();
		}.bind(this), delay);
		this.update_ims();
	}
	stop_anim(){
		if (this.interval_id){clearInterval(this.interval_id);}
		this.interval_id = null;
	}
};

// ===== Qualitative section scene switcher (NAFSR / Restormer / GT) =====
(function () {
  function initQualSceneSwitcher(options) {
    const cfg = Object.assign({
      rootSelector: '#qual-section',     // scope to a section
      selectorId: 'qual-scene-selector', // where scene buttons go
      base: 'assets/results-comparison',
      folderSuffix: '_sr',               // <-- NEW: '_sr' or '_full'
      scenes: [],
      files: { nafBase:'naf_rgb.png', nafTop:'full_naf_rgb.png',
               resBase:'restormer_rgb.png', resTop:'full_restormer_rgb.png', gt:'gt_rgb.png' },
      imgIds: {                          // <-- NEW: per-block image IDs
        nafBase: '#naf-base', nafTop: '#naf-top',
        resBase: '#res-base', resTop: '#res-top',
        gt: '#gt-img'
      },
      labels: {                          // <-- NEW: a11y alt base text
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

    // scoped image elements
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

  /**
   * Initialize dataset viewer (scene selector + two carousels + four statics).
   * @param {Object} opts - see defaults below and override to match your paths.
   */
  function initDatasetViewer(opts) {
    const cfg = Object.assign({
      rootSelector: '#dataset-viewer',
      selectorId: 'ds-scene-selector',
      base: 'assets/dataset',    // folder containing scene subfolders
      scenes: [                  // 5 scenes (update to match your folders)
        { id: 's1', label: 'Scene 1' },
        { id: 's2', label: 'Scene 2' },
        { id: 's3', label: 'Scene 3' },
        { id: 's4', label: 'Scene 4' },
        { id: 's5', label: 'Scene 5' },
      ],
      files: {
        // patterns (replace {ch})
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
      // autoplay speeds (ms)
      msInterval: 1500,
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
	  const idx0 = ch - 1;                 // 1..16  ->  0..15
      return path(sceneId, cfg.files.msChannelPattern.replace('{ch}', pad(idx0, 2)));
    }
    function pathRgb(sceneId, ch) {
      const idx0 = ch - 1;                 // 1..3  ->  0..2
  	  return path(sceneId, cfg.files.msChannelPattern.replace('{ch}', pad(idx0, 2)));
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
        // small rectangular thumb (cropped)
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
    // start autoplay (optional: comment out one or both)
    msPlay();
    rgbPlay();

    // expose if needed
    return {
      setScene, msPlay, msPause, rgbPlay, rgbPause,
      nextMs: () => msStep(+1), prevMs: () => msStep(-1),
      nextRgb: () => rgbStep(+1), prevRgb: () => rgbStep(-1),
      state, config: cfg
    };
  }

  window.initDatasetViewer = initDatasetViewer;
})();


