


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
  /**
   * Initialize scene switching for the qualitative comparison block.
   * Expects:
   *   - a button container with id="qual-scene-selector"
   *   - image ids: #naf-base, #naf-top, #res-base, #res-top, #gt-img
   *   - assets laid out like: assets/results-comparison/<sceneId>_sr/<file>.png
   *
   * If your slider JS already handles .compare-slider, leave it; this code doesn't touch it.
   */
  function initQualSceneSwitcher(options) {
    const cfg = Object.assign({
      selectorId: 'qual-scene-selector',
      base: 'assets/results-comparison',
      scenes: [
        { id: 's1', label: 'Scene 1' },
        { id: 's2', label: 'Scene 2' },
        { id: 's3', label: 'Scene 3' },
      ],
      files: {
        nafBase: 'naf_rgb.png',
        nafTop:  'full_naf_rgb.png',
        resBase: 'restormer_rgb.png',
        resTop:  'full_restormer_rgb.png',
        gt:      'gt_rgb.png',
      },
      deepLink: true,        // set to false if you don’t want ?qualScene=s2 in the URL
      deepLinkKey: 'qualScene'
    }, options || {});

    const selector = document.getElementById(cfg.selectorId);
    const imgNafBase = document.getElementById('naf-base');
    const imgNafTop  = document.getElementById('naf-top');
    const imgResBase = document.getElementById('res-base');
    const imgResTop  = document.getElementById('res-top');
    const imgGT      = document.getElementById('gt-img');

    if (!selector || !imgNafBase || !imgNafTop || !imgResBase || !imgResTop || !imgGT) {
      // Elements not present; nothing to do.
      return;
    }

    function path(sceneId, file) {
      return `${cfg.base}/${sceneId}_sr/${file}`;
    }

    function setScene(sceneId) {
      imgNafBase.src = path(sceneId, cfg.files.nafBase);
      imgNafTop.src  = path(sceneId, cfg.files.nafTop);
      imgResBase.src = path(sceneId, cfg.files.resBase);
      imgResTop.src  = path(sceneId, cfg.files.resTop);
      imgGT.src      = path(sceneId, cfg.files.gt);

      // Update alts (nice for a11y)
      const label = sceneId.toUpperCase();
      imgNafBase.alt = `NAFSR baseline — ${label}`;
      imgNafTop.alt  = `NAFSR + Ours — ${label}`;
      imgResBase.alt = `Restormer baseline — ${label}`;
      imgResTop.alt  = `Restormer + Ours — ${label}`;
      imgGT.alt      = `Ground Truth — ${label}`;

      // Highlight active button
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
			btn.style.overflow = 'hidden';       // hide overflow for crop
			btn.style.width = '120px';           // make it smaller
			btn.style.height = '70px';           // rectangular ratio
			btn.style.display = 'inline-block';

			// Ground truth thumbnail
			const thumb = new Image();
			thumb.src = `${cfg.base}/${sc.id}_sr/${cfg.files.gt}`;
			thumb.alt = sc.label;
			thumb.style.width = '100%';          // fill button
			thumb.style.height = '100%';
			thumb.style.objectFit = 'cover';     // crop to fit rectangle
			thumb.style.borderRadius = '5%';

			btn.appendChild(thumb);

			btn.addEventListener('click', () => setScene(sc.id));
			selector.appendChild(btn);
		});
	}


    buildSelector();

    // pick initial scene (URL > first)
    let initial = cfg.scenes[0]?.id;
    if (cfg.deepLink) {
      const q = new URLSearchParams(location.search).get(cfg.deepLinkKey);
      if (q && cfg.scenes.some(s => s.id === q)) initial = q;
    }
    setScene(initial);

    // optional API
    return { setScene, config: cfg };
  }

  // expose
  window.initQualSceneSwitcher = initQualSceneSwitcher;
})();


// create the viewer here to make it global, and accessible from the HTML

