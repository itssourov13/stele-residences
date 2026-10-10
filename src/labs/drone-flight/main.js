import './style.css';
import '@fontsource-variable/newsreader';
import '@fontsource-variable/instrument-sans';
import {THREE, GLTFLoader, RGBELoader, MeshoptDecoder} from '../../webgl/vendor3d.js';
import {LAB} from '../../config/assets.js';

/* Drone-flight mini-game. Ported from gra_script_1.js; the original CDN/bundle loader and reload watchdog were replaced by Vite + npm three. */


const $=s=>document.querySelector(s);
const MOBILE=matchMedia('(hover:none)').matches||innerWidth<760;
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const LANG=((new URLSearchParams(location.search).get('lang'))||(()=>{try{return localStorage.getItem('stele-lang');}catch(e){return null;}})()||((navigator.languages||[navigator.language||'']).some(l=>/^pl\b/i.test(l))?'pl':'en')).toLowerCase().indexOf('en')===0?'en':'pl';
const T={
 gates:['Bramki','Gates'], time:['Czas','Time'], alt:['m n.p.w.','m alt'], ld:['Przygotowujemy drona','Preparing the drone'],
 cam3:['KAMERA · TPP','CAMERA · TPP'], camf:['KAMERA · FPV','CAMERA · FPV'],
 title:['Lot koncepcyjny <b>FPV</b> o złotej godzinie','Concept <b>FPV</b> flight at golden hour'],
 intro:['Przejdź koncepcyjną trasę inspirowaną architekturą STELE. Najpierw <b>rozgrzewka</b> (2 bramki bez czasu), potem wyścig: <b>12 złotych bramek w 90 sekund</b>. Nagroda: lokalny kod osiągnięcia demo.',
        'Fly a concept route inspired by the fictional STELE architecture. First a <b>warm-up</b> (2 gates, no clock), then the race: <b>12 golden gates in 90 seconds</b>. Reward: a local demo achievement code.'],
 start:['Startuj →','Take off →'],
 k1:['Dron leci sam.','The drone flies itself.'],k1v:['Prowadź go celownikiem myszy po zielonej linii','Guide it with the mouse crosshair along the green line'],k2v:['boost','boost'],k3v:['wolniej','slow down'],k4:['strzałki','arrows'],k4v:['alternatywa','alternative'],k6v:['kamera FPV','FPV camera'],k7v:['pauza','pause'],
 p1:['Pad:','Gamepad:'],p1v:['prawy drążek = kierunek, RT/A = boost','right stick = steer, RT/A = boost'],
 stable:['Stabilna kamera (mniej bujania)','Stable camera (less sway)'], padon:['🎮 Kontroler wykryty','🎮 Controller detected'],
 boost:['BOOST','BOOST'], mobhint:['Prawy kciuk = kierunek · BOOST = szybciej','Right thumb = steer · BOOST = faster'],
 warm:['Rozgrzewka - opanuj drona','Warm-up - get a feel'], warmlbl:['Rozgrzewka','Warm-up'],
 go:['Brama startowa!','Start gate!'], gate:['Bramka','Gate'], allg:['Wszystkie bramki!','All gates!'], timeout:['Czas minął!','Time\'s up!'],
 hit:['Kolizja - powrót do bramki','Crash - back to gate'],
 paused:['Pauza','Paused'], pausesub:['Esc / przycisk = wznowienie','Esc / button = resume'], resume:['Wznów lot','Resume flight'],
 padoff:['Kontroler odłączony','Controller disconnected'],
 nofx_h:['Ten lot wymaga mocniejszego sprzętu','This flight needs stronger hardware'],
 nofx_p:['Twoja przeglądarka nie obsługuje WebGPU/WebGL2. Zobacz przelot z pokładu naszego drona:','Your browser lacks WebGPU/WebGL2 support. Watch the flight instead:'],
 nofx_cta:['Wróć do STELE →','Back to STELE →'],
 rot:['Obróć telefon poziomo','Rotate your phone'],
 claim_info:['To lokalne osiągnięcie demonstracyjne — nie jest kuponem, rezerwacją ani obietnicą korzyści.','This is a local demo achievement — it is not a coupon, booking or promise of benefits.'],
 claim_btn:['Wróć do koncepcji STELE →','Return to the STELE concept →'], see_apts:['Poznaj koncepcję','Explore the concept'],
 share:['Udostępnij wynik','Share result'], again:['Jeszcze raz','Fly again'],
 win:['Perfekcyjny lot! 🏆','Perfect flight! 🏆'], land:['Lądowanie!','Touchdown!'],
 ctx1:['Podgląd 3D został przerwany','3D view was interrupted'],ctx2:['Odśwież stronę, aby wrócić do lotu.','Refresh to return to the flight.'],ctx3:['Odśwież','Refresh']
};
const L=k=>T[k]?T[k][LANG==='en'?1:0]:k;
document.querySelectorAll('[data-t]').forEach(el=>{ if(T[el.dataset.t])el.innerHTML=L(el.dataset.t); });
if(LANG==='en')document.documentElement.lang='en';

const GATES_N=12, WARM_N=2, TIME_LIMIT=90, CODE='STELE-FLIGHT-DEMO';
const canvas=$('#game');
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();$('#ctxlost').style.display='flex';},false);

/* ===== stan ===== */
const S={mode:'load',phase:'warm',t0:0,pausedAt:0,gates:0,done:false,fpv:false,stable:RM,
  best:(()=>{try{const v=parseFloat(localStorage.getItem('stele_drone_best'));return Number.isFinite(v)?v:null;}catch(e){return null;}})()};
/* fizyka drona */
const D={pos:new THREE.Vector3(),vel:new THREE.Vector3(),yaw:Math.PI,yawRate:0,fwd:0,side:0,climb:0,bank:0,tilt:0,ckpt:{pos:new THREE.Vector3(),yaw:Math.PI}};

