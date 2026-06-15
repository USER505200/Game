import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';

(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const canvas = $('gameCanvas');
  const loading = $('loading');
  const loadProgress = $('loadProgress');
  const loadText = $('loadText');
  const cinematicEl = $('cinematic');
  const cinemaKicker = $('cinemaKicker');
  const cinemaTitle = $('cinemaTitle');
  const cinemaText = $('cinemaText');
  const skipBtn = $('skipBtn');
  const skipCount = $('skipCount');
  const startOverlay = $('startOverlay');
  const enterGame = $('enterGame');
  const hud = $('hud');
  const objectiveText = $('objectiveText');
  const objectiveBar = $('objectiveBar');
  const subtitle = $('subtitle');
  const speaker = $('speaker');
  const subtitleText = $('subtitleText');
  const interactPrompt = $('interactPrompt');
  const pointerHint = $('pointerHint');
  const healthBar = $('healthBar');
  const healthText = $('healthText');
  const staminaBar = $('staminaBar');
  const staminaText = $('staminaText');
  const ammoClip = $('ammoClip');
  const ammoReserve = $('ammoReserve');
  const reloadText = $('reloadText');
  const missionState = $('missionState');
  const saveState = $('saveState');
  const damageFlash = $('damageFlash');
  const hitMarker = $('hitMarker');
  const alertBadge = $('alertBadge');
  const pauseOverlay = $('pauseOverlay');
  const resultOverlay = $('resultOverlay');
  const storyGate = $('storyGate');
  const startStoryBtn = $('startStoryBtn');
  const inventoryOverlay = $('inventoryOverlay');
  const closeInventoryBtn = $('closeInventory');
  const weaponName = $('weaponName');
  const ammoDivider = $('ammoDivider');
  const slotOneHud = $('slotOneHud');
  const slotTwoHud = $('slotTwoHud');
  const inventoryShotgun = $('inventoryShotgun');
  const inventoryHatchet = $('inventoryHatchet');

  const I18N = {
    en: {
      loading1: 'Building the abandoned district…', loading2: 'Preparing rain, shadows and infected…', loading3: 'Loading Night One…', storyGateKicker: 'CHAPTER 01 · CINEMATIC AUDIO', storyGateTitle: 'BEGIN NIGHT ONE', storyGateCopy: 'Start the chapter to enable cinematic narration, atmosphere, and story audio.', storyGateButton: 'START CHAPTER',
      startCopy: 'The emergency broadcast stopped. Reach the station and find out who is still alive.', enter: 'CLICK TO ENTER THE NIGHT',
      obj0: 'Reach the police checkpoint', obj1: 'Restore power to the street generator', obj2: 'Survive the infected attack', obj3: 'Reach the radio station', obj4: 'Use the emergency transmitter',
      interactGenerator: 'START GENERATOR', interactRadio: 'USE TRANSMITTER', detected: 'DETECTED', saved: 'CHECKPOINT SAVED',
      subtitle1: 'The district went silent twelve hours ago. Stay off the open road.', subtitle2: 'Checkpoint ahead. The signal came from beyond it.',
      subtitle3: 'The generator is dead. Get it running and the station door should unlock.', subtitle4: 'Power is back. That noise brought them here.',
      subtitle5: 'The street is clear. Move to the station before more arrive.', subtitle6: 'This is Mara… if anyone can hear me, the evacuation was a lie.',
      player: 'SURVIVOR', mara: 'MARA', radio: 'EMERGENCY RADIO', reloading: 'RELOADING…', reload: 'R TO RELOAD', noAmmo: 'NO AMMO', shotgun: 'TACTICAL SHOTGUN', hatchet: 'OLD HATCHET', melee: 'MELEE · NO AMMO',
      wave: 'INFECTED REMAINING', complete: 'SIGNAL RESTORED', completeText: 'The message reveals that survivors are trapped beneath the old hospital. Night Two has begun.',
      failed: 'YOU DID NOT SURVIVE', failedText: 'The district consumed another survivor. Restart Night One and stay out of reach.',
      intro1: 'At 02:17, every emergency channel in the city went silent.', intro2: 'One signal returned from the abandoned northern district.', intro3: 'Your orders are simple: find the transmitter, locate the survivors, and survive the first night.',
      outro1: 'The transmitter activates. A broken voice cuts through the static.', outro2: 'The outbreak was not an accident. The truth is waiting beneath Saint Mercy Hospital.'
    },
    ar: {
      loading1: 'جارٍ بناء الحي المهجور…', loading2: 'جارٍ تجهيز المطر والظلال والمصابين…', loading3: 'جارٍ تحميل الليلة الأولى…', storyGateKicker: 'الفصل 01 · صوت المشهد', storyGateTitle: 'ابدأ الليلة الأولى', storyGateCopy: 'ابدأ الفصل لتشغيل صوت القصة والأجواء والمشهد السينمائي.', storyGateButton: 'ابدأ الفصل',
      startCopy: 'توقّف بث الطوارئ. وصل إلى المحطة واكتشف من لا يزال حيًا.', enter: 'اضغط لدخول الليلة الأولى',
      obj0: 'وصل إلى نقطة تفتيش الشرطة', obj1: 'أعد تشغيل مولّد الشارع', obj2: 'انجُ من هجوم المصابين', obj3: 'وصل إلى محطة الراديو', obj4: 'استخدم جهاز إرسال الطوارئ',
      interactGenerator: 'تشغيل المولّد', interactRadio: 'استخدام جهاز الإرسال', detected: 'تم اكتشافك', saved: 'تم حفظ نقطة التقدم',
      subtitle1: 'الحي صامت منذ اثنتي عشرة ساعة. ابتعد عن منتصف الطريق.', subtitle2: 'نقطة التفتيش أمامك. الإشارة جاءت من خلفها.',
      subtitle3: 'المولّد متوقف. شغّله حتى يُفتح باب المحطة.', subtitle4: 'عادت الكهرباء. الضوضاء جذبتهم إلى هنا.',
      subtitle5: 'الشارع آمن مؤقتًا. تحرّك نحو المحطة قبل وصول المزيد.', subtitle6: 'أنا مارا… إذا كان أحد يسمعني، عملية الإخلاء كانت كذبة.',
      player: 'الناجي', mara: 'مارا', radio: 'راديو الطوارئ', reloading: 'جارٍ التعمير…', reload: 'اضغط R للتعمير', noAmmo: 'لا توجد ذخيرة', shotgun: 'بندقية تكتيكية', hatchet: 'فأس قديم', melee: 'سلاح قريب · بدون ذخيرة',
      wave: 'المصابون المتبقون', complete: 'تمت استعادة الإشارة', completeText: 'تكشف الرسالة أن ناجين محاصرين أسفل المستشفى القديم. بدأت الليلة الثانية.',
      failed: 'لم تنجُ من الليلة', failedText: 'ابتلع الحي ناجيًا آخر. أعد الليلة الأولى وحافظ على مسافة آمنة.',
      intro1: 'عند الساعة 02:17 صمتت جميع قنوات الطوارئ في المدينة.', intro2: 'عادت إشارة واحدة من الحي الشمالي المهجور.', intro3: 'مهمتك بسيطة: اعثر على جهاز الإرسال، وحدد مكان الناجين، وانجُ من الليلة الأولى.',
      outro1: 'يعمل جهاز الإرسال، ويخرج صوت متقطع من بين التشويش.', outro2: 'الوباء لم يكن حادثًا. الحقيقة تنتظر أسفل مستشفى سانت ميرسي.'
    }
  };

  let lang = localStorage.getItem('ls-language') || 'en';
  const t = key => I18N[lang][key] || key;

  const state = {
    mode: 'loading', stage: 0, health: 100, stamina: 100, clip: 8, reserve: 48, kills: 0, shots: 0, hits: 0,
    sprinting: false, reloading: false, lastShot: 0, missionStart: 0, subtitleUntil: 0, lastTime: performance.now(),
    cinematicStart: 0, cinematicKind: 'intro', cinematicFinished: false, detected: false, checkpointShown: 0,
    stepDistance: 0, lastPosition: new THREE.Vector3(), rainTime: 0, gameEnded: false, interacting: false,
    weapon: 'shotgun', weaponSwitching: false, axeSwinging: false, inventoryOpen: false, lastNarrationKey: ''
  };

  const keys = Object.create(null);
  const obstacles = [];
  const obstacleMeshes = [];
  const puddles = [];
  const zombies = [];
  const mixers = [];
  const clock = new THREE.Clock();
  const loader3d = new GLTFLoader();
  const assetTemplates = { player: null, zombies: [], rifle: null, hatchet: null };
  let shotgunView = null, hatchetView = null;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.78;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x06090c);
  scene.fog = new THREE.FogExp2(0x091016, 0.0125);

  const player = new THREE.Object3D();
  player.position.set(0, 0, 32);
  scene.add(player);
  const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.05, 320);
  camera.position.set(0, 1.68, 0);
  player.add(camera);
  let pitch = 0;

  const bodyRoot = new THREE.Group();
  player.add(bodyRoot);
  const weaponRoot = new THREE.Group();
  camera.add(weaponRoot);
  const flashlight = new THREE.SpotLight(0xd9ecff, 28, 30, Math.PI/7, .48, 1.25);
  flashlight.position.set(0, -.04, -.06);flashlight.castShadow=true;flashlight.shadow.mapSize.set(512,512);flashlight.shadow.bias=-.0004;
  flashlight.target.position.set(0, -.15, -8);camera.add(flashlight);camera.add(flashlight.target);
  let flashlightOn = true;
  const objectiveMarker = new THREE.Group();
  const objectiveDiamond = new THREE.Mesh(new THREE.OctahedronGeometry(.28,0), new THREE.MeshBasicMaterial({color:0xe13b43,transparent:true,opacity:.9}));
  const objectiveBeam = new THREE.Mesh(new THREE.CylinderGeometry(.035,.18,3.4,12,1,true), new THREE.MeshBasicMaterial({color:0xc52f36,transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false}));
  objectiveBeam.position.y=-1.7;objectiveMarker.add(objectiveDiamond,objectiveBeam);scene.add(objectiveMarker);

  const raycaster = new THREE.Raycaster();
  const centerRay = new THREE.Vector2(0, 0);
  const tmpVec = new THREE.Vector3();
  const tmpVec2 = new THREE.Vector3();

  class AudioEngine {
    constructor(){
      this.ctx = null; this.master = null; this.sfxBus = null; this.ambienceBus = null; this.nextGroan = 0; this.buffers = {}; this.loadingExternal = false; this.cinematicNodes = []; this.lastSpokenText = '';
      this.stepOffsets = [.66,1.11,1.54,2.08,2.58,3.06,3.53,4.02,4.96,5.46,5.91,6.47,6.94,7.33,8.08,9.03,9.48,10.38,12.20,13.47,14.00,15.33,16.08,16.63,17.58,18.10,19.66];
    }
    init(){
      if(this.ctx) return;
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.ctx.createGain(); this.sfxBus = this.ctx.createGain(); this.ambienceBus = this.ctx.createGain();
        this.master.gain.value = (Number(localStorage.getItem('ls-master') || 80) / 100) * 0.82;
        this.sfxBus.gain.value = Number(localStorage.getItem('ls-sfx') || 78) / 100;
        this.ambienceBus.gain.value = Number(localStorage.getItem('ls-ambience') || 62) / 100;
        this.sfxBus.connect(this.master); this.ambienceBus.connect(this.master); this.master.connect(this.ctx.destination);
        this.ambient(); this.loadExternalSounds();
      } catch(_) {}
    }
    resume(){ if(this.ctx?.state === 'suspended') this.ctx.resume(); }
    async loadExternalSounds(){
      if(!this.ctx || this.loadingExternal) return; this.loadingExternal = true;
      const files = {
        shotgunFire: 'assets/audio/weapons/shotgun-fire.mp3',
        footsteps: 'assets/audio/footsteps/footsteps.mp3',
        zombieIdle: 'assets/audio/zombies/idle.mp3',
        zombieAttack: 'assets/audio/zombies/attack.mp3',
        zombieHurt: 'assets/audio/zombies/hurt.mp3',
        generatorStart: 'assets/audio/environment/generator-start.mp3',
        radioStatic: 'assets/audio/environment/radio-static.mp3'
      };
      const embedded=window.__AUDIO_PACK_BASE64__||{};
      await Promise.all(Object.entries(files).map(async ([name,path])=>{
        try {
          let bytes;
          if(embedded[name]){
            const raw=atob(embedded[name]);bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
          }else{
            const r=await fetch(path);if(!r.ok)return;bytes=new Uint8Array(await r.arrayBuffer());
          }
          this.buffers[name]=await this.ctx.decodeAudioData(bytes.buffer.slice(0));
        } catch(err) { console.warn(`[Night One] audio failed: ${name}`,err); }
      }));
      console.info(`[Night One] custom sounds ready: ${Object.keys(this.buffers).length}/${Object.keys(files).length}`);
    }
    playBuffer(name, volume=.35, pan=0, rate=1, offset=0, duration=null){
      if(!this.ctx || !this.buffers[name]) return false;
      const src=this.ctx.createBufferSource(),v=this.ctx.createGain(),p=this.ctx.createStereoPanner?this.ctx.createStereoPanner():null;
      const buffer=this.buffers[name];src.buffer=buffer;src.playbackRate.value=rate;v.gain.value=volume;
      if(p){p.pan.value=THREE.MathUtils.clamp(pan,-1,1);src.connect(v).connect(p).connect(this.sfxBus)}else src.connect(v).connect(this.sfxBus);
      const safeOffset=THREE.MathUtils.clamp(offset,0,Math.max(0,buffer.duration-.03));
      if(duration)src.start(0,safeOffset,Math.min(duration,Math.max(.03,buffer.duration-safeOffset)));else src.start(0,safeOffset);
      return true;
    }
    osc(freq, dur, type='sine', gain=.04, endFreq=null, pan=0){
      if(!this.ctx) return;
      const now=this.ctx.currentTime,o=this.ctx.createOscillator(),v=this.ctx.createGain();
      const p=this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      o.type=type;o.frequency.setValueAtTime(freq,now);if(endFreq)o.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),now+dur);
      v.gain.setValueAtTime(gain,now);v.gain.exponentialRampToValueAtTime(.0001,now+dur);
      if(p){p.pan.value=THREE.MathUtils.clamp(pan,-1,1);o.connect(v).connect(p).connect(this.sfxBus)}else{o.connect(v).connect(this.sfxBus)}
      o.start(now);o.stop(now+dur);
    }
    noise(dur=.1,gain=.05,cut=900,pan=0){
      if(!this.ctx) return;
      const len=Math.max(1,Math.floor(this.ctx.sampleRate*dur)),buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate),data=buf.getChannelData(0);
      for(let i=0;i<len;i++)data[i]=Math.random()*2-1;
      const src=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),v=this.ctx.createGain(),p=this.ctx.createStereoPanner?this.ctx.createStereoPanner():null;
      src.buffer=buf;f.type='lowpass';f.frequency.value=cut;v.gain.setValueAtTime(gain,this.ctx.currentTime);v.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+dur);
      if(p){p.pan.value=THREE.MathUtils.clamp(pan,-1,1);src.connect(f).connect(v).connect(p).connect(this.sfxBus)}else src.connect(f).connect(v).connect(this.sfxBus);
      src.start();
    }
    ambient(){
      if(!this.ctx) return;
      const len=this.ctx.sampleRate*3,buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate),data=buf.getChannelData(0);let last=0;
      for(let i=0;i<len;i++){last=last*.994+(Math.random()*2-1)*.006;data[i]=last}
      const src=this.ctx.createBufferSource(),filter=this.ctx.createBiquadFilter(),v=this.ctx.createGain();src.buffer=buf;src.loop=true;filter.type='lowpass';filter.frequency.value=320;v.gain.value=.085;src.connect(filter).connect(v).connect(this.ambienceBus);src.start();
    }
    step(wet=false,sprint=false){
      const offset=this.stepOffsets[Math.floor(Math.random()*this.stepOffsets.length)];
      if(this.playBuffer('footsteps',sprint?.52:.42,0,sprint?1.16:.98,offset,.42)){
        if(wet){this.noise(.13,.04,760);this.osc(96,.06,'sine',.016,66)}
        return;
      }
      this.noise(wet?.15:.075,sprint?.055:.035,wet?700:430);this.osc(wet?100:68,.07,'sine',sprint?.025:.015,wet?70:48)
    }
    fire(){
      if(this.playBuffer('shotgunFire',.92,0,.98+Math.random()*.035))return;
      this.noise(.2,.19,1450);this.osc(82,.24,'sawtooth',.12,34);setTimeout(()=>this.noise(.12,.075,760),45)
    }
    reload(){this.osc(320,.05,'square',.025,210);setTimeout(()=>this.osc(430,.06,'square',.023,260),450);setTimeout(()=>this.osc(250,.05,'square',.02,180),950)}
    empty(){this.osc(190,.045,'square',.025,110)}
    hit(){this.osc(680,.04,'square',.025,300)}
    hurt(){this.noise(.18,.08,330);this.osc(82,.2,'sawtooth',.04,48)}
    groan(volume=.045,pan=0){
      if(this.playBuffer('zombieIdle',Math.min(.68,volume*8),pan,.88+Math.random()*.18))return;
      this.noise(.48,volume*1.25,240,pan);this.osc(48+Math.random()*18,.62,'sawtooth',volume*.9,28,pan);setTimeout(()=>this.osc(78,.18,'triangle',volume*.35,42,pan),120);
    }
    zombieAlert(volume=.08,pan=0){
      if(this.playBuffer('zombieAttack',Math.min(.72,volume*7),pan,.82+Math.random()*.1))return;
      this.noise(.62,volume*1.4,420,pan);this.osc(82,.55,'sawtooth',volume,34,pan);setTimeout(()=>this.osc(55,.42,'square',volume*.62,29,pan),160);
    }
    zombieAttack(volume=.1,pan=0){
      if(this.playBuffer('zombieAttack',Math.min(.88,volume*7.5),pan,.95+Math.random()*.08))return;
      this.zombieAlert(volume,pan);
    }
    zombieHurt(volume=.1,pan=0,dying=false){
      if(this.playBuffer('zombieHurt',Math.min(.86,volume*7.2),pan,dying?.78:.96))return;
      this.noise(.2,volume,520,pan);this.osc(dying?42:70,.24,'sawtooth',volume*.7,30,pan);
    }
    generatorStart(){
      if(this.playBuffer('generatorStart',.72,0,1))return;
      this.osc(48,.35,'sawtooth',.09,32);setTimeout(()=>this.noise(.5,.08,520),260);setTimeout(()=>this.osc(62,1.2,'sawtooth',.075,88),480);setTimeout(()=>this.osc(118,.18,'square',.035,155),1380);
    }
    radioStart(){
      if(this.playBuffer('radioStatic',.72,0,1))return;
      this.noise(.8,.07,2100);for(let i=0;i<4;i++)setTimeout(()=>this.osc(680+i*90,.09,'square',.04,520+i*70),180+i*210);setTimeout(()=>this.noise(.55,.055,1300),920);
    }
    axeSwing(){this.noise(.12,.055,1450);this.osc(130,.16,'triangle',.035,66)}
    axeHit(){this.noise(.16,.095,720);this.osc(88,.12,'square',.04,46)}
    switchWeapon(){this.osc(280,.05,'square',.024,190);setTimeout(()=>this.osc(420,.05,'square',.018,300),45)}
    startCinematicBed(){
      this.stopCinematic();if(!this.ctx)return;
      const now=this.ctx.currentTime,bed=this.ctx.createGain();bed.gain.value=.18;bed.connect(this.ambienceBus);this.cinematicNodes.push(bed);
      const addDrone=(freq,gain,type='sine')=>{const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.value=gain;o.connect(g).connect(bed);o.start(now);this.cinematicNodes.push(o,g)};
      addDrone(42,.16);addDrone(63,.06,'triangle');
      const len=this.ctx.sampleRate*2,buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate),data=buf.getChannelData(0);let last=0;for(let i=0;i<len;i++){last=last*.992+(Math.random()*2-1)*.008;data[i]=last}
      const src=this.ctx.createBufferSource(),filter=this.ctx.createBiquadFilter(),g=this.ctx.createGain();src.buffer=buf;src.loop=true;filter.type='lowpass';filter.frequency.value=560;g.gain.value=.22;src.connect(filter).connect(g).connect(bed);src.start(now);this.cinematicNodes.push(src,filter,g);
    }
    stopCinematic(){
      if('speechSynthesis' in window)window.speechSynthesis.cancel();
      for(const n of this.cinematicNodes){try{if(typeof n.stop==='function')n.stop()}catch(_){}try{n.disconnect?.()}catch(_){}}this.cinematicNodes=[];this.lastSpokenText='';
    }
    narrate(text,language){
      if(!text||this.lastSpokenText===text||!('speechSynthesis' in window))return;this.lastSpokenText=text;window.speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text);u.lang=language==='ar'?'ar-EG':'en-US';u.rate=.86;u.pitch=.76;u.volume=Math.min(1,Number(localStorage.getItem('ls-ambience')||62)/100+.18);window.speechSynthesis.speak(u);
    }
    objective(){this.osc(420,.11,'sine',.035,650);setTimeout(()=>this.osc(620,.15,'sine',.03,900),110)}
  }
  const audio = new AudioEngine();

  function setLanguage(next){
    lang=next;localStorage.setItem('ls-language',lang);document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    $('startCopy').textContent=t('startCopy');enterGame.textContent=t('enter');alertBadge.textContent=t('detected');$('storyGateKicker').textContent=t('storyGateKicker');$('storyGateTitle').textContent=t('storyGateTitle');$('storyGateCopy').textContent=t('storyGateCopy');startStoryBtn.textContent=t('storyGateButton');updateObjective();updateHUD();updateInventory();
  }

  function canvasTexture(size, paint){
    const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');paint(x,size);const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;return tex;
  }
  const asphaltTex=canvasTexture(512,(x,s)=>{x.fillStyle='#25282a';x.fillRect(0,0,s,s);for(let i=0;i<7000;i++){const v=35+Math.random()*35;x.fillStyle=`rgb(${v},${v},${v})`;x.fillRect(Math.random()*s,Math.random()*s,1+Math.random()*2,1+Math.random()*2)}for(let i=0;i<30;i++){x.strokeStyle='rgba(10,10,10,.35)';x.lineWidth=1+Math.random()*2;x.beginPath();x.moveTo(Math.random()*s,Math.random()*s);x.lineTo(Math.random()*s,Math.random()*s);x.stroke()}});
  asphaltTex.repeat.set(14,34);
  const concreteTex=canvasTexture(256,(x,s)=>{x.fillStyle='#6f7272';x.fillRect(0,0,s,s);for(let i=0;i<900;i++){const v=90+Math.random()*45;x.fillStyle=`rgba(${v},${v},${v},.22)`;x.fillRect(Math.random()*s,Math.random()*s,2,2)}x.strokeStyle='rgba(30,30,30,.25)';x.strokeRect(0,0,s,s)});concreteTex.repeat.set(12,45);
  const wallTex=canvasTexture(256,(x,s)=>{x.fillStyle='#565a5b';x.fillRect(0,0,s,s);for(let y=0;y<s;y+=32){x.strokeStyle='rgba(20,20,20,.3)';x.beginPath();x.moveTo(0,y);x.lineTo(s,y);x.stroke()}for(let i=0;i<700;i++){x.fillStyle=`rgba(20,25,28,${Math.random()*.18})`;x.fillRect(Math.random()*s,Math.random()*s,1+Math.random()*3,1+Math.random()*3)}});wallTex.repeat.set(4,2);
  const barkTex=canvasTexture(128,(x,s)=>{x.fillStyle='#3a2b21';x.fillRect(0,0,s,s);for(let i=0;i<70;i++){x.strokeStyle=`rgba(80,55,35,${.25+Math.random()*.3})`;x.beginPath();const xx=Math.random()*s;x.moveTo(xx,0);x.lineTo(xx+Math.random()*10-5,s);x.stroke()}});

  function mat(params){return new THREE.MeshStandardMaterial(params)}
  const materials={
    asphalt:mat({map:asphaltTex,roughness:.82,metalness:.05}), concrete:mat({map:concreteTex,roughness:.9}), wall:mat({map:wallTex,roughness:.88}),
    dark:mat({color:0x15191b,roughness:.68,metalness:.18}), metal:mat({color:0x353a3d,roughness:.4,metalness:.72}), glass:mat({color:0x28404a,roughness:.16,metalness:.1,transparent:true,opacity:.58}),
    grass:mat({color:0x243128,roughness:1}), dirt:mat({color:0x25231f,roughness:1}), bark:mat({map:barkTex,roughness:1}), leaves:mat({color:0x1d3025,roughness:.95}), red:mat({color:0x5f1519,roughness:.65}),
    lamp:mat({color:0xffd7a3,emissive:0xffb45e,emissiveIntensity:5}), water:new THREE.MeshPhysicalMaterial({color:0x263c45,roughness:.08,metalness:.2,transparent:true,opacity:.72,clearcoat:1,clearcoatRoughness:.08})
  };

  function mesh(geo, material, x=0,y=0,z=0, cast=true, receive=true){
    const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=receive;scene.add(m);return m;
  }
  function addBox(x,y,z,w,h,d,material=materials.wall,collider=true){
    const m=mesh(new THREE.BoxGeometry(w,h,d),material,x,y,z,true,true);if(collider){obstacles.push({minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});obstacleMeshes.push(m)}return m;
  }

  function buildLights(){
    scene.add(new THREE.HemisphereLight(0x557080,0x11100d,.55));
    const moonLight=new THREE.DirectionalLight(0x9fc8e5,1.45);moonLight.position.set(-24,35,18);moonLight.castShadow=true;moonLight.shadow.mapSize.set(2048,2048);moonLight.shadow.camera.left=-85;moonLight.shadow.camera.right=85;moonLight.shadow.camera.top=95;moonLight.shadow.camera.bottom=-95;moonLight.shadow.camera.near=1;moonLight.shadow.camera.far=180;moonLight.shadow.bias=-.0005;scene.add(moonLight);
    const moon=mesh(new THREE.SphereGeometry(2.4,24,16),new THREE.MeshBasicMaterial({color:0xd8e6ed}),-32,42,-75,false,false);moon.material.fog=false;
    for(const [x,z,on] of [[-7,24,true],[7,11,false],[-7,-3,true],[7,-17,true],[-7,-31,false]]){
      addBox(x,2.7,z,.16,5.4,.16,materials.metal,false);addBox(x,5.34,z,.7,.12,.3,materials.metal,false);
      const bulb=mesh(new THREE.SphereGeometry(.11,12,8),on?materials.lamp:materials.dark,x+(x<0?.28:-.28),5.18,z,false,false);
      if(on){const l=new THREE.PointLight(0xffbd76,14,17,2);l.position.copy(bulb.position);l.castShadow=true;l.shadow.mapSize.set(512,512);scene.add(l)}
    }
    const redEmergency=new THREE.PointLight(0xd32a34,8,14,2);redEmergency.position.set(0,4.6,-46);scene.add(redEmergency);
  }

  function createTree(x,z,s=1){
    const trunk=mesh(new THREE.CylinderGeometry(.18*s,.28*s,3.2*s,8),materials.bark,x,1.6*s,z,true,true);obstacles.push({minX:x-.25*s,maxX:x+.25*s,minZ:z-.25*s,maxZ:z+.25*s});obstacleMeshes.push(trunk);
    const crown=new THREE.Group();for(let i=0;i<4;i++){const c=new THREE.Mesh(new THREE.IcosahedronGeometry((1.1+Math.random()*.4)*s,1),materials.leaves);c.position.set((Math.random()-.5)*.7*s,3.2*s+Math.random()*1.1*s,(Math.random()-.5)*.7*s);c.castShadow=true;c.receiveShadow=true;crown.add(c)}scene.add(crown);crown.position.set(x,0,z);
  }

  function createVehicle(x,z,rot=0,color=0x1b252a){
    const root=new THREE.Group();root.position.set(x,0,z);root.rotation.y=rot;scene.add(root);
    const carMat=mat({color,roughness:.62,metalness:.28});const body=new THREE.Mesh(new THREE.BoxGeometry(1.9,.7,4.2),carMat);body.position.y=.67;body.castShadow=body.receiveShadow=true;root.add(body);
    const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.65,.7,2.1),materials.glass);cabin.position.set(0,1.2,-.2);cabin.castShadow=true;root.add(cabin);
    const wheelGeo=new THREE.CylinderGeometry(.38,.38,.28,14);for(const sx of [-1,1])for(const sz of [-1.25,1.25]){const w=new THREE.Mesh(wheelGeo,materials.dark);w.rotation.z=Math.PI/2;w.position.set(sx*.95,.38,sz);w.castShadow=true;root.add(w)}
    const halfW=Math.abs(Math.cos(rot))*1.1+Math.abs(Math.sin(rot))*2.2,halfD=Math.abs(Math.sin(rot))*1.1+Math.abs(Math.cos(rot))*2.2;obstacles.push({minX:x-halfW,maxX:x+halfW,minZ:z-halfD,maxZ:z+halfD});root.traverse(o=>{if(o.isMesh)obstacleMeshes.push(o)});return root;
  }

  function createBarricade(x,z,rot=0){
    const root=new THREE.Group();root.position.set(x,0,z);root.rotation.y=rot;scene.add(root);
    for(const yy of [.55,1.15]){const plank=new THREE.Mesh(new THREE.BoxGeometry(3.4,.28,.22),materials.red);plank.position.y=yy;plank.castShadow=true;root.add(plank)}
    for(const xx of [-1.4,1.4]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.18,1.7,.18),materials.metal);leg.position.set(xx,.75,0);leg.castShadow=true;root.add(leg)}
    obstacles.push({minX:x-1.8,maxX:x+1.8,minZ:z-.45,maxZ:z+.45});root.traverse(o=>{if(o.isMesh)obstacleMeshes.push(o)});
  }

  function createBuilding(x,z,w,d,h,lit=false){
    const building=addBox(x,h/2,z,w,h,d,materials.wall,true);
    const door=new THREE.Mesh(new THREE.BoxGeometry(1.35,2.5,.08),materials.dark);door.position.set(x,1.25,z+(d/2+.045)*(z<0?1:-1));door.castShadow=true;scene.add(door);
    const side=z<0?1:-1;for(let yy=2.4;yy<h-1;yy+=2.5)for(let xx=x-w/2+1.2;xx<x+w/2-1;xx+=2.2){const winMat=lit&&Math.random()>.65?materials.lamp:materials.glass;const win=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.9),winMat);win.position.set(xx,yy,z+side*(d/2+.052));win.rotation.y=side>0?0:Math.PI;scene.add(win)}
    return building;
  }

  function createPuddle(x,z,r=.9){
    const p=new THREE.Mesh(new THREE.CircleGeometry(r,32),materials.water);p.rotation.x=-Math.PI/2;p.position.set(x,.023,z);p.receiveShadow=true;scene.add(p);puddles.push({x,z,r});
  }

  function createDistantBuilding(x,z,w,d,h,tone=0x171b1d){
    const m=mesh(new THREE.BoxGeometry(w,h,d),mat({color:tone,roughness:.96}),x,h/2,z,false,true);
    m.castShadow=false;m.receiveShadow=true;return m;
  }

  function createRubbleMound(x,z,s=1){
    const root=new THREE.Group();root.position.set(x,0,z);scene.add(root);
    for(let i=0;i<7;i++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry((.32+Math.random()*.55)*s,0),materials.concrete);r.scale.y=.45+Math.random()*.4;r.position.set((Math.random()-.5)*2.8*s,.15+Math.random()*.28*s,(Math.random()-.5)*2.3*s);r.rotation.set(Math.random(),Math.random(),Math.random());r.castShadow=r.receiveShadow=true;root.add(r)}
    obstacles.push({minX:x-1.8*s,maxX:x+1.8*s,minZ:z-1.5*s,maxZ:z+1.5*s});root.traverse(o=>{if(o.isMesh)obstacleMeshes.push(o)});
  }

  function buildWorld(){
    // Oversized terrain and distant scenery hide every visible map edge.
    const base=mesh(new THREE.PlaneGeometry(420,420),materials.dirt,0,-.018,-10,false,true);base.rotation.x=-Math.PI/2;
    const road=mesh(new THREE.PlaneGeometry(28,210),materials.asphalt,0,0,-10,false,true);road.rotation.x=-Math.PI/2;
    const crossRoad=mesh(new THREE.PlaneGeometry(130,20),materials.asphalt,0,.006,10,false,true);crossRoad.rotation.x=-Math.PI/2;
    const lowerCross=mesh(new THREE.PlaneGeometry(92,16),materials.asphalt,8,.008,-31,false,true);lowerCross.rotation.x=-Math.PI/2;
    const leftWalk=mesh(new THREE.PlaneGeometry(7,210),materials.concrete,-17.5,.018,-10,false,true);leftWalk.rotation.x=-Math.PI/2;
    const rightWalk=mesh(new THREE.PlaneGeometry(7,210),materials.concrete,17.5,.018,-10,false,true);rightWalk.rotation.x=-Math.PI/2;
    const lineMat=new THREE.MeshBasicMaterial({color:0x8c866d,transparent:true,opacity:.25});
    for(let z=-105;z<96;z+=8){const l=mesh(new THREE.PlaneGeometry(.15,3.7),lineMat,0,.025,z,false,false);l.rotation.x=-Math.PI/2}
    for(let z=-88;z<=80;z+=10){addBox(-14.1,.18,z,.28,.36,2.6,materials.concrete,false);addBox(14.1,.18,z,.28,.36,2.6,materials.concrete,false)}

    // Main playable district and side streets.
    createBuilding(-25,-22,13,14,10,true);createBuilding(25,-27,14,15,14,false);createBuilding(-26,10,14,17,12,false);createBuilding(26,17,14,16,9,true);createBuilding(-25,39,13,13,8,false);createBuilding(27,43,15,12,11,false);
    createBuilding(-41,10,14,14,10,false);createBuilding(43,9,15,14,12,true);createBuilding(-42,-31,16,14,11,false);createBuilding(42,-32,14,14,8,false);
    addBox(0,2.8,-49,24,5.6,3.2,materials.dark,true); // station facade
    const sign=mesh(new THREE.BoxGeometry(8,.8,.18),materials.red,0,4.5,-47.32,true,true);sign.material.emissive=new THREE.Color(0x4a090c);sign.material.emissiveIntensity=1.4;
    createVehicle(-5.5,18,.18,0x20272a);createVehicle(6.7,-9,-.35,0x3b2222);createVehicle(-5,-29,.1,0x283128);createVehicle(28,8,Math.PI/2,0x24292b);createVehicle(-31,11,Math.PI/2,0x303026);
    createBarricade(0,8,.04);createBarricade(-4.3,7.2,.45);createBarricade(36,-31,Math.PI/2);
    createRubbleMound(-47,26,1.5);createRubbleMound(48,28,1.6);createRubbleMound(-38,-55,1.7);createRubbleMound(39,-58,1.5);
    for(const [x,z,r] of [[-2,25,1.3],[4.4,21,.85],[-5.4,2,1.05],[2.6,-15,1.5],[-4.3,-34,.9],[7.1,-5,.65],[28,12,1.4],[-32,14,1.2],[19,-35,.9]])createPuddle(x,z,r);

    // Dense natural perimeter: the player never sees a hard rectangular boundary.
    for(let i=0;i<92;i++){
      const a=(i/92)*Math.PI*2+(Math.random()-.5)*.07;
      const rx=69+Math.random()*10,rz=91+Math.random()*13;
      const x=Math.cos(a)*rx,z=-4+Math.sin(a)*rz;
      createTree(x,z,.85+Math.random()*.8);
      if(i%3===0)createTree(x+Math.cos(a)*4+(Math.random()-.5)*3,z+Math.sin(a)*4+(Math.random()-.5)*3,.7+Math.random()*.65);
    }
    for(let i=0;i<42;i++){const side=i%2?-1:1;const x=side*(28+Math.random()*26),z=-65+Math.random()*130;createTree(x,z,.65+Math.random()*.65)}

    // Distant skyline and hills extend the world beyond the playable area.
    for(let i=0;i<34;i++){
      const side=i%2?-1:1,x=side*(82+Math.random()*75),z=-120+Math.random()*230;
      createDistantBuilding(x,z,12+Math.random()*24,12+Math.random()*20,10+Math.random()*30,i%3?0x15191b:0x1b2022);
    }
    const hillMat=mat({color:0x111816,roughness:1});
    for(let i=0;i<18;i++){const a=(i/18)*Math.PI*2,r=145+Math.random()*28;const h=24+Math.random()*32;const hill=mesh(new THREE.ConeGeometry(34+Math.random()*24,h,7),hillMat,Math.cos(a)*r,h/2-2,-10+Math.sin(a)*r,false,true);hill.rotation.y=Math.random()*Math.PI}

    // Generator and transmitter.
    const generator=new THREE.Group();generator.name='generator';generator.position.set(-16.4,0,-2);scene.add(generator);
    const gbody=new THREE.Mesh(new THREE.BoxGeometry(1.8,1.25,1.25),materials.metal);gbody.position.y=.68;gbody.castShadow=true;generator.add(gbody);const panel=new THREE.Mesh(new THREE.BoxGeometry(1.15,.48,.08),materials.dark);panel.position.set(0,.78,.67);generator.add(panel);const lamp=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),materials.red);lamp.position.set(.38,.84,.73);generator.add(lamp);generator.userData.lamp=lamp;obstacles.push({minX:-17.3,maxX:-15.5,minZ:-2.7,maxZ:-1.3});generator.traverse(o=>{if(o.isMesh)obstacleMeshes.push(o)});scene.userData.generator=generator;
    const tower=new THREE.Group();tower.name='radio';tower.position.set(0,0,-44.5);scene.add(tower);for(const yy of [1,2,3,4,5]){const bar=new THREE.Mesh(new THREE.BoxGeometry(3.5,.12,.12),materials.metal);bar.position.y=yy;tower.add(bar)}for(const xx of [-1.7,1.7]){const pole=new THREE.Mesh(new THREE.BoxGeometry(.14,6,.14),materials.metal);pole.position.set(xx,3,0);tower.add(pole)}const beacon=new THREE.Mesh(new THREE.SphereGeometry(.13,12,8),materials.red);beacon.position.y=6.1;tower.add(beacon);tower.userData.beacon=beacon;scene.userData.radio=tower;
    buildLights();
  }

  function buildPlayerBody(){
    bodyRoot.clear();
    const pants=mat({color:0x20272a,roughness:.88});const boot=mat({color:0x111314,roughness:.95});const gear=mat({color:0x283129,roughness:.82});
    const hip=new THREE.Mesh(new THREE.BoxGeometry(.55,.32,.28),gear);hip.position.set(0,.88,.02);hip.castShadow=true;bodyRoot.add(hip);
    for(const side of [-1,1]){
      const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.13,.7,5,8),pants);leg.position.set(side*.19,.42,.02);leg.castShadow=true;bodyRoot.add(leg);
      const foot=new THREE.Mesh(new THREE.BoxGeometry(.27,.2,.48),boot);foot.position.set(side*.19,.12,-.13);foot.castShadow=true;bodyRoot.add(foot);
    }
    bodyRoot.userData.fallback=true;
  }

  function makeViewMaterial(params){
    const m=mat(params);m.depthTest=false;m.depthWrite=false;return m;
  }

  function buildFallbackHatchet(){
    if(hatchetView)hatchetView.removeFromParent();
    hatchetView=new THREE.Group();hatchetView.name='HatchetView';hatchetView.visible=false;weaponRoot.add(hatchetView);
    hatchetView.position.set(.12,-.02,-.08);hatchetView.rotation.set(-.12,.08,-.72);
    const wood=makeViewMaterial({color:0x4b2d1b,roughness:.88});
    const steel=makeViewMaterial({color:0x40464a,roughness:.38,metalness:.72});
    const glove=makeViewMaterial({color:0x111315,roughness:.95});
    const sleeve=makeViewMaterial({color:0x191d1f,roughness:.96});
    const handle=new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,.8,10),wood);handle.rotation.z=Math.PI/2;handle.position.set(.03,-.02,-.2);hatchetView.add(handle);
    const head=new THREE.Mesh(new THREE.BoxGeometry(.25,.17,.08),steel);head.position.set(-.39,.02,-.2);head.rotation.z=.08;hatchetView.add(head);
    const blade=new THREE.Mesh(new THREE.ConeGeometry(.13,.24,4),steel);blade.rotation.z=-Math.PI/2;blade.position.set(-.53,.02,-.2);hatchetView.add(blade);
    const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.064,.44,6,10),sleeve);arm.position.set(.31,-.29,.04);arm.rotation.set(-1.15,0,.36);hatchetView.add(arm);
    const hand=new THREE.Mesh(new THREE.CapsuleGeometry(.058,.11,5,9),glove);hand.position.set(.15,-.08,-.16);hand.rotation.set(-1.17,0,.35);hatchetView.add(hand);
    hatchetView.traverse(o=>{if(o.isMesh){o.renderOrder=12;o.castShadow=false;o.receiveShadow=false}});
  }

  function buildWeapon(){
    weaponRoot.clear();weaponRoot.position.set(.30,-.39,-.78);weaponRoot.rotation.set(-.055,-.025,-.012);weaponRoot.userData.baseX=.30;weaponRoot.userData.baseY=-.39;weaponRoot.userData.baseZ=-.78;weaponRoot.userData.baseRotationX=-.055;
    shotgunView=new THREE.Group();shotgunView.name='ShotgunView';weaponRoot.add(shotgunView);
    const gun=makeViewMaterial({color:0x20262a,roughness:.32,metalness:.78});const grip=makeViewMaterial({color:0x15191b,roughness:.8});const accent=makeViewMaterial({color:0x4f1a1d,roughness:.55,metalness:.25});
    const receiver=new THREE.Mesh(new THREE.BoxGeometry(.13,.16,.62),gun);receiver.position.z=-.16;shotgunView.add(receiver);
    const stock=new THREE.Mesh(new THREE.BoxGeometry(.12,.16,.36),grip);stock.position.set(0,-.015,.30);shotgunView.add(stock);
    const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.025,.035,.64,10),gun);barrel.rotation.x=Math.PI/2;barrel.position.set(0,.025,-.77);shotgunView.add(barrel);
    const handguard=new THREE.Mesh(new THREE.BoxGeometry(.12,.13,.36),accent);handguard.position.z=-.48;shotgunView.add(handguard);
    const mag=new THREE.Mesh(new THREE.BoxGeometry(.1,.28,.18),grip);mag.position.set(0,-.2,-.11);mag.rotation.x=-.16;shotgunView.add(mag);
    const sight=new THREE.Mesh(new THREE.BoxGeometry(.08,.09,.16),gun);sight.position.set(0,.13,-.25);shotgunView.add(sight);
    const skin=makeViewMaterial({color:0x8b644a,roughness:.82});for(const side of [-1,1]){const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.07,.47,5,8),skin);arm.position.set(side*.19,-.16,-.18);arm.rotation.z=side*.23;arm.rotation.x=-1.12;shotgunView.add(arm)}
    const muzzle=new THREE.PointLight(0xffb15a,0,7,2);muzzle.position.set(0,.02,-1.1);shotgunView.add(muzzle);shotgunView.userData.muzzle=muzzle;weaponRoot.userData.muzzle=muzzle;
    shotgunView.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false;o.renderOrder=10}});shotgunView.userData.fallback=true;
    buildFallbackHatchet();applyWeaponVisibility();
  }

  function applyWeaponVisibility(){
    if(shotgunView)shotgunView.visible=state.weapon==='shotgun';
    if(hatchetView)hatchetView.visible=state.weapon==='hatchet';
    weaponRoot.userData.muzzle=state.weapon==='shotgun'?shotgunView?.userData.muzzle:null;
  }

  function createZombieModel(index=0){
    const root=new THREE.Group();
    const skinColors=[0x777769,0x6b746c,0x75635d];const clothColors=[0x303638,0x3a2d2d,0x273127];
    const skin=mat({color:skinColors[index%skinColors.length],roughness:.92});const cloth=mat({color:clothColors[index%clothColors.length],roughness:.95});const dark=mat({color:0x171a1b,roughness:.9});
    const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.28,.65,6,10),cloth);torso.position.y=1.2;torso.castShadow=true;root.add(torso);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.25,14,10),skin);head.scale.set(.88,1.08,.9);head.position.set(.04,1.87,.02);head.castShadow=true;root.add(head);
    const jaw=new THREE.Mesh(new THREE.BoxGeometry(.28,.12,.22),skin);jaw.position.set(.04,1.72,-.11);jaw.rotation.x=.12;root.add(jaw);
    const eyes=mat({color:0x5f0c0f,emissive:0xd31920,emissiveIntensity:1.8});for(const sx of [-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(.025,8,6),eyes);e.position.set(.04+sx*.085,1.91,-.218);root.add(e)}
    const limbs={arms:[],legs:[]};for(const side of [-1,1]){
      const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.09,.75,5,8),skin);arm.position.set(side*.39,1.22,0);arm.rotation.z=side*.14;arm.castShadow=true;root.add(arm);limbs.arms.push(arm);
      const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.115,.72,5,8),dark);leg.position.set(side*.16,.47,0);leg.castShadow=true;root.add(leg);limbs.legs.push(leg);
      const foot=new THREE.Mesh(new THREE.BoxGeometry(.22,.16,.4),dark);foot.position.set(side*.16,.1,-.12);foot.castShadow=true;root.add(foot);
    }
    root.userData.parts=limbs;root.userData.head=head;root.traverse(o=>{if(o.isMesh){o.userData.zombieRoot=root;o.receiveShadow=true}});return root;
  }

  function zombieRootIndex(name=''){
    const m=name.match(/(\d+)$/);return m?Number(m[1])+1:0;
  }

  function findZombieRigRoots(root){
    const roots=[];root.traverse(o=>{if(/^rig_CharRoot\d*$/.test(o.name))roots.push(o)});
    roots.sort((a,b)=>zombieRootIndex(a.name)-zombieRootIndex(b.name));return roots;
  }

  function trackTargetName(trackName=''){
    const dot=trackName.lastIndexOf('.');let target=dot>=0?trackName.slice(0,dot):trackName;
    const slash=target.lastIndexOf('/');if(slash>=0)target=target.slice(slash+1);return target;
  }

  function prepareZombiePack(gltf){
    const sourceRoots=findZombieRigRoots(gltf.scene);if(!sourceRoots.length)return [];
    const templates=[];
    for(let i=0;i<sourceRoots.length;i++){
      const full=cloneSkeleton(gltf.scene),roots=findZombieRigRoots(full),selected=roots[i];if(!selected)continue;
      const rootNode=full.getObjectByName('RootNode');
      if(rootNode){[...rootNode.children].forEach(child=>{if(child!==selected)rootNode.remove(child)})}
      selected.position.set(0,0,0);
      const names=new Set();selected.traverse(o=>{if(o.name)names.add(o.name)});
      const clips=(gltf.animations||[]).map((clip,clipIndex)=>{
        // The source pack stores every character far apart and animates each rig root
        // back to that showcase position. Remove root-position tracks so spawned
        // zombies stay at the gameplay spawn point instead of jumping off-map.
        const tracks=clip.tracks.filter(track=>{
          const target=trackTargetName(track.name);
          if(!names.has(target))return false;
          if(target===selected.name&&/\.position$/i.test(track.name))return false;
          return true;
        }).map(track=>track.clone());
        return tracks.length?new THREE.AnimationClip(`infected_${clipIndex+1}`,clip.duration,tracks):null;
      }).filter(Boolean);
      full.updateMatrixWorld(true);
      let box=new THREE.Box3().setFromObject(full),size=box.getSize(new THREE.Vector3());
      if(Number.isFinite(size.y)&&size.y>.05){full.scale.multiplyScalar(1.82/size.y);full.updateMatrixWorld(true);box=new THREE.Box3().setFromObject(full)}
      const wrapper=new THREE.Group();wrapper.name=`ZombieVariant_${String(i+1).padStart(2,'0')}`;wrapper.add(full);full.position.y-=box.min.y;
      wrapper.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=true}});
      templates.push({scene:wrapper,animations:clips,name:selected.name});
    }
    return templates;
  }

  function spawnZombie(x,z,index=0,wave=false){
    const template=assetTemplates.zombies.length?assetTemplates.zombies[index%assetTemplates.zombies.length]:null;
    const model=template?cloneSkeleton(template.scene):createZombieModel(index);model.position.set(x,0,z);scene.add(model);
    model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.userData.zombieIndex=zombies.length}});
    const zombie={model,x,z,hp:100,alive:true,alerted:wave,state:wave?'chase':'idle',lastAnim:'',speed:1.18+Math.random()*.28,angle:Math.random()*Math.PI*2,walkPhase:Math.random()*10,lastAttack:0,nextGroan:performance.now()+700+Math.random()*2600,hitUntil:0,deathTime:0,wave,mixer:null,actions:{},genericAction:null,variant:template?.name||'fallback'};
    if(template?.animations?.length){
      zombie.mixer=new THREE.AnimationMixer(model);mixers.push(zombie.mixer);
      for(const clip of template.animations){const key=clip.name.toLowerCase();const action=zombie.mixer.clipAction(clip);action.setLoop(THREE.LoopRepeat,Infinity);zombie.actions[key]=action}
      const first=template.animations[0],action=zombie.mixer.clipAction(first);action.reset().play();zombie.lastAnim=first.name.toLowerCase();
      if(template.animations.length===1&&!/(idle|walk|run|attack|death|die)/i.test(first.name))zombie.genericAction=action;
    }
    zombies.push(zombie);return zombie;
  }

  function spawnInitialZombies(){
    // One infected is deliberately placed in the player's first visible street
    // so the imported model can be confirmed immediately after the cinematic.
    [[0.5,23],[6.5,9],[-7,-10],[5,-24],[11,-34]].forEach((p,i)=>{
      const z=spawnZombie(p[0],p[1],i,false);
      if(i===0){z.angle=Math.PI;z.model.rotation.y=z.angle;}
    });
  }
  function spawnWave(){
    [[-7,5],[7,1],[-5,-6],[6,-11],[-6,-18],[7,-23],[0,-29]].forEach((p,i)=>spawnZombie(p[0],p[1],i,true));
    state.stage=2;showSubtitle('mara','subtitle4',4400);audio.objective();updateObjective();saveCheckpoint();
  }

  function buildRain(){
    const count=1800,pos=new Float32Array(count*3);for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*90;pos[i*3+1]=Math.random()*32;pos[i*3+2]=(Math.random()-.5)*100}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));const rain=new THREE.Points(geo,new THREE.PointsMaterial({color:0xa7bec8,size:.045,transparent:true,opacity:.38,depthWrite:false}));scene.add(rain);scene.userData.rain=rain;
  }

  function inPuddle(x,z){return puddles.some(p=>(x-p.x)**2+(z-p.z)**2<p.r*p.r)}
  function blocked(x,z,r=.36){
    const nx=x/57,nz=(z+5)/76;
    const edge=nx*nx+nz*nz;
    const organic=1+.045*Math.sin(z*.13)+.035*Math.cos(x*.17);
    if(edge>organic)return true;
    for(const o of obstacles)if(x+r>o.minX&&x-r<o.maxX&&z+r>o.minZ&&z-r<o.maxZ)return true;
    return false;
  }
  function movePlayer(dx,dz){const nx=player.position.x+dx,nz=player.position.z+dz;if(!blocked(nx,player.position.z))player.position.x=nx;if(!blocked(player.position.x,nz))player.position.z=nz}
  function hasLineOfSight(from,to){
    tmpVec.subVectors(to,from);const distance=tmpVec.length();tmpVec.normalize();raycaster.set(from,tmpVec);raycaster.far=distance;const hits=raycaster.intersectObjects(obstacleMeshes,false);return !hits.length||hits[0].distance>distance-.4;
  }
  function angleToPlayer(z){tmpVec.set(player.position.x-z.model.position.x,0,player.position.z-z.model.position.z);const desired=Math.atan2(tmpVec.x,tmpVec.z);return desired}
  function distXZ(a,b){const dx=a.x-b.x,dz=a.z-b.z;return Math.hypot(dx,dz)}

  function updatePlayer(dt,now){
    if(state.mode!=='playing')return;
    let f=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0),s=(keys.KeyD?1:0)-(keys.KeyA?1:0);const m=Math.hypot(f,s);if(m>1){f/=m;s/=m}
    state.sprinting=!!(keys.ShiftLeft||keys.ShiftRight)&&f>0&&state.stamina>1;
    const speed=state.sprinting?5.35:3.05;if(state.sprinting)state.stamina=Math.max(0,state.stamina-dt*23);else state.stamina=Math.min(100,state.stamina+dt*(f||s?9:16));
    const sin=Math.sin(player.rotation.y),cos=Math.cos(player.rotation.y);const dx=(s*cos-f*sin)*speed*dt,dz=(-s*sin-f*cos)*speed*dt;
    if(f||s)movePlayer(dx,dz);
    const moved=distXZ(player.position,state.lastPosition);if(moved>.001){state.stepDistance+=moved;const threshold=state.sprinting?1.35:1.72;if(state.stepDistance>threshold){state.stepDistance=0;audio.step(inPuddle(player.position.x,player.position.z),state.sprinting)}}state.lastPosition.copy(player.position);
    const moving=(f||s)?1:0;const bob=now*.012*(state.sprinting?1.6:1);const bobAmount=moving*(state.sprinting?.025:.014);camera.position.y=1.68+Math.sin(bob)*bobAmount;const baseX=weaponRoot.userData.baseX??.37,baseY=weaponRoot.userData.baseY??-.36;weaponRoot.position.x=baseX+Math.sin(bob*.5)*bobAmount*1.7;weaponRoot.position.y=baseY+Math.abs(Math.cos(bob))*bobAmount*1.2;
    bodyRoot.children.forEach((o,i)=>{if(o.geometry?.type==='CapsuleGeometry'||o.geometry?.type==='BoxGeometry'){if(i>0)o.rotation.x=Math.sin(bob+(i%2?0:Math.PI))*moving*.12}});
    updateStages();
  }

  function updateStages(){
    if(state.stage===0&&player.position.z<11){state.stage=1;showSubtitle('radio','subtitle2',3800);updateObjective();audio.objective()}
    if(state.stage===3&&player.position.z<-40){state.stage=4;updateObjective();showSubtitle('mara','subtitle6',4300)}
  }

  function playZombieAnimation(z,name){
    if(!z.mixer||!Object.keys(z.actions).length)return;
    if(z.genericAction){
      if(name==='death'){z.genericAction.paused=true;return}
      z.genericAction.paused=false;z.genericAction.enabled=true;z.genericAction.timeScale=name==='attack'?1.35:name==='chase'?1.05:.28;
      if(!z.genericAction.isRunning())z.genericAction.play();return;
    }
    const candidates={idle:['idle'],chase:['run','jog','walk'],attack:['attack','bite','hit'],death:['death','die','fall']}[name]||[name];
    let next=null,nextName='';
    for(const wanted of candidates){const key=Object.keys(z.actions).find(k=>k.includes(wanted));if(key){next=z.actions[key];nextName=key;break}}
    if(!next||z.lastAnim===nextName)return;const prev=z.actions[z.lastAnim];if(prev)prev.fadeOut(.18);next.reset().fadeIn(.18).play();z.lastAnim=nextName;
  }

  function updateZombies(dt,now){
    let anyDetected=false;const eye=new THREE.Vector3(player.position.x,1.55,player.position.z);
    for(let i=0;i<zombies.length;i++){
      const z=zombies[i];if(!z.alive){playZombieAnimation(z,'death');const elapsed=(now-z.deathTime)/1000;z.model.rotation.z=THREE.MathUtils.lerp(z.model.rotation.z,Math.PI*.48,Math.min(1,dt*4));z.model.position.y=Math.max(-.42,-elapsed*.35);continue}
      const d=distXZ(player.position,z.model.position),toPlayer=angleToPlayer(z),angleDiff=Math.abs(THREE.MathUtils.euclideanModulo(toPlayer-z.angle+Math.PI,Math.PI*2)-Math.PI);
      if(!z.alerted&&d<15.5&&angleDiff<THREE.MathUtils.degToRad(52)&&hasLineOfSight(new THREE.Vector3(z.model.position.x,1.55,z.model.position.z),eye)){
        z.alerted=true;z.state='chase';const rel=Math.atan2(z.model.position.x-player.position.x,z.model.position.z-player.position.z)-player.rotation.y;audio.zombieAlert(THREE.MathUtils.clamp(.095*(1-d/22),.035,.09),Math.sin(rel));z.nextGroan=now+900+Math.random()*900;
      }
      if(z.alerted&&d>28){z.alerted=false;z.state='idle'}
      if(z.alerted){anyDetected=true;z.state=d<1.28?'attack':'chase';playZombieAnimation(z,z.state);z.angle=THREE.MathUtils.lerp(z.angle,toPlayer,Math.min(1,dt*3.2));z.model.rotation.y=z.angle;
        if(z.state==='chase'){const nx=z.model.position.x+Math.sin(z.angle)*z.speed*dt,nz=z.model.position.z+Math.cos(z.angle)*z.speed*dt;if(!blocked(nx,z.model.position.z,.28))z.model.position.x=nx;if(!blocked(z.model.position.x,nz,.28))z.model.position.z=nz}
        else if(now-z.lastAttack>1050){
          z.lastAttack=now;const rel=Math.atan2(z.model.position.x-player.position.x,z.model.position.z-player.position.z)-player.rotation.y;
          audio.zombieAttack(THREE.MathUtils.clamp(.12*(1-d/8),.06,.12),Math.sin(rel));damagePlayer(7+Math.floor(Math.random()*4))
        }
      }else{
        z.state='idle';playZombieAnimation(z,'idle');z.angle+=Math.sin(now*.00035+z.walkPhase)*dt*.18;z.model.rotation.y=z.angle;if(Math.sin(now*.0002+z.walkPhase)>.72){const nx=z.model.position.x+Math.sin(z.angle)*.28*dt,nz=z.model.position.z+Math.cos(z.angle)*.28*dt;if(!blocked(nx,nz,.28)){z.model.position.x=nx;z.model.position.z=nz}}
      }
      const phase=now*.006*(z.state==='chase'?1.7:.45)+z.walkPhase;const parts=z.model.userData.parts;if(parts){parts.arms.forEach((a,j)=>a.rotation.x=Math.sin(phase+(j?Math.PI:0))*(z.state==='attack'?.7:.38)-.12);parts.legs.forEach((l,j)=>l.rotation.x=Math.sin(phase+(j?Math.PI:0))*(z.state==='chase'?.55:.18))}
      if(now>z.nextGroan&&d<30){const rel=Math.atan2(z.model.position.x-player.position.x,z.model.position.z-player.position.z)-player.rotation.y;audio.groan(THREE.MathUtils.clamp((z.alerted?.075:.05)*(1-d/34),.012,.07),Math.sin(rel));z.nextGroan=now+(z.alerted?1100+Math.random()*2100:2200+Math.random()*4300)}
      if(z.hitUntil>now)z.model.traverse(o=>{if(o.isMesh&&o.material?.emissive)o.material.emissiveIntensity=1.8});
    }
    state.detected=anyDetected;alertBadge.classList.toggle('show',anyDetected);
    if(state.stage===2){const remain=zombies.filter(z=>z.alive&&z.wave).length;missionState.textContent=`${t('wave')}: ${remain}`;if(remain===0){state.stage=3;missionState.textContent='';showSubtitle('mara','subtitle5',4300);audio.objective();updateObjective();saveCheckpoint()}}
  }

  function damagePlayer(amount){
    if(state.mode!=='playing'||state.gameEnded)return;state.health=Math.max(0,state.health-amount);damageFlash.classList.add('show');setTimeout(()=>damageFlash.classList.remove('show'),130);audio.hurt();updateHUD();if(state.health<=0){state.gameEnded=true;state.mode='result';document.exitPointerLock?.();setTimeout(()=>showResult(false),650)}
  }

  function switchWeapon(next, silent=false){
    if(!['shotgun','hatchet'].includes(next)||state.weapon===next||state.reloading||state.axeSwinging)return;
    state.weaponSwitching=true;state.weapon=next;applyWeaponVisibility();
    if(!silent)audio.switchWeapon();updateHUD();
    setTimeout(()=>state.weaponSwitching=false,180);
  }

  function updateInventory(){
    inventoryShotgun?.classList.toggle('equipped',state.weapon==='shotgun');inventoryHatchet?.classList.toggle('equipped',state.weapon==='hatchet');
    if($('bagAmmo'))$('bagAmmo').textContent=lang==='ar'?`${state.reserve} طلقة شوتجان`:`${state.reserve} SHOTGUN SHELLS`;
    if($('bagHealth'))$('bagHealth').textContent=`${Math.ceil(state.health)}%`;
    if($('bagKicker'))$('bagKicker').textContent=lang==='ar'?'تجهيزات الناجي':'SURVIVOR LOADOUT';
    if($('bagTitle'))$('bagTitle').textContent=lang==='ar'?'الحقيبة':'BACKPACK';
    if($('bagHint'))$('bagHint').textContent=lang==='ar'?'اضغط 1 أو 2 لاختيار السلاح · اضغط B للإغلاق':'Press 1 or 2 to equip · Press B to close';
  }

  function openInventory(){
    if(state.mode!=='playing')return;state.mode='inventory';state.inventoryOpen=true;updateInventory();inventoryOverlay.classList.remove('hidden');document.exitPointerLock?.();
  }
  function closeInventory(){
    if(state.mode!=='inventory')return;state.inventoryOpen=false;inventoryOverlay.classList.add('hidden');state.mode='playing';canvas.requestPointerLock?.();state.lastTime=performance.now();
  }
  function toggleInventory(){if(state.mode==='playing')openInventory();else if(state.mode==='inventory')closeInventory()}

  function swingHatchet(){
    if(state.mode!=='playing'||state.weapon!=='hatchet'||state.axeSwinging)return;const now=performance.now();if(now-state.lastShot<620)return;
    state.lastShot=now;state.axeSwinging=true;state.shots++;audio.axeSwing();
    const baseRx=weaponRoot.userData.baseRotationX??-.055,baseZ=weaponRoot.userData.baseZ??-.78;
    weaponRoot.rotation.x=baseRx-.48;weaponRoot.rotation.y=.42;weaponRoot.rotation.z=-.62;weaponRoot.position.z=baseZ+.16;
    setTimeout(()=>{
      if(state.mode!=='playing'&&state.mode!=='inventory')return;
      const targets=[];zombies.forEach(z=>{if(z.alive)z.model.traverse(o=>{if(o.isMesh)targets.push(o)})});
      raycaster.setFromCamera(centerRay,camera);raycaster.far=2.45;const hit=raycaster.intersectObjects(targets,false)[0];
      if(hit){
        const idx=hit.object.userData.zombieIndex,z=zombies[idx];if(z&&z.alive){const headshot=hit.point.y-z.model.position.y>1.55,damage=headshot?125:82;z.hp-=damage;z.alerted=true;z.hitUntil=performance.now()+160;state.hits++;audio.axeHit();audio.hit();hitMarker.classList.remove('show');void hitMarker.offsetWidth;hitMarker.classList.add('show');
          const d=distXZ(z.model.position,player.position),rel=Math.atan2(z.model.position.x-player.position.x,z.model.position.z-player.position.z)-player.rotation.y,dying=z.hp<=0;audio.zombieHurt(THREE.MathUtils.clamp(.13*(1-d/12),.055,.13),Math.sin(rel),dying);
          if(dying){z.alive=false;z.deathTime=performance.now();state.kills++;audio.objective()}
        }
      }
    },165);
    setTimeout(()=>{weaponRoot.rotation.set(baseRx,-.025,-.012);weaponRoot.position.z=baseZ;state.axeSwinging=false},470);
  }

  function fire(){
    if(state.weapon==='hatchet'){swingHatchet();return}
    if(state.mode!=='playing'||state.reloading)return;const now=performance.now();if(now-state.lastShot<720)return;if(state.clip<=0){audio.empty();reloadText.textContent=t('noAmmo');setTimeout(()=>reloadText.textContent=t('reload'),650);return}
    state.lastShot=now;state.clip--;state.shots++;audio.fire();
    const baseRotX=weaponRoot.userData.baseRotationX??-.04,baseZ=weaponRoot.userData.baseZ??weaponRoot.position.z;
    weaponRoot.rotation.x=baseRotX-.18;weaponRoot.position.z=baseZ+.105;
    setTimeout(()=>{weaponRoot.rotation.x=baseRotX;weaponRoot.position.z=baseZ},150);
    const muzzle=weaponRoot.userData.muzzle;if(muzzle){muzzle.intensity=18;setTimeout(()=>muzzle.intensity=0,65)}
    zombies.forEach(z=>{if(z.alive&&distXZ(z.model.position,player.position)<30)z.alerted=true});
    const targets=[];zombies.forEach(z=>{if(z.alive)z.model.traverse(o=>{if(o.isMesh)targets.push(o)})});
    const damageByZombie=new Map();let shellHit=false;
    for(let pellet=0;pellet<9;pellet++){
      const spread=.032,aim=new THREE.Vector2((Math.random()-.5)*spread,(Math.random()-.5)*spread);
      raycaster.setFromCamera(aim,camera);raycaster.far=42;const hit=raycaster.intersectObjects(targets,false)[0];
      if(!hit)continue;const idx=hit.object.userData.zombieIndex,z=zombies[idx];if(!z||!z.alive)continue;
      shellHit=true;const headshot=hit.point.y-z.model.position.y>1.6;damageByZombie.set(idx,(damageByZombie.get(idx)||0)+(headshot?24:15));
    }
    if(shellHit){state.hits++;hitMarker.classList.remove('show');void hitMarker.offsetWidth;hitMarker.classList.add('show');audio.hit()}
    damageByZombie.forEach((damage,idx)=>{
      const z=zombies[idx];if(!z||!z.alive)return;z.hp-=damage;z.hitUntil=now+140;
      const d=distXZ(z.model.position,player.position),rel=Math.atan2(z.model.position.x-player.position.x,z.model.position.z-player.position.z)-player.rotation.y,dying=z.hp<=0;
      audio.zombieHurt(THREE.MathUtils.clamp(.13*(1-d/32),.045,.13),Math.sin(rel),dying);
      if(dying){z.alive=false;z.deathTime=now;state.kills++;audio.objective()}
    });
    updateHUD();
  }

  function reload(){
    if(state.weapon!=='shotgun')return;
    if(state.mode!=='playing'||state.reloading||state.clip>=8||state.reserve<=0)return;state.reloading=true;reloadText.textContent=t('reloading');audio.reload();const oldY=weaponRoot.position.y;weaponRoot.position.y-=.24;setTimeout(()=>{const need=8-state.clip,take=Math.min(need,state.reserve);state.clip+=take;state.reserve-=take;state.reloading=false;reloadText.textContent=t('reload');weaponRoot.position.y=oldY;updateHUD()},1650)
  }

  function interactionTarget(){
    if(state.stage===1)return {name:'generator',pos:new THREE.Vector3(-16.4,0,-2),label:t('interactGenerator')};
    if(state.stage===4)return {name:'radio',pos:new THREE.Vector3(0,0,-44.5),label:t('interactRadio')};return null;
  }
  function interact(){
    if(state.mode!=='playing'||state.interacting)return;const target=interactionTarget();if(!target||distXZ(player.position,target.pos)>2.1)return;
    state.interacting=true;interactPrompt.classList.remove('show');
    if(target.name==='generator'){
      audio.generatorStart();const g=scene.userData.generator;if(g?.userData.lamp){g.userData.lamp.material=materials.lamp}
      setTimeout(()=>{spawnWave();state.interacting=false},1450);
    }else if(target.name==='radio'){
      audio.radioStart();const r=scene.userData.radio;if(r?.userData.beacon){r.userData.beacon.material=materials.lamp}
      setTimeout(()=>{startOutro();state.interacting=false},1300);
    }
  }
  function updateInteraction(){const target=interactionTarget();if(target&&distXZ(player.position,target.pos)<2.1){interactPrompt.querySelector('span').textContent=target.label;interactPrompt.classList.add('show')}else interactPrompt.classList.remove('show')}

  function updateObjective(){
    const keysObj=['obj0','obj1','obj2','obj3','obj4'];objectiveText.textContent=t(keysObj[Math.min(state.stage,4)]);objectiveBar.style.width=`${[10,32,55,78,96][Math.min(state.stage,4)]}%`;
    const points=[new THREE.Vector3(0,3,8),new THREE.Vector3(-16.4,3,-2),null,new THREE.Vector3(0,4,-44.5),new THREE.Vector3(0,4,-44.5)];
    const point=points[Math.min(state.stage,4)];objectiveMarker.visible=!!point;if(point)objectiveMarker.position.copy(point);
  }
  function updateHUD(){
    healthBar.style.width=`${state.health}%`;healthText.textContent=Math.ceil(state.health);staminaBar.style.width=`${state.stamina}%`;staminaText.textContent=Math.ceil(state.stamina);
    const shotgun=state.weapon==='shotgun';weaponName.textContent=t(shotgun?'shotgun':'hatchet');
    ammoClip.textContent=shotgun?state.clip:'∞';ammoDivider.textContent=shotgun?'/':'';ammoReserve.textContent=shotgun?state.reserve:(lang==='ar'?'قريب':'MELEE');
    reloadText.textContent=shotgun?(state.reloading?t('reloading'):t('reload')):(lang==='ar'?'اضغط زر الفأرة للهجوم':'LMB TO SWING');
    slotOneHud?.classList.toggle('active',shotgun);slotTwoHud?.classList.toggle('active',!shotgun);updateInventory();updateObjective();
  }
  function showSubtitle(who,key,duration=3500){speaker.textContent=t(who);subtitleText.textContent=t(key);subtitle.classList.add('show');state.subtitleUntil=performance.now()+duration}
  function saveCheckpoint(){saveState.textContent=t('saved');state.checkpointShown=performance.now()+2600;localStorage.setItem('ls-night-one-stage',String(state.stage))}

  function setViewModelVisible(visible){
    weaponRoot.visible=visible;bodyRoot.visible=visible;
    flashlight.visible=visible&&flashlightOn;
  }

  function beginStory(){
    audio.init();audio.resume();storyGate.classList.add('hidden');audio.startCinematicBed();startIntro();
  }
  function startIntro(){
    state.mode='cinematic';state.cinematicKind='intro';state.cinematicStart=performance.now();state.cinematicFinished=false;state.lastNarrationKey='';audio.lastSpokenText='';setViewModelVisible(false);cinematicEl.classList.remove('hidden');hud.classList.add('hidden');startOverlay.classList.add('hidden');skipBtn.disabled=true;skipBtn.innerHTML=`SKIP IN <b id="skipCount">3</b>`;
  }
  function finishIntro(){audio.stopCinematic();state.mode='ready';state.cinematicFinished=true;setViewModelVisible(false);cinematicEl.classList.add('hidden');startOverlay.classList.remove('hidden');resetPlayerPose()}
  function startOutro(){state.mode='cinematic';state.cinematicKind='outro';state.cinematicStart=performance.now();state.cinematicFinished=false;state.lastNarrationKey='';audio.lastSpokenText='';audio.startCinematicBed();setViewModelVisible(false);document.exitPointerLock?.();cinematicEl.classList.remove('hidden');hud.classList.add('hidden');skipBtn.disabled=true}
  function finishOutro(){audio.stopCinematic();state.mode='result';setViewModelVisible(false);cinematicEl.classList.add('hidden');showResult(true)}
  function updateCinematic(now){
    const e=(now-state.cinematicStart)/1000,wait=3;skipBtn.disabled=e<wait;skipBtn.innerHTML=e<wait?`SKIP IN <b>${Math.max(0,Math.ceil(wait-e))}</b>`:'SKIP';
    if(state.cinematicKind==='intro'){
      cinemaKicker.textContent='CHAPTER 01';cinemaTitle.textContent='NIGHT ONE';const narrationKey=e<4.8?'intro1':e<9.5?'intro2':'intro3';cinemaText.textContent=t(narrationKey);if(state.lastNarrationKey!==narrationKey){state.lastNarrationKey=narrationKey;audio.narrate(t(narrationKey),lang)};
      if(e<5){const q=e/5;player.position.lerpVectors(new THREE.Vector3(-15,2,-30),new THREE.Vector3(-3,1,-18),q);player.rotation.y=THREE.MathUtils.lerp(2.4,2.9,q);pitch=THREE.MathUtils.lerp(-.18,-.05,q)}
      else if(e<10){const q=(e-5)/5;player.position.lerpVectors(new THREE.Vector3(9,1,20),new THREE.Vector3(2,1,8),q);player.rotation.y=THREE.MathUtils.lerp(-2.5,-3.1,q);pitch=THREE.MathUtils.lerp(-.06,.04,q)}
      else{const q=Math.min(1,(e-10)/5);player.position.lerpVectors(new THREE.Vector3(-6,1,8),new THREE.Vector3(0,0,32),q);player.rotation.y=THREE.MathUtils.lerp(.2,Math.PI,q);pitch=0}
      camera.rotation.x=pitch;if(e>15)finishIntro();
    }else{
      cinemaKicker.textContent='MISSION COMPLETE';cinemaTitle.textContent=t('complete');const narrationKey=e<4.5?'outro1':'outro2';cinemaText.textContent=t(narrationKey);if(state.lastNarrationKey!==narrationKey){state.lastNarrationKey=narrationKey;audio.narrate(t(narrationKey),lang)};
      const q=Math.min(1,e/8);player.position.lerpVectors(new THREE.Vector3(2,1,-35),new THREE.Vector3(-7,2,-24),q);player.rotation.y=THREE.MathUtils.lerp(Math.PI,.6,q);pitch=THREE.MathUtils.lerp(-.05,-.18,q);camera.rotation.x=pitch;if(e>9)finishOutro();
    }
  }

  function resetPlayerPose(){player.position.set(0,0,32);player.rotation.y=0;pitch=0;camera.rotation.x=0;state.lastPosition.copy(player.position)}
  function startPlaying(){audio.init();audio.resume();setViewModelVisible(true);state.mode='playing';state.missionStart=performance.now();startOverlay.classList.add('hidden');hud.classList.remove('hidden');pointerHint.classList.remove('hidden');canvas.requestPointerLock?.();showSubtitle('radio','subtitle1',4200);updateObjective();saveState.textContent=assetTemplates.zombies.length?`INFECTED MODELS: ${assetTemplates.zombies.length}`:'FALLBACK INFECTED';setTimeout(()=>{if(saveState.textContent.startsWith('INFECTED')||saveState.textContent==='FALLBACK INFECTED')saveState.textContent=''},3200)}
  function pause(){if(state.mode!=='playing')return;state.mode='paused';pauseOverlay.classList.remove('hidden');document.exitPointerLock?.()}
  function resume(){if(state.mode!=='paused')return;state.mode='playing';pauseOverlay.classList.add('hidden');canvas.requestPointerLock?.();state.lastTime=performance.now()}
  function restart(){location.reload()}

  function showResult(win){
    state.mode='result';hud.classList.add('hidden');resultOverlay.classList.remove('hidden');$('resultKicker').textContent=win?'MISSION COMPLETE':'MISSION FAILED';$('resultTitle').textContent=t(win?'complete':'failed');$('resultText').textContent=t(win?'completeText':'failedText');$('statKills').textContent=state.kills;$('statAccuracy').textContent=`${state.shots?Math.round(state.hits/state.shots*100):0}%`;$('statTime').textContent=formatTime((performance.now()-state.missionStart)/1000);if(win){localStorage.setItem('ls-night-one-complete','true');localStorage.setItem('ls-chapter-01-complete','true')}
  }
  function formatTime(sec){sec=Math.max(0,Math.floor(sec));return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`}

  function animateRain(dt){const rain=scene.userData.rain;if(!rain)return;const arr=rain.geometry.attributes.position.array;for(let i=0;i<arr.length;i+=3){arr[i+1]-=dt*18;arr[i]-=dt*1.8;if(arr[i+1]<0){arr[i+1]=30;arr[i]=(Math.random()-.5)*90;arr[i+2]=(Math.random()-.5)*100}}rain.geometry.attributes.position.needsUpdate=true}
  function update(dt,now){
    mixers.forEach(m=>m.update(dt));animateRain(dt);objectiveMarker.rotation.y+=dt*1.8;objectiveMarker.position.y+=Math.sin(now*.004)*dt*.12;
    if(state.mode==='cinematic'){updateCinematic(now);return}
    if(state.mode!=='playing')return;
    updatePlayer(dt,now);updateZombies(dt,now);updateInteraction();updateHUD();
    if(state.subtitleUntil&&now>state.subtitleUntil){subtitle.classList.remove('show');state.subtitleUntil=0}if(state.checkpointShown&&now>state.checkpointShown){saveState.textContent='';state.checkpointShown=0}
  }

  function render(){renderer.render(scene,camera)}
  function loop(now){const dt=Math.min(.04,clock.getDelta());update(dt,now);render();requestAnimationFrame(loop)}

  function setupEvents(){
    addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))});
    document.addEventListener('keydown',e=>{
      keys[e.code]=true;
      if(e.code==='Escape'){
        if(state.mode==='inventory')closeInventory();else if(state.mode==='playing')pause();else if(state.mode==='paused')resume();
      }
      if(e.code==='KeyB'){e.preventDefault();toggleInventory()}
      if(e.code==='Digit1'){e.preventDefault();if(state.mode==='inventory'){switchWeapon('shotgun');updateInventory()}else if(state.mode==='playing')switchWeapon('shotgun')}
      if(e.code==='Digit2'){e.preventDefault();if(state.mode==='inventory'){switchWeapon('hatchet');updateInventory()}else if(state.mode==='playing')switchWeapon('hatchet')}
      if(e.code==='KeyR')reload();if(e.code==='KeyE')interact();
      if(e.code==='KeyF'){flashlightOn=!flashlightOn;flashlight.visible=flashlightOn&&state.mode==='playing';}
      if(e.code==='Space'&&state.mode==='cinematic'&&!skipBtn.disabled){e.preventDefault();state.cinematicKind==='intro'?finishIntro():finishOutro()}
    });
    document.addEventListener('keyup',e=>{keys[e.code]=false});
    document.addEventListener('mousemove',e=>{if(document.pointerLockElement!==canvas||state.mode!=='playing')return;player.rotation.y-=e.movementX*.00225;pitch=THREE.MathUtils.clamp(pitch-e.movementY*.00195,-1.48,1.48);camera.rotation.x=pitch});
    document.addEventListener('pointerlockchange',()=>{pointerHint.classList.toggle('hidden',document.pointerLockElement===canvas||state.mode!=='playing')});
    canvas.addEventListener('mousedown',e=>{if(e.button===0){if(state.mode==='playing'&&document.pointerLockElement!==canvas){canvas.requestPointerLock?.();return}fire()}});
    canvas.addEventListener('wheel',e=>{if(state.mode!=='playing')return;e.preventDefault();switchWeapon(e.deltaY>0?'hatchet':'shotgun')},{passive:false});
    pointerHint.addEventListener('click',()=>canvas.requestPointerLock?.());
    startStoryBtn.addEventListener('click',beginStory);enterGame.addEventListener('click',startPlaying);
    skipBtn.addEventListener('click',()=>{if(skipBtn.disabled)return;state.cinematicKind==='intro'?finishIntro():finishOutro()});
    closeInventoryBtn.addEventListener('click',closeInventory);
    inventoryShotgun.addEventListener('click',()=>{switchWeapon('shotgun');updateInventory()});
    inventoryHatchet.addEventListener('click',()=>{switchWeapon('hatchet');updateInventory()});
    $('pauseBtn').addEventListener('click',pause);$('resumeBtn').addEventListener('click',resume);$('restartBtn').addEventListener('click',restart);$('replayBtn').addEventListener('click',restart);$('langBtn').addEventListener('click',()=>setLanguage(lang==='en'?'ar':'en'));
    addEventListener('blur',()=>{if(state.mode==='playing')pause()});
  }

  function decodeEmbeddedGLB(base64){
    const raw=atob(base64),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return bytes.buffer;
  }
  async function tryLoadGLB(name,path){
    if(name==='zombie-pack'&&window.__ZOMBIE_PACK_BASE64__){
      loadText.textContent='Loading infected models…';
      return new Promise(resolve=>loader3d.parse(decodeEmbeddedGLB(window.__ZOMBIE_PACK_BASE64__),'',g=>{
        console.info('[Night One] loaded embedded zombie pack');resolve(g);
      },err=>{console.error('[Night One] embedded zombie pack failed',err);resolve(null)}));
    }
    if(name==='rifle'&&window.__RIFLE_BASE64__){
      loadText.textContent='Equipping tactical shotgun…';
      return new Promise(resolve=>loader3d.parse(decodeEmbeddedGLB(window.__RIFLE_BASE64__),'',g=>{
        console.info('[Night One] loaded embedded tactical shotgun');resolve(g);
      },err=>{console.error('[Night One] embedded rifle failed',err);resolve(null)}));
    }
    if(name==='hatchet'&&window.__HATCHET_BASE64__){
      loadText.textContent='Equipping old hatchet…';
      return new Promise(resolve=>loader3d.parse(decodeEmbeddedGLB(window.__HATCHET_BASE64__),'',g=>{
        console.info('[Night One] loaded embedded hatchet');resolve(g);
      },err=>{console.error('[Night One] embedded hatchet failed',err);resolve(null)}));
    }
    if(location.protocol==='file:'){console.warn(`[Night One] ${name} skipped on file protocol.`);return null;}
    return new Promise(resolve=>{
      try{
        loader3d.load(path,g=>{console.info(`[Night One] loaded ${name}`,path);resolve(g)},progress=>{if(progress.total)loadText.textContent=`Loading ${name}… ${Math.round(progress.loaded/progress.total*100)}%`},err=>{console.error(`[Night One] failed to load ${name}`,path,err);resolve(null)});
      }catch(err){console.error(`[Night One] unable to request ${name}`,path,err);resolve(null)}
    });
  }
  function cleanViewModel(root,order=10){
    const remove=[];root.traverse(o=>{if(o.isLight||o.isCamera)remove.push(o)});remove.forEach(o=>o.parent?.remove(o));
    root.traverse(o=>{if(o.isMesh){o.frustumCulled=false;o.renderOrder=order;o.castShadow=false;o.receiveShadow=false;if(o.material){const original=Array.isArray(o.material)?o.material:[o.material];const cloned=original.map(m=>{const c=m.clone();c.depthTest=false;c.depthWrite=false;c.toneMapped=true;return c});o.material=Array.isArray(o.material)?cloned:cloned[0]}}});
  }

  function setupImportedShotgun(gltf){
    const previous=shotgunView;
    try{
      const candidate=new THREE.Group();candidate.name='ShotgunView';
      const r=cloneSkeleton(gltf.scene);cleanViewModel(r,10);
      const box=new THREE.Box3().setFromObject(r),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());const maxAxis=Math.max(size.x,size.y,size.z)||1,scale=1.18/maxAxis;
      r.scale.setScalar(scale);r.position.set(-center.x*scale,-center.y*scale,-center.z*scale);
      const wrap=new THREE.Group();wrap.rotation.y=Math.PI/2;wrap.position.set(0,.025,-.14);wrap.add(r);candidate.add(wrap);
      const sleeve=makeViewMaterial({color:0x171b1d,roughness:.96}),glove=makeViewMaterial({color:0x101214,roughness:.98});
      const addLimb=(a,b,radius,material,order=11)=>{const start=new THREE.Vector3(...a),finish=new THREE.Vector3(...b),dir=finish.clone().sub(start),len=dir.length();const limb=new THREE.Mesh(new THREE.CapsuleGeometry(radius,Math.max(.03,len-radius*2),6,10),material);limb.position.copy(start).add(finish).multiplyScalar(.5);limb.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());limb.renderOrder=order;candidate.add(limb);return limb};
      addLimb([.43,-.58,.16],[.22,-.27,.02],.062,sleeve);addLimb([.22,-.27,.02],[.105,-.145,-.17],.056,glove,12);addLimb([-.38,-.58,.08],[-.17,-.29,-.22],.061,sleeve);addLimb([-.17,-.29,-.22],[-.005,-.13,-.54],.054,glove,12);
      const rightGrip=new THREE.Mesh(new THREE.CapsuleGeometry(.054,.09,5,9),glove);rightGrip.position.set(.095,-.13,-.18);rightGrip.rotation.set(-1.12,0,.12);rightGrip.renderOrder=13;candidate.add(rightGrip);
      const leftGrip=new THREE.Mesh(new THREE.CapsuleGeometry(.052,.10,5,9),glove);leftGrip.position.set(-.005,-.115,-.55);leftGrip.rotation.set(-1.25,0,-.04);leftGrip.renderOrder=13;candidate.add(leftGrip);
      const muzzle=new THREE.PointLight(0xffb15a,0,8,2);muzzle.position.set(0,.045,-1.02);candidate.add(muzzle);candidate.userData.muzzle=muzzle;candidate.userData.fallback=false;
      previous?.removeFromParent();shotgunView=candidate;weaponRoot.add(shotgunView);console.info('[Night One] tactical shotgun equipped',size,scale);
    }catch(err){console.error('[Night One] rifle setup failed; keeping fallback shotgun',err);shotgunView=previous}
  }

  function setupImportedHatchet(gltf){
    const previous=hatchetView;
    try{
      const candidate=new THREE.Group();candidate.name='HatchetView';candidate.visible=false;candidate.position.set(.12,-.03,-.10);candidate.rotation.set(-.16,.08,-.72);
      const h=cloneSkeleton(gltf.scene);cleanViewModel(h,12);
      const box=new THREE.Box3().setFromObject(h),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),maxAxis=Math.max(size.x,size.y,size.z)||1,scale=.92/maxAxis;
      h.scale.setScalar(scale);h.position.set(-center.x*scale,-center.y*scale,-center.z*scale);
      const wrap=new THREE.Group();wrap.position.set(-.08,.02,-.20);wrap.rotation.set(0,.06,.02);wrap.add(h);candidate.add(wrap);
      const sleeve=makeViewMaterial({color:0x171b1d,roughness:.96}),glove=makeViewMaterial({color:0x101214,roughness:.98});
      const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.066,.45,6,10),sleeve);arm.position.set(.31,-.30,.04);arm.rotation.set(-1.15,0,.38);arm.renderOrder=13;candidate.add(arm);
      const hand=new THREE.Mesh(new THREE.CapsuleGeometry(.058,.12,5,9),glove);hand.position.set(.14,-.09,-.16);hand.rotation.set(-1.18,0,.38);hand.renderOrder=14;candidate.add(hand);
      previous?.removeFromParent();hatchetView=candidate;weaponRoot.add(hatchetView);console.info('[Night One] old hatchet equipped',size,scale);
    }catch(err){console.error('[Night One] hatchet setup failed; keeping fallback',err);hatchetView=previous}
  }

  async function loadOptionalAssets(){
    const [playerG,zombiePackG,rifleG,hatchetG]=await Promise.all([
      tryLoadGLB('player','assets/models/player.glb'),tryLoadGLB('zombie-pack','assets/models/zombie-pack.glb'),tryLoadGLB('rifle','assets/models/rifle.glb'),tryLoadGLB('hatchet','assets/models/old-hatchet.glb')
    ]);
    if(playerG)assetTemplates.player=playerG;if(rifleG)assetTemplates.rifle=rifleG;if(hatchetG)assetTemplates.hatchet=hatchetG;
    if(zombiePackG){assetTemplates.zombies=prepareZombiePack(zombiePackG);console.info(`[Night One] prepared ${assetTemplates.zombies.length} zombie variants`)}
    if(playerG){bodyRoot.clear();const p=cloneSkeleton(playerG.scene);p.position.set(0,0,0);p.scale.setScalar(1);bodyRoot.add(p)}
    if(rifleG)setupImportedShotgun(rifleG);if(hatchetG)setupImportedHatchet(hatchetG);applyWeaponVisibility();updateHUD();
  }

  async function boot(){
    setLanguage(lang);loadProgress.style.width='18%';loadText.textContent=t('loading1');buildWorld();buildPlayerBody();buildWeapon();buildRain();setupEvents();
    loadProgress.style.width='44%';loadText.textContent=t('loading2');await loadOptionalAssets();
    loadText.textContent=assetTemplates.zombies.length?`${assetTemplates.zombies.length} infected variants ready`:'Using emergency fallback infected';
    loadProgress.style.width='78%';spawnInitialZombies();
    loadText.textContent=t('loading3');await new Promise(r=>setTimeout(r,350));loadProgress.style.width='100%';await new Promise(r=>setTimeout(r,300));loading.classList.add('hidden');state.lastPosition.copy(player.position);state.mode='ready';storyGate.classList.remove('hidden');requestAnimationFrame(loop);
  }

  boot().catch(err=>{console.error(err);loadText.textContent='Unable to start Night One. Open the console for details.'});
})();