/* ===== wejścia: klawiatura + mysz (pointer lock) + pad + drążki ===== */
const keys={};
addEventListener('keydown',e=>{keys[e.code]=true;
  if(e.code==='KeyC'&&S.mode==='play')toggleCam();
  if(e.code==='KeyR'&&(S.mode==='play'))begin();
  if(e.code==='Escape'&&(S.mode==='play'))togglePause();
  if(['Space','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();});
addEventListener('keyup',e=>{keys[e.code]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false; if(S.mode==='play')togglePause(true);});
/* ===== STEROWANIE "CELOWNIK" (redesign po feedbacku: dron leci sam, kursor prowadzi) =====
   mysz: pozycja kursora względem środka ekranu = kierunek (x=skręt, y=góra/dół), martwa strefa 6%.
   dotyk: prawy kciuk przeciąga wirtualny celownik, BOOST = przycisk. Pad: prawy drążek. */
const aim={x:0,y:0};           // -1..1
const crossEl=document.getElementById('cross');
addEventListener('mousemove',e=>{ if(MOBILE)return;
  aim.x=(e.clientX/innerWidth-0.5)*2; aim.y=(e.clientY/innerHeight-0.5)*2;
  crossEl.style.left=e.clientX+'px'; crossEl.style.top=e.clientY+'px'; });
/* dotyk: drag w dowolnym miejscu canvasa = celownik od punktu startu (do 90px) */
const tAim={id:null,sx:0,sy:0};
canvas.addEventListener('pointerdown',e=>{ if(e.pointerType==='mouse')return;
  tAim.id=e.pointerId; tAim.sx=e.clientX; tAim.sy=e.clientY; });
addEventListener('pointermove',e=>{ if(tAim.id!==e.pointerId)return;
  aim.x=Math.max(-1,Math.min(1,(e.clientX-tAim.sx)/90)); aim.y=Math.max(-1,Math.min(1,(e.clientY-tAim.sy)/90));
  crossEl.style.left=e.clientX+'px'; crossEl.style.top=e.clientY+'px'; });
const tEnd=e=>{ if(tAim.id===e.pointerId){tAim.id=null;aim.x=0;aim.y=0;} };
addEventListener('pointerup',tEnd); addEventListener('pointercancel',tEnd);
let boostTouch=false;
const bBtn=document.getElementById('boostBtn');
bBtn.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();boostTouch=true;bBtn.setPointerCapture(e.pointerId);});
bBtn.addEventListener('pointerup',()=>boostTouch=false); bBtn.addEventListener('pointercancel',()=>boostTouch=false);

/* Gamepad: prawy drążek = kierunek, RT(7)/A(0) = boost, LT(6)/B(1) = wolniej */
let padIdx=null;
addEventListener('gamepadconnected',e=>{padIdx=e.gamepad.index;$('#padTag').classList.add('on');$('#keysPad').classList.remove('hidden');});
addEventListener('gamepaddisconnected',e=>{ if(e.gamepad.index===padIdx){padIdx=null;$('#padTag').classList.remove('on');
  if(S.mode==='play'){togglePause(true);toast(L('padoff'));} }});
const dz=v=>Math.abs(v)<0.14?0:(v-Math.sign(v)*0.14)/0.86;
function padState(){ if(padIdx==null)return null; const gp=navigator.getGamepads()[padIdx]; if(!gp)return null;
  const b=i=>gp.buttons[i]&&(gp.buttons[i].pressed||gp.buttons[i].value>0.4);
  return {x:dz(gp.axes[2]||gp.axes[0]||0),y:dz(gp.axes[3]||gp.axes[1]||0),boost:b(7)||b(0),slow:b(6)||b(1)}; }

/* ===== audio (synteza: rotory + wiatr + dzwonki) ===== */
let AUDIO=null,audioMuted=(()=>{try{return localStorage.getItem('stele_muted')==='1';}catch(e){return false;}})();
function initAudio(){ if(AUDIO)return; try{
  const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return; const ctx=new AC();
  const master=ctx.createGain(); master.gain.value=audioMuted?0:0.32; master.connect(ctx.destination);
  const hum=ctx.createGain(); hum.gain.value=0.0001;
  const o1=ctx.createOscillator();o1.type='sawtooth';o1.frequency.value=82;
  const o2=ctx.createOscillator();o2.type='sawtooth';o2.frequency.value=124;
  const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=560;
  o1.connect(lp);o2.connect(lp);lp.connect(hum);hum.connect(master);o1.start();o2.start();
  const nb=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate); const nd=nb.getChannelData(0);
  for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
  const ns=ctx.createBufferSource();ns.buffer=nb;ns.loop=true;
  const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=900;bp.Q.value=0.6;
  const wg=ctx.createGain();wg.gain.value=0.0001; ns.connect(bp);bp.connect(wg);wg.connect(master);ns.start();
  AUDIO={ctx,
    rotor(sp){const r=Math.min(1,sp/32);o1.frequency.setTargetAtTime(72+r*74,ctx.currentTime,0.1);o2.frequency.setTargetAtTime(110+r*112,ctx.currentTime,0.1);
      hum.gain.setTargetAtTime(0.045+r*0.125,ctx.currentTime,0.12); wg.gain.setTargetAtTime(r*r*0.09,ctx.currentTime,0.2);
      bp.frequency.setTargetAtTime(700+r*900,ctx.currentTime,0.25);},
    silence(){hum.gain.setTargetAtTime(0.0001,ctx.currentTime,0.1);wg.gain.setTargetAtTime(0.0001,ctx.currentTime,0.1);},
    setMuted(m){master.gain.setTargetAtTime(m?0:0.32,ctx.currentTime,0.05);},
    chime(hi){const g=ctx.createGain(),o=ctx.createOscillator();o.type='sine';o.frequency.value=hi?1318:880;o.connect(g);g.connect(master);
      const t=ctx.currentTime;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.34,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+0.5);o.start(t);o.stop(t+0.55);
      const g2=ctx.createGain(),o3=ctx.createOscillator();o3.type='sine';o3.frequency.value=hi?1975:1318;o3.connect(g2);g2.connect(master);
      g2.gain.setValueAtTime(0.0001,t+0.06);g2.gain.exponentialRampToValueAtTime(0.22,t+0.08);g2.gain.exponentialRampToValueAtTime(0.0001,t+0.5);o3.start(t+0.06);o3.stop(t+0.55);},
    fanfare(){[0,0.12,0.24,0.42].forEach((d,i)=>{const g=ctx.createGain(),o=ctx.createOscillator();o.type='triangle';
      o.frequency.value=[659,880,1109,1319][i];o.connect(g);g.connect(master);const t=ctx.currentTime+d;
      g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.3,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+0.8);o.start(t);o.stop(t+0.85);});},
    crash(){const g=ctx.createGain();g.connect(master);const s=ctx.createBufferSource();s.buffer=nb;
      const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=380;s.connect(f);f.connect(g);
      const t=ctx.currentTime;g.gain.setValueAtTime(0.4,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.35);s.start(t);s.stop(t+0.4);},
    resume(){if(ctx.state==='suspended')ctx.resume();}};
}catch(e){}}
const muteBtn=$('#muteBtn'); const updMute=()=>{muteBtn.textContent=audioMuted?'🔇':'🔊';muteBtn.classList.toggle('off',audioMuted);};
updMute();
muteBtn.onclick=()=>{audioMuted=!audioMuted;try{localStorage.setItem('stele_muted',audioMuted?'1':'0');}catch(e){}
  if(AUDIO){AUDIO.setMuted(audioMuted);if(audioMuted)AUDIO.silence();}updMute();};
document.addEventListener('visibilitychange',()=>{ if(document.hidden&&S.mode==='play')togglePause(true);
  if(!AUDIO)return;try{if(document.hidden){AUDIO.silence();if(AUDIO.ctx.state==='running')AUDIO.ctx.suspend();}else if(!audioMuted&&AUDIO.ctx.state==='suspended')AUDIO.ctx.resume();}catch(e){}});

function toast(t){ const el=$('#toast'); el.textContent=t; el.classList.add('on'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('on'),2600); }

/* ===== ŁADOWANIE + SCENA ===== */
let renderer,scene,camera,drone,rotBlur=[],props=[],gates=[],tower=null,towerBox=null,sparks=null;
const ldSet=p=>{$('#ldPct').textContent=Math.round(p*100)+'%';$('#ldBar').style.width=(p*100)+'%';};

async function initScene(){
  try{ renderer=new THREE.WebGPURenderer({canvas,antialias:!MOBILE}); await renderer.init(); }
  catch(e){ $('#loader').classList.add('hidden'); $('#nofx').style.display='flex'; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,MOBILE?1.6:2));
  scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x150f1c,0.00042);   /* STELE ORBITAL: lekka kosmiczna mgiełka dla głębi */
  camera=new THREE.PerspectiveCamera(62,2,0.1,2600);
  ldSet(0.08);

  /* światło golden hour (jak applyDay(0.75) na stronie) */
  const sun=new THREE.DirectionalLight(0xffb45e,2.5); sun.position.set(-140,48,90); scene.add(sun);
  scene.add(new THREE.HemisphereLight(0x8a76b8,0x2b2014,0.8));
  scene.add(new THREE.AmbientLight(0xffd9a8,0.22));

  const texLoad=new THREE.TextureLoader();
  const loadTex=(u,srgb=true)=>new Promise(res=>texLoad.load(u,t=>{if(srgb)t.colorSpace=THREE.SRGBColorSpace;res(t);},undefined,()=>res(null)));

  /* HDRI zostaje TYLKO jako environment (odbicia PBR); tłem jest mgławica */
  await new Promise(res=>{ new RGBELoader().load(LAB.sky,tex=>{
    tex.mapping=THREE.EquirectangularReflectionMapping;
    scene.environment=tex; scene.environmentIntensity=0.42; res(); },undefined,()=>res()); });
  scene.background=new THREE.Color(0x0b0812);
  ldSet(0.24);

  /* ===== STELE ORBITAL: mgławica (FLUX) + gwiazdy ===== */
  const nebT=await loadTex(LAB.nebula);
  if(nebT){ nebT.wrapS=THREE.RepeatWrapping; nebT.repeat.set(2,1);
    const neb=new THREE.Mesh(new THREE.SphereGeometry(2100,40,24),
      new THREE.MeshBasicMaterial({map:nebT,side:THREE.BackSide,fog:false}));
    neb.rotation.y=1.1; scene.add(neb); }
  (function stars(){ const N=MOBILE?700:1600, pos=new Float32Array(N*3);
    for(let i=0;i<N;i++){ const v=new THREE.Vector3().randomDirection().multiplyScalar(1880+Math.random()*140);
      pos[i*3]=v.x;pos[i*3+1]=v.y;pos[i*3+2]=v.z; }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3));
    scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xfff6e0,size:1.9,sizeAttenuation:false,transparent:true,opacity:0.85,fog:false}))); })();
  ldSet(0.3);
  /* ===== LEWITUJĄCA WYSPA pod wieżą ===== */
  const terT=await loadTex(LAB.terrain);
  if(terT){terT.wrapS=terT.wrapT=THREE.RepeatWrapping;terT.repeat.set(4,4);}
  const rockT=await loadTex(LAB.rock);
  if(rockT){rockT.wrapS=rockT.wrapT=THREE.RepeatWrapping;rockT.repeat.set(3,2);}
  const ISL_R=62;
  const islTop=new THREE.Mesh(new THREE.CylinderGeometry(ISL_R,ISL_R-7,7,48),
    new THREE.MeshStandardMaterial({map:terT||undefined,color:0xb99e83,roughness:0.95}));
  islTop.position.y=-3.6; scene.add(islTop);
  const islRock=new THREE.Mesh(new THREE.CylinderGeometry(ISL_R-7,3,56,32,3),
    new THREE.MeshStandardMaterial({map:rockT||undefined,color:0x6f6052,roughness:1}));
  islRock.position.y=-35; scene.add(islRock);
  const islRim=new THREE.Mesh(new THREE.TorusGeometry(ISL_R-0.3,0.4,8,72),
    new THREE.MeshStandardMaterial({color:0x8a6f1e,metalness:0.9,roughness:0.35,emissive:0xA6957A,emissiveIntensity:0.18}));
  islRim.rotation.x=Math.PI/2; islRim.position.y=-0.35; scene.add(islRim);
  /* ===== ASTEROIDY + złote ringi orbitalne (zamiast kanciastych billboardów) ===== */
  let s2=17; const brnd=()=>((s2=s2*16807%2147483647)/2147483647);
  const astG=new THREE.DodecahedronGeometry(1,1);
  (function(){ const p=astG.attributes.position; const v=new THREE.Vector3();
    for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i);
      v.multiplyScalar(1+(Math.sin(v.x*5.3)+Math.cos(v.y*7.1)+Math.sin(v.z*6.2))*0.07);
      p.setXYZ(i,v.x,v.y,v.z);} astG.computeVertexNormals(); })();
  const astM=new THREE.MeshStandardMaterial({map:rockT||undefined,color:0x8d7c68,roughness:1});
  const orbitals=[];
  for(let k=0;k<(MOBILE?16:30);k++){
    const m=new THREE.Mesh(astG,astM);
    const a=brnd()*Math.PI*2, r=170+brnd()*760, y=-70+brnd()*260;
    if(r<210&&y>-16&&y<86){k--;continue;}   /* korytarz trasy wolny */
    m.position.set(Math.cos(a)*r,y,Math.sin(a)*r);
    m.scale.setScalar(3+brnd()*15); m.rotation.set(brnd()*3,brnd()*3,brnd()*3);
    scene.add(m); orbitals.push({m,sp:(brnd()-0.5)*0.24});
  }
  [[-560,120,-360,64],[640,64,430,84],[260,270,-680,72]].forEach(([x,y,z,R],k)=>{
    const rr=new THREE.Mesh(new THREE.TorusGeometry(R,1.7,10,80),
      new THREE.MeshStandardMaterial({color:0xA6957A,metalness:0.9,roughness:0.3,emissive:0xA6957A,emissiveIntensity:0.5}));
    rr.position.set(x,y,z); rr.rotation.set(0.9+k*0.5,k*0.7,0.25); scene.add(rr); orbitals.push({m:rr,sp:0.05}); });
  /* ===== DROGA MLECZNA (pas galaktyki, additive - czerń znika) + PLANETA na horyzoncie ===== */
  const mwT=await loadTex(LAB.milkyway);
  if(mwT){ mwT.wrapS=THREE.RepeatWrapping; mwT.repeat.set(2,1);
    const band=new THREE.Mesh(new THREE.CylinderGeometry(1960,1960,780,48,1,true),
      new THREE.MeshBasicMaterial({map:mwT,side:THREE.BackSide,transparent:true,opacity:0.8,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
    band.rotation.z=0.85; band.rotation.x=0.2; scene.add(band); }
  const plT=await loadTex(LAB.planet);
  if(plT){ const pl=new THREE.Mesh(new THREE.PlaneGeometry(620,620),
      new THREE.MeshBasicMaterial({map:plT,transparent:true,depthWrite:false,fog:false}));
    pl.position.set(-1240,430,-1120); pl.lookAt(0,80,0); scene.add(pl); }
  /* ===== PRZESZKODY: spadające asteroidy + złote meteory (No Man's Sky vibes) ===== */
  const hazards=[];
  for(let k=0;k<(MOBILE?4:7);k++){
    const meteor=k>=(MOBILE?2:4);   /* część to szybkie świecące meteory */
    const m=new THREE.Mesh(astG, meteor
      ? new THREE.MeshStandardMaterial({color:0x8a6a20,roughness:0.6,emissive:0xE3A93F,emissiveIntensity:1.6})
      : astM);
    const s=meteor?1.1+brnd()*1.2:1.7+brnd()*2.6; m.scale.setScalar(s); scene.add(m);
    const trail=new THREE.Mesh(new THREE.ConeGeometry(s*0.55,s*7,8,1,true),
      new THREE.MeshBasicMaterial({color:meteor?0xFFD98A:0xE3C766,transparent:true,opacity:meteor?0.4:0.2,
        blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false}));
    scene.add(trail);
    const h={m,trail,r:s,meteor,vel:new THREE.Vector3(),
      reset(){ const a=Math.random()*Math.PI*2, rr=26+Math.random()*170;
        this.m.position.set(Math.cos(a)*rr,140+Math.random()*90,Math.sin(a)*rr);
        const sp=this.meteor?26+Math.random()*16:9+Math.random()*11;
        this.vel.set((Math.random()-0.5)*(this.meteor?18:6),-sp,(Math.random()-0.5)*(this.meteor?18:6)); }};
    h.reset(); h.m.position.y-=Math.random()*170; hazards.push(h);
  }
  ldSet(0.5);

  /* WIEŻA - ten sam model co na stronie: rekonstrukcja V4 (meshopt GLB); oś bryły jest w XZ=0,
     asymetryczne schody nie mogą przesuwać budynku (bez centrowania po bbox), tylko baza na y=0 */
  const TOWER_H=66;
  await new Promise(res=>{ const gl=new GLTFLoader(); gl.setMeshoptDecoder(MeshoptDecoder);
    gl.load(LAB.tower,g=>{ tower=g.scene;
      const bb=new THREE.Box3().setFromObject(tower); const size=bb.getSize(new THREE.Vector3());
      const sc=TOWER_H/size.y; tower.scale.setScalar(sc);
      bb.setFromObject(tower);
      tower.position.set(0,-bb.min.y,0);
      scene.add(tower);
      towerBox=new THREE.Box3().setFromObject(tower); towerBox.expandByScalar(1.2);
      res(); },xhr=>{ if(xhr.total)ldSet(0.5+0.3*(xhr.loaded/xhr.total)); },()=>res()); });
  if(!tower){ /* awaryjnie prosta bryła, żeby gra żyła */
    const t=new THREE.Mesh(new THREE.BoxGeometry(22,TOWER_H,16),new THREE.MeshStandardMaterial({color:0x1d2836,metalness:0.7,roughness:0.2,emissive:0xFFD98A,emissiveIntensity:0.3}));
    t.position.y=TOWER_H/2; scene.add(t); towerBox=new THREE.Box3().setFromObject(t); }
  ldSet(0.82);

  /* ===== KWADRATOWE BRAMKI (rama art-deco, tekstura FLUX) ===== */
  const ornTex=await loadTex(LAB.gate);
  if(ornTex){ornTex.wrapS=ornTex.wrapT=THREE.RepeatWrapping;ornTex.repeat.set(1.6,0.28);}
  const OUT=8.6,IN=7.5,DEP=0.34;   /* subtelne jak w Uncrashed: cienka neonowa ramka (gr. ~0.55m), nie gruba płyta */
  const gShape=new THREE.Shape(); gShape.moveTo(-OUT/2,-OUT/2);gShape.lineTo(OUT/2,-OUT/2);gShape.lineTo(OUT/2,OUT/2);gShape.lineTo(-OUT/2,OUT/2);gShape.closePath();
  const hole=new THREE.Path(); hole.moveTo(-IN/2,-IN/2);hole.lineTo(IN/2,-IN/2);hole.lineTo(IN/2,IN/2);hole.lineTo(-IN/2,IN/2);hole.closePath();
  gShape.holes.push(hole);
  const gateGeo=new THREE.ExtrudeGeometry(gShape,{depth:DEP,bevelEnabled:true,bevelThickness:0.05,bevelSize:0.05,bevelSegments:1});
  gateGeo.translate(0,0,-DEP/2);
  /* trasa z BEZPIECZNYM dystansem od wieży (AABB V4 ~40x37 m + margines): spirala r>=39 (CatmullRom
     ścina rogi ~2m do środka - nadal czysto), rozgrzewka omija front szerokim łukiem,
     przelot nad koroną top+14 z podejściem z zewnątrz */
  const path=[];
  path.push({x:0,y:10,z:40,warm:true},{x:-28,y:13,z:18,warm:true});   /* 2. rozgrzewkowa odsunięta: przy V4 (pół-szer. ~20 m) stare (-20,10) wpadało w bryłę */
  path.push({x:-30,y:16,z:-30,start:true});
  /* spirala: start przy bramie startowej, SZEROKA (r 52->39) i wolniejsza (1.5PI zamiast 1.8PI) -
     bramki co ~35m, gra ma być przyjemna, nie ciasna; pierwsza bramka spirali ~32m za bramą startową */
  for(let i=0;i<8;i++){ const a=4.6+i/8*Math.PI*1.5, r=52-i*1.8;
    path.push({x:Math.cos(a)*r,y:16+i*(TOWER_H-8-16)/7,z:Math.sin(a)*r}); }
  path.push({x:0,y:TOWER_H+14,z:0});
  path.push({x:30,y:34,z:66},{x:64,y:16,z:124},{x:98,y:9,z:172});   /* 8 spirala + korona + 3 zjazd = 12 bramek wyścigu */
  for(let i=0;i<path.length;i++){
    const p=path[i], nx=path[i+1]||{x:p.x,y:p.y,z:p.z+40};
    const mat=new THREE.MeshStandardMaterial({color:0x6e5a1c,metalness:0.8,roughness:0.35,
      emissive:0xE24FD0, emissiveIntensity:0.3,transparent:true,opacity:0.95});
    const m=new THREE.Mesh(gateGeo,mat);
    m.position.set(p.x,p.y,p.z);
    m.lookAt(nx.x,nx.y,nx.z);
    scene.add(m);
    gates.push({m,mat,p,hit:false,warm:!!p.warm,start:!!p.start});
  }
  /* ===== LINIA PROWADZĄCA (jak w Uncrashed): świecąca zielona nić przez wszystkie bramki;
     segment znika po zaliczeniu bramki, do której prowadził ===== */
  const gpts=[new THREE.Vector3(0,10,74),...gates.map(g=>g.m.position.clone())];
  const guideCrv=new THREE.CatmullRomCurve3(gpts,false,'catmullrom',0.35);
  /* bezpiecznik: punkt krzywej w obrysie wieży -> wypchnij w XZ poza fasadę (linia nigdy przez budynek) */
  /* obrys z realnego AABB wieży (V4 jest szersza niż stary skan: ~40x37 m przy 66 m) + margines */
  const TB={hx:(towerBox.max.x-towerBox.min.x)/2+1.5,hz:(towerBox.max.z-towerBox.min.z)/2+1.5,top:TOWER_H+5};
  const clearPt=p=>{ if(p.y<TB.top){
    const f=Math.max(Math.abs(p.x)/TB.hx,Math.abs(p.z)/TB.hz);
    if(f<1){ const s=1/Math.max(f,0.2); p.x*=s; p.z*=s; } } return p; };  /* wypchnięcie promieniste = gładko, bez schodków */
  const guideSegs=[]; const NSEG=gpts.length-1;
  for(let i=0;i<NSEG;i++){
    const sub=[]; for(let k=0;k<=10;k++)sub.push(clearPt(guideCrv.getPoint((i+k/10)/NSEG)));
    const seg=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sub),20,0.09,6,false),
      new THREE.MeshBasicMaterial({color:0x54ff86,transparent:true,opacity:0.5,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));
    scene.add(seg); guideSegs.push(seg);
  }
  ldSet(0.9);

  /* ===== DRON FPV (wzorzec: poster studyjny; karbon FLUX + złote akcenty) ===== */
  const carbon=await loadTex(LAB.carbon);
  if(carbon){carbon.wrapS=carbon.wrapT=THREE.RepeatWrapping;carbon.repeat.set(2,2);}
  const carbM=new THREE.MeshStandardMaterial({map:carbon||undefined,color:carbon?0xffffff:0x191b1f,metalness:0.35,roughness:0.5});
  const goldM=new THREE.MeshStandardMaterial({color:0xA6957A,metalness:0.85,roughness:0.3});
  drone=new THREE.Group(); scene.add(drone);
  const SC=1.5; /* 5-calowy freestyle quad w stylu SpeedyBee Mario 5, powiększony do czytelności TPP */
  const darkM=new THREE.MeshStandardMaterial({color:0x14161a,metalness:0.5,roughness:0.45});
  const glossM=new THREE.MeshStandardMaterial({color:0x0e1013,metalness:0.72,roughness:0.2});
  /* rama true-X: unibody dolna płyta (2 skrzyżowane ramiona) + płyta centralna */
  const armGeo=new THREE.BoxGeometry(1.06*SC,0.024*SC,0.105*SC);
  [1,-1].forEach(s=>{ const a=new THREE.Mesh(armGeo,carbM); a.rotation.y=s*Math.PI/4; drone.add(a); });
  const botP=new THREE.Mesh(new THREE.BoxGeometry(0.30*SC,0.022*SC,0.42*SC),carbM); botP.position.y=0.026*SC; drone.add(botP);
  /* stack: złote standoffy + górna płyta karbonowa */
  [[-0.11,0.14],[0.11,0.14],[-0.11,-0.13],[0.11,-0.13]].forEach(([x,z])=>{
    const st=new THREE.Mesh(new THREE.CylinderGeometry(0.013*SC,0.013*SC,0.115*SC,8),goldM);
    st.position.set(x*SC,0.09*SC,z*SC); drone.add(st); });
  const topP=new THREE.Mesh(new THREE.BoxGeometry(0.30*SC,0.022*SC,0.46*SC),carbM); topP.position.y=0.155*SC; drone.add(topP);
  /* li-po na górze + złoty strap */
  const bat=new THREE.Mesh(new THREE.BoxGeometry(0.20*SC,0.115*SC,0.40*SC),darkM); bat.position.set(0,0.23*SC,0.05*SC); drone.add(bat);
  const strap=new THREE.Mesh(new THREE.BoxGeometry(0.225*SC,0.135*SC,0.075*SC),goldM); strap.position.set(0,0.23*SC,0.08*SC); drone.add(strap);
  /* canopy (pochylony klin) + kamera FPV z obiektywem */
  const can=new THREE.Mesh(new THREE.BoxGeometry(0.17*SC,0.10*SC,0.24*SC),glossM);
  can.position.set(0,0.205*SC,-0.22*SC); can.rotation.x=-0.42; drone.add(can);
  const camBox=new THREE.Mesh(new THREE.BoxGeometry(0.11*SC,0.10*SC,0.05*SC),darkM);
  camBox.position.set(0,0.24*SC,-0.335*SC); camBox.rotation.x=-0.42; drone.add(camBox);
  const lens=new THREE.Mesh(new THREE.CylinderGeometry(0.034*SC,0.042*SC,0.05*SC,14),
    new THREE.MeshStandardMaterial({color:0x0a0c10,metalness:0.95,roughness:0.1}));
  lens.rotation.x=Math.PI/2-0.42; lens.position.set(0,0.252*SC,-0.365*SC); drone.add(lens);
  /* 2 anteny VTX/RX odchylone do tyłu, złote końcówki */
  [-1,1].forEach(sx=>{ const ant=new THREE.Mesh(new THREE.CylinderGeometry(0.011*SC,0.011*SC,0.30*SC,6),
      new THREE.MeshStandardMaterial({color:0xcfcabe,roughness:0.6}));
    ant.position.set(sx*0.06*SC,0.29*SC,0.26*SC); ant.rotation.x=0.85; ant.rotation.z=sx*0.16; drone.add(ant);
    const tip=new THREE.Mesh(new THREE.CylinderGeometry(0.017*SC,0.017*SC,0.07*SC,8),goldM);
    tip.position.set(sx*0.075*SC,0.365*SC,0.36*SC); tip.rotation.x=0.85; tip.rotation.z=sx*0.16; drone.add(tip); });
  const blurTex=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');
    const gr=g.createRadialGradient(64,64,8,64,64,62);
    gr.addColorStop(0,'rgba(30,30,34,0)');gr.addColorStop(0.72,'rgba(34,34,40,0.34)');gr.addColorStop(0.86,'rgba(166,149,122,0.4)');gr.addColorStop(1,'rgba(30,30,34,0)');
    g.fillStyle=gr;g.beginPath();g.arc(64,64,63,0,7);g.fill();
    const t=new THREE.CanvasTexture(c);return t;})();
  /* silniki (bell złoty jak u Mario) + TRÓJŁOPATOWE śmigła 5" na końcach ramion true-X */
  const propM=new THREE.MeshStandardMaterial({color:0x181a20,roughness:0.35,metalness:0.4});
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{
    const mx=sx*0.375*SC, mz=sz*0.375*SC;
    const mBase=new THREE.Mesh(new THREE.CylinderGeometry(0.052*SC,0.058*SC,0.032*SC,12),darkM);
    mBase.position.set(mx,0.03*SC,mz); drone.add(mBase);
    const bell=new THREE.Mesh(new THREE.CylinderGeometry(0.056*SC,0.05*SC,0.052*SC,12),goldM);
    bell.position.set(mx,0.072*SC,mz); drone.add(bell);
    const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.009*SC,0.009*SC,0.032*SC,8),darkM);
    shaft.position.set(mx,0.112*SC,mz); drone.add(shaft);
    const prop=new THREE.Group(); prop.position.set(mx,0.126*SC,mz); drone.add(prop);
    for(let b=0;b<3;b++){ const g=new THREE.BoxGeometry(0.34*SC,0.006*SC,0.04*SC); g.translate(0.17*SC,0,0);
      const bl=new THREE.Mesh(g,propM); bl.rotation.order='YXZ';
      bl.rotation.y=b*Math.PI*2/3; bl.rotation.x=0.32; prop.add(bl); }
    props.push(prop);
    const disc=new THREE.Mesh(new THREE.CircleGeometry(0.22*SC,20),new THREE.MeshBasicMaterial({map:blurTex,transparent:true,depthWrite:false,opacity:0}));
    disc.rotation.x=-Math.PI/2; disc.position.set(mx,0.13*SC,mz); drone.add(disc); rotBlur.push(disc);
    const led=new THREE.Mesh(new THREE.SphereGeometry(0.026*SC,8,6),
      new THREE.MeshStandardMaterial({color:sz>0?0xff3040:0xA6957A,emissive:sz>0?0xff3040:0xA6957A,emissiveIntensity:2.4}));
    led.position.set(mx,-0.015*SC,mz); drone.add(led); });
  /* iskry kolizji */
  const spG=new THREE.BufferGeometry(); const spN=42; const spP=new Float32Array(spN*3); spG.setAttribute('position',new THREE.BufferAttribute(spP,3));
  sparks=new THREE.Points(spG,new THREE.PointsMaterial({color:0xE3C766,size:0.16,transparent:true,opacity:0}));
  sparks.userData={vel:[],t:1e9}; scene.add(sparks);
  ldSet(1);

  camera.position.set(0,14,66); camera.lookAt(0,30,0);
  function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
  addEventListener('resize',resize); resize();
  setTimeout(()=>{$('#loader').classList.add('hidden');S.mode='sel';},250);

  /* ===== HELPERS ===== */
  const gateHud=$('#gateN');
  function setChkpt(g){ D.ckpt.pos.copy(g.m.position); const nx=gates[gates.indexOf(g)+1];
    D.ckpt.yaw=nx?Math.atan2(nx.m.position.x-g.m.position.x,nx.m.position.z-g.m.position.z):D.yaw; }
  function respawn(){ D.pos.copy(D.ckpt.pos); D.pos.z+=0.01; D.vel.set(0,0,0); D.yaw=D.ckpt.yaw; D.fwd=0;
    $('#hitfx').classList.remove('on'); void $('#hitfx').offsetWidth; $('#hitfx').classList.add('on');
    if(AUDIO)AUDIO.crash(); message(L('hit'),''); }
  function burst(p){ const u=sparks.userData; u.t=0; u.vel=[];
    for(let i=0;i<spN;i++){ spP[i*3]=p.x;spP[i*3+1]=p.y;spP[i*3+2]=p.z;
      u.vel.push(new THREE.Vector3((Math.random()-0.5)*7,(Math.random())*6,(Math.random()-0.5)*7)); }
    sparks.geometry.attributes.position.needsUpdate=true; sparks.material.opacity=1; }
  let msgTok=0;
  function message(t,s){ $('#msgT').textContent=t; $('#msgS').textContent=s||''; const el=$('#msgbar'); el.classList.add('show');
    const my=++msgTok; setTimeout(()=>{if(my===msgTok)el.classList.remove('show');},1600); }
  function activeGate(){ return gates.find(g=>!g.hit); }

  function toggleCam(){ S.fpv=!S.fpv; document.body.classList.toggle('fpv',S.fpv);
    $('#camBtn').textContent=S.fpv?L('camf'):L('cam3'); }
  window.toggleCam=toggleCam;
  $('#camBtn').onclick=()=>toggleCam();

  /* ===== PĘTLA ===== */
  const MAXF=30, MAXS=14, MAXC=10;
  let last=performance.now();
  renderer.setAnimationLoop(t=>{
    const dt=Math.min((t-last)/1000,0.05); last=t;
    if(S.mode==='pause')return;
    /* śmigła zawsze wirują lekko */
    const spd=D.vel.length();
    props.forEach(p=>p.rotation.y+=dt*(20+spd*3));
    rotBlur.forEach(d=>d.material.opacity=Math.min(0.85,0.2+spd*0.04));
    /* puls bramek */
    /* kolory jak w Uncrashed: aktywna = neon zielony, kolejne = różowe, ramy zostają złote (map) */
    gates.forEach((g,i)=>{ if(!g.hit){ const act=activeGate()===g;
      g.mat.emissive.setHex(act?0x39ff6e:0xE24FD0);
      g.mat.emissiveIntensity=act?(1.15+Math.sin(t*0.006)*0.5):0.3;
      g.mat.opacity=act?0.98:0.8;
      if(guideSegs[i])guideSegs[i].material.opacity=act?(0.62+Math.sin(t*0.005)*0.2):0.34; } });
    /* asteroidy i ringi powoli wirują */
    orbitals.forEach(o=>{ o.m.rotation.y+=o.sp*dt; });
    /* spadające przeszkody: ruch + ogon + kolizja z dronem */
    const _vn=new THREE.Vector3();
    hazards.forEach(h=>{ h.m.position.addScaledVector(h.vel,dt);
      h.m.rotation.x+=dt*1.1; h.m.rotation.y+=dt*0.8;
      _vn.copy(h.vel).normalize();
      h.trail.position.copy(h.m.position).addScaledVector(_vn,-h.r*3.2);
      h.trail.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),_vn.clone().negate());
      if(h.m.position.y<-90)h.reset();
      if(S.mode==='play'&&h.m.position.distanceTo(D.pos)<h.r*1.15+0.6){ burst(D.pos.clone()); h.reset(); respawn(); }
    });
    /* iskry */
    const su=sparks.userData;
    if(su.t<0.7){ su.t+=dt; for(let i=0;i<spN;i++){ spP[i*3]+=su.vel[i].x*dt; spP[i*3+1]+=su.vel[i].y*dt-4*su.t*dt; spP[i*3+2]+=su.vel[i].z*dt; }
      sparks.geometry.attributes.position.needsUpdate=true; sparks.material.opacity=Math.max(0,1-su.t/0.7); }

    if(S.mode==='play'){
      /* --- WEJŚCIA: celownik (mysz/dotyk/pad) + klawisze jako alternatywa --- */
      const pad=padState();
      const DEADZ=0.06;
      let sx=Math.abs(aim.x)>DEADZ?aim.x:0, sy=Math.abs(aim.y)>DEADZ?aim.y:0;
      /* krzywa expo - precyzja przy środku, moc na brzegu */
      sx=Math.sign(sx)*Math.pow(Math.abs(sx),1.5); sy=Math.sign(sy)*Math.pow(Math.abs(sy),1.5);
      const kx=(keys['ArrowRight']||keys['KeyD']?1:0)-(keys['ArrowLeft']||keys['KeyA']?1:0);
      const ky=(keys['ArrowDown']?1:0)-(keys['ArrowUp']?1:0)+((keys['ShiftLeft']||keys['ShiftRight'])?1:0)-(keys['Space']?1:0);
      if(kx)sx=kx*0.85; if(ky)sy=ky*0.8;
      if(pad&&(pad.x||pad.y)){ sx=pad.x; sy=pad.y; }
      const boost=keys['KeyW']||boostTouch||(pad&&pad.boost);
      const slow=keys['KeyS']||(pad&&pad.slow);
      /* --- FIZYKA ARCADE: dron zawsze leci naprzód (jak w Uncrashed-casual) --- */
      const BASE=13,BST=15,SLW=7;
      const spdT=BASE+(boost?BST:0)-(slow?SLW:0);
      D.fwd+=(spdT-D.fwd)*(1-Math.exp(-2.2*dt));
      D.yawRate+=(-sx*1.55-D.yawRate)*(1-Math.exp(-7*dt));
      D.yaw+=D.yawRate*dt;
      D.climb+=((-sy*9.5)-D.climb)*(1-Math.exp(-5*dt));
      const sin=Math.sin(D.yaw),cos=Math.cos(D.yaw);
      const tgt=new THREE.Vector3(sin*D.fwd, D.climb, cos*D.fwd);
      D.vel.lerp(tgt,1-Math.exp(-3.2*dt));
      D.pos.addScaledVector(D.vel,dt);
      D.pos.y=Math.min(TOWER_H+80,D.pos.y);
      /* kolizje: wieża (AABB), płyta wyspy, spadek w pustkę kosmosu */
      if(towerBox&&towerBox.containsPoint(D.pos)){ burst(D.pos.clone()); respawn(); }
      const overIsl=Math.hypot(D.pos.x,D.pos.z)<ISL_R+2;
      if(overIsl)D.pos.y=Math.max(1.6,D.pos.y);
      else if(D.pos.y<-28){ burst(D.pos.clone()); respawn(); }
      /* orientacja drona */
      drone.position.copy(D.pos);
      D.bank+=((sx*-0.6+D.yawRate*0.18)-D.bank)*(1-Math.exp(-6*dt));
      D.tilt+=((0.16+D.fwd*0.012+(boost?0.14:0))-D.tilt)*(1-Math.exp(-6*dt));
      drone.rotation.set(D.tilt,D.yaw+Math.PI,D.bank,'YXZ');
      if(AUDIO)AUDIO.rotor(spd);
      /* --- BRAMKI --- */
      const g=activeGate();
      if(g){ const d=D.pos.distanceTo(g.m.position);
        if(d<IN/2+0.9){
          g.hit=true; g.mat.emissiveIntensity=3; g.mat.color.setHex(0x69c778); g.mat.emissive.setHex(0x69c778);
          setTimeout(()=>{g.m.visible=false;},380);
          const gi=gates.indexOf(g); if(guideSegs[gi])guideSegs[gi].visible=false;
          setChkpt(g);
          if(g.warm){ message(L('warmlbl')+' '+(gates.filter(x=>x.hit&&x.warm).length)+' / '+WARM_N,''); if(AUDIO)AUDIO.chime(false); }
          else if(g.start){ /* brama startowa: odliczanie i timer */
            startRace();
          } else {
            S.gates++; gateHud.textContent=String(S.gates).padStart(2,'0');
            if(AUDIO)AUDIO.chime(S.gates===GATES_N);
            message(L('gate')+' '+S.gates+' / '+GATES_N,'');
            if(S.gates>=GATES_N){ message(L('allg'),''); if(AUDIO)AUDIO.fanfare(); setTimeout(()=>endRun(true),700); }
          }
        } }
      /* --- HUD: chevron + timer --- */
      const ag=activeGate();
      if(ag){ const v=ag.m.position.clone().project(camera);
        const on=v.z<1&&Math.abs(v.x)<0.92&&Math.abs(v.y)<0.9;
        const ch=$('#chev'); ch.style.opacity=on?0.25:1;
        const ang=Math.atan2(v.x, v.y);
        ch.style.transform=`rotate(${ang}rad)`; }
      if(S.phase==='race'&&!S.done){
        const el=Math.max(0,TIME_LIMIT-(t-S.t0)/1000);
        $('#curTime').innerHTML=el.toFixed(1)+'<small> s</small>';
        if(el<=0){ message(L('timeout'),''); endRun(false); } }
      $('#telSpd').textContent=Math.round(spd*3.6); $('#telAlt').textContent=Math.round(D.pos.y);
      /* --- KAMERA --- */
      if(S.fpv){
        const fw=new THREE.Vector3(Math.sin(D.yaw),0,Math.cos(D.yaw));
        camera.position.copy(D.pos).addScaledVector(fw,0.28); camera.position.y+=0.12;
        const tgt=D.pos.clone().addScaledVector(fw,12); tgt.y+=1.1-D.tilt*7;
        camera.lookAt(tgt); camera.rotation.z+=D.bank*0.5;
        if(!S.stable){ camera.position.x+=Math.sin(t*0.02)*spd*0.0005; camera.position.y+=Math.sin(t*0.027)*spd*0.00038; }
        camera.fov=THREE.MathUtils.lerp(camera.fov,92,1-Math.pow(0.02,dt));
      } else {
        const back=5.4+spd*0.14, up=2.5;
        const cx=D.pos.x-Math.sin(D.yaw)*back, cz=D.pos.z-Math.cos(D.yaw)*back;
        camera.position.lerp(new THREE.Vector3(cx,D.pos.y+up,cz),1-Math.pow(S.stable?0.004:0.0012,dt));
        camera.lookAt(D.pos.x,D.pos.y+0.5,D.pos.z);
        camera.rotation.z+=D.bank*0.14;
        camera.fov=THREE.MathUtils.lerp(camera.fov,60+spd*0.5,1-Math.pow(0.02,dt));
      }
      camera.updateProjectionMatrix();
    } else if(S.mode==='sel'||S.mode==='end'){
      const a=t*0.00009; camera.position.set(Math.sin(a)*95,32,Math.cos(a)*95); camera.lookAt(0,TOWER_H*0.55,0);
      camera.fov=THREE.MathUtils.lerp(camera.fov,62,0.05); camera.updateProjectionMatrix();
    }
    renderer.render(scene,camera);
  });

  /* ===== PRZEBIEG GRY ===== */
  function startRace(){ S.phase='count'; document.body.classList.remove('warm');
    const cEl=$('#count'); let n=3;
    (function step(){ if(n>0){ cEl.textContent=n; cEl.classList.remove('show'); void cEl.offsetWidth; cEl.classList.add('show'); if(AUDIO)AUDIO.chime(false); n--; setTimeout(step,850);}
      else { cEl.textContent='GO'; cEl.classList.remove('show'); void cEl.offsetWidth; cEl.classList.add('show'); if(AUDIO)AUDIO.chime(true);
        S.phase='race'; S.t0=performance.now(); setTimeout(()=>cEl.classList.remove('show'),900); } })();
  }
  function endRun(all){
    S.mode='end'; S.done=true; if(AUDIO)AUDIO.silence();
    document.body.classList.remove('playing');
    $('#hud').classList.add('hidden'); $('#camBtn').classList.add('hidden');
    const t=(performance.now()-S.t0)/1000;
    const win=all&&t<=TIME_LIMIT;
    $('#endTitle').textContent=win?L('win'):L('land');
    let best=S.best;
    if(win&&(best==null||t<best)){best=t;S.best=t;try{localStorage.setItem('stele_drone_best',String(t));}catch(e){}}
    let html=(LANG==='en'?'Gates: ':'Bramki: ')+'<b>'+S.gates+' / '+GATES_N+'</b>';
    if(all) html+=' · '+(LANG==='en'?'time':'czas')+': <b>'+t.toFixed(1)+' s</b>';
    if(best!=null) html+=' · '+(LANG==='en'?'best':'rekord')+': <b>'+best.toFixed(1)+' s</b>';
    if(!win) html+='<br>'+(LANG==='en'?'Pass all 12 gates within the limit to unlock the demo achievement.':'Zalicz wszystkie 12 bramek w limicie, aby odblokować odznakę demo.');
    $('#endSub').innerHTML=html;
    const cw=$('#codeWrap'); if(win){cw.classList.remove('hidden');$('#claimBtn').href='/';}else cw.classList.add('hidden');
    $('#endScreen').classList.remove('hidden');
  }
  window.__endRun=endRun;
  function begin(){
    $('#selScreen').classList.add('hidden'); $('#endScreen').classList.add('hidden');
    gates.forEach(g=>{g.hit=false;g.m.visible=true;g.mat.color.setHex(0x6e5a1c);g.mat.emissive.setHex(0xE24FD0);g.mat.emissiveIntensity=0.3;});
    guideSegs.forEach(s=>{s.visible=true;});
    S.gates=0; S.done=false; S.phase='warm'; gateHud.textContent='00'; $('#gateT').textContent=GATES_N;
    $('#curTime').innerHTML=TIME_LIMIT.toFixed(1)+'<small> s</small>';
    S.stable=RM||$('#stableCam').checked;
    D.pos.set(0,10,74); D.vel.set(0,0,0); D.yaw=Math.PI; D.fwd=0; D.ckpt.pos.copy(D.pos); D.ckpt.yaw=Math.PI;
    $('#hud').classList.remove('hidden'); $('#camBtn').classList.remove('hidden');
    document.body.classList.add('playing','warm'); document.body.classList.toggle('fpv',S.fpv);
    $('#gateLbl').textContent=L('warmlbl');
    setTimeout(()=>{$('#gateLbl').textContent=L('gates');},4000);
    message(L('warm'),'');
    S.mode='play';
   
  }
  window.begin=begin;
  function togglePause(force){
    if(S.mode==='play'&&(force||true)){ S.mode='pause'; S.pausedAt=performance.now(); $('#pause').classList.add('on'); if(AUDIO)AUDIO.silence(); }
    else if(S.mode==='pause'){ S.mode='play'; if(S.phase==='race')S.t0+=performance.now()-S.pausedAt;
      $('#pause').classList.remove('on'); }
  }
  window.togglePause=t=>{ if(S.mode==='pause'&&!t){togglePause();} else if(S.mode==='play'){togglePause(true);} };
  /* Esc wychodzi z pointer lock → pauza; wznowienie przyciskiem */
  $('#resumeBtn').onclick=()=>{ if(S.mode==='pause'){ S.mode='play'; if(S.phase==='race')S.t0+=performance.now()-S.pausedAt;
    $('#pause').classList.remove('on'); } };
  $('#startBtn').onclick=()=>{initAudio();if(AUDIO)AUDIO.resume();begin();};
  $('#againBtn').onclick=()=>{initAudio();if(AUDIO)AUDIO.resume();begin();};
}

/* udostępnianie */
$('#shareBtn').onclick=async()=>{
  const t=S.best!=null?S.best.toFixed(1)+'s':'—';
  const text=LANG==='en'?('I flew the STELE FPV course in '+t+'! Try to beat it.'):('Przeleciałem trasę FPV STELE w '+t+'! Spróbuj pobić.');
  const url=location.origin+location.pathname.replace(/gra\.html$/,'');
  try{ if(navigator.share)await navigator.share({title:'STELE - lot dronem FPV',text,url});
    else{await navigator.clipboard.writeText(text+' '+url);$('#shareBtn').textContent=LANG==='en'?'Copied ✓':'Skopiowano ✓';setTimeout(()=>$('#shareBtn').textContent=L('share'),1800);} }catch(e){}
};

initScene().catch(e=>{ console.warn('init failed',e); $('#loader').classList.add('hidden'); $('#nofx').style.display='flex'; });
