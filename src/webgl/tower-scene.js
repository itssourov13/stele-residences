import {THREE, tslTexture, tslFloat, tslVec3, GLTFLoader, RGBELoader, MeshoptDecoder} from './vendor3d.js';
import {M3D} from '../config/assets.js';

/**
 * Interactive STELE tower: WebGPU renderer (automatic WebGL2 fallback), floor picking,
 * scroll-driven camera flight, day/night slider, 360 lobby with the Ines concierge.
 * Ported from the supplied source (inline_script_6.js, second half). Heavy: this module is
 * lazy-loaded by sections/tower.js and pulls the `three` chunk only when the tower nears the viewport.
 * Requires the DOM from index.html (#tower3d, #tlo, #dayNight, #flightzone, ...).
 */
export function initTowerScene(){
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const MOBILE=innerWidth<760;
const canvas=document.getElementById('tower3d');
const tlo=document.getElementById('tlo');
const isEN=()=>document.documentElement.lang==='en';
const setFloorFilter=f=>window.setFloorFilter&&window.setFloorFilter(f);
if(!canvas||!tlo)return;
/* Concept 3D scene: procedural tower/city geometry, generated HDR lighting and illustrative river/city context. */
let renderer,scene,camera,floorPickers=[],selected=null,hovered=null;
let ioVisible=false,pageHidden=false,started=false;   // FIX z audytu VELOCE: widoczność IO i karty trzymane OSOBNO
const FLOORS=18,TH=11.2;               // TH = wysokość wieży w jednostkach świata
const OFF=5.4;                          // offset spline'u przelotu (stary układ miał środek wieży w y=0)
const dayInput=document.getElementById('dayNight');
const fzEl=document.getElementById('flightzone');
const tbFloor=document.getElementById('tbFloor');

function fail(){ canvas.style.display='none'; tlo.classList.remove('off'); tlo.innerHTML='<span class="tmark">STELE</span><span style="color:var(--muted);font-size:12px;letter-spacing:.1em">'+(isEN()?'3D preview is unavailable on this device':'Podgląd 3D niedostępny na tym urządzeniu')+'</span>'; }

async function init3D(){
  try{
    renderer=new THREE.WebGPURenderer({canvas,antialias:!MOBILE,alpha:true});
    await renderer.init();
    /* device.lost (sleep/wake/TDR) = czarny canvas bez recovery -> pokaż fallback zamiast wisieć */
    try{ renderer.backend&&renderer.backend.device&&renderer.backend.device.lost&&renderer.backend.device.lost.then(()=>fail()); }catch(_){}
    const gpu=!!(renderer.backend&&renderer.backend.isWebGPUBackend);
    if(gpu){ const chip=document.getElementById('gpuChip'); if(chip)chip.hidden=false; }
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,MOBILE?1.5:2));
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.2;
    if(!MOBILE){ renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; }

    scene=new THREE.Scene();
    scene.fog=new THREE.Fog(0xdcd1c3,110,280);   // v12: liniowa mgla (fog-fix Codexa) - bliski plan czysty, gasnie tylko daleki
    camera=new THREE.PerspectiveCamera(34,2,0.1,320);

    /* ---- niebo HDRI (tło + IBL) ---- */
    /* v12: czyste niebo HDR z Blendera (Codex 2026-09-05) - bez fotograficznej zabudowy/gor w panoramie; obrot 0 */
    const SKYROT=0;
    new RGBELoader().load((MOBILE?M3D.skyLow:M3D.sky),tex=>{
      tex.mapping=THREE.EquirectangularReflectionMapping;
      scene.background=tex; scene.environment=tex;
      scene.backgroundBlurriness=0;
      scene.backgroundRotation=new THREE.Euler(0,SKYROT,0);
      scene.environmentRotation=new THREE.Euler(0,SKYROT,0);
      applyDay(parseFloat(dayInput.value)); needsRender=true;
    });
    
    /* ---- światła ---- */
    const sun=new THREE.DirectionalLight(0xffc07a,2.4); scene.add(sun);
    sun.position.set(-16,7,10);
    if(!MOBILE){ sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
      const sc=sun.shadow.camera; sc.left=-16;sc.right=16;sc.top=18;sc.bottom=-6; sc.near=2; sc.far=60; sun.shadow.bias=-0.0004; }
    const hemi=new THREE.HemisphereLight(0x8fa8cf,0x241d16,0.35); scene.add(hemi);
    const amb=new THREE.AmbientLight(0xffe9cf,0.12); scene.add(amb);

    const towerGroup=new THREE.Group(); scene.add(towerGroup);
    let needsRender=true;   // deklaracja PRZED applyDay (TDZ)

    /* ========== OTOCZENIE ========== */
    /* linia nabrzeża: ląd z tyłu (z < BND), woda z przodu */
    const BND=[[-46,-3],[-32,2],[-20,5.2],[-9,7.4],[2,8.7],[13,8.3],[24,6.2],[36,3],[46,-1]];

    /* woda */
    const wnorm=new THREE.TextureLoader().load(M3D.waterNormals,()=>{needsRender=true;});
    wnorm.wrapS=wnorm.wrapT=THREE.RepeatWrapping; wnorm.repeat.set(15,15);
    const waterMat=new THREE.MeshStandardMaterial({color:0x1c2b38,metalness:0.92,roughness:0.11,
      normalMap:wnorm,normalScale:new THREE.Vector2(0.55,0.55),envMapIntensity:1.15});
    const water=new THREE.Mesh(new THREE.PlaneGeometry(900,900),waterMat);
    water.rotation.x=-Math.PI/2; water.position.y=-0.42; scene.add(water);
    /* v12: ciemny podklad pod wyspa (y=-0.12, nad woda) - linia brzegowa zdjeta z GLB miasta skanem raycastem co 2 j.,
       cofnieta 0.3 pod teren; bez niego przez szczeliny/otwory terenu przy niskiej kamerze przeswitywala plynaca woda.
       Pomosty (x=-6..-4, 24..34) pominiete = woda pod nimi zostaje. */
    const SHORE=[[-450,-15],[-130,-15],[-126,-14.5],[-122,-14.5],[-118,-14.5],[-114,-14],[-110,-14],[-106,-13.5],[-102,-13.5],[-98,-13],[-94,-13],[-90,-13],[-86,-12.5],[-82,-12.5],[-78,-11.5],[-74,-10.5],[-70,-9.5],[-66,-8.5],[-62,-7.5],[-58,-6.5],[-54,-5.5],[-50,-4.5],[-46,-3],[-42,-1.5],[-38,0],[-34,1],[-30,2.5],[-26,3.5],[-22,4.5],[-18,5.5],[-14,6.5],[-10,7],[-6,7.7],[-2,8],[2,8.5],[6,8.5],[10,8.5],[14,8],[18,7],[22,6.5],[26,5.5],[30,4.5],[34,3.5],[38,2],[42,0.5],[46,-1],[50,-2.5],[54,-3.5],[58,-5],[62,-6.5],[66,-7.5],[70,-9],[74,-10],[78,-11.5],[82,-12.5],[86,-12.5],[90,-13],[94,-13],[98,-13],[102,-13.5],[106,-13.5],[110,-14],[114,-14],[118,-14.5],[122,-14.5],[126,-14.5],[130,-15],[450,-15]];
    (function(){ const INS=0.15, baseMat=new THREE.MeshStandardMaterial({color:0x1d1a17,roughness:1});
      const sh=new THREE.Shape(); sh.moveTo(SHORE[0][0],-(SHORE[0][1]-INS));
      for(let i=1;i<SHORE.length;i++)sh.lineTo(SHORE[i][0],-(SHORE[i][1]-INS));
      sh.lineTo(450,450); sh.lineTo(-450,450); sh.closePath();
      const g=new THREE.ShapeGeometry(sh,1); g.rotateX(-Math.PI/2);
      const base=new THREE.Mesh(g,baseMat); base.position.y=-0.12; base.name='island-base'; scene.add(base);
      /* skirt: teren GLB na flankach (|x|>50) to plaszczyzna bez boku - pionowa ciemna skarpa wzdluz brzegu zamyka
         przeswit miedzy terenem a woda; w centrum chowa sie za prawdziwym murem nabrzeza (Quay_stone) */
      const pos=[],idx=[]; for(let i=0;i<SHORE.length;i++){ const [x,z]=SHORE[i]; pos.push(x,-0.03,z-INS, x,-0.75,z-INS); }
      for(let i=0;i<SHORE.length-1;i++){ const a=i*2; idx.push(a,a+1,a+2, a+1,a+3,a+2); }
      const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); sg.setIndex(idx); sg.computeVertexNormals();
      const skirt=new THREE.Mesh(sg,new THREE.MeshStandardMaterial({color:0x1d1a17,roughness:1,side:THREE.DoubleSide})); skirt.name='island-skirt'; scene.add(skirt); })();

    const plA=new THREE.PointLight(0xFFC97A,2.2,7,2); plA.position.set(-6,0.9,6.2); scene.add(plA);
    const plB=new THREE.PointLight(0xFFC97A,2.2,7,2); plB.position.set(7,0.9,7.4); scene.add(plB);

    /* ========== ULICE - tylko krzywe ruchu aut/ludzi (nawierzchnie, chodniki, lampy sa w GLB miasta) ========== */
    const crv=pts=>{ const c=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],0,p[1]))); c.curveType='centripetal'; return c; };
    /* FIZYKA UKŁADU: droga trzyma się DALEKO od wieży (łuk daleko za placem, pas zieleni między) */
    const roadA=crv([[-46,-5],[-34,-3.4],[-24,-6],[-14,-9.4],[-6,-11],[0,-11.4],[6,-11],[14,-9.4],[24,-6],[34,-3.4],[46,-5]]);
    /* v12: os alei zdjeta z asfaltu GLB miasta (skan raycastem co 2.5 j.) - stara krzywa wypadala 3 j. obok jezdni */
    const roadB=crv([[-85,-22.8],[-70,-20.1],[-55,-17],[-40,-14.3],[-30,-13.5],[-20,-14.3],[-10,-15.9],[0,-17],[10,-16.3],[20,-15],[30,-15.3],[45,-17.3],[60,-19.8],[75,-22.4],[85,-24]]); // aleja za wieżą

    /* pojazdy */
    const VEH=[];
    const headMat=new THREE.MeshStandardMaterial({color:0xfff6e0,emissive:0xFFF3C4,emissiveIntensity:3.2});
    const tailMat=new THREE.MeshStandardMaterial({color:0x550000,emissive:0xff2a1a,emissiveIntensity:2.6});
    function makeCar(col,scale,gold){
      /* dlugosc auta wzdluz +Z = przod (lookAt celuje +Z w kierunek jazdy) */
      const g=new THREE.Group();
      const body=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.13,0.78),
        new THREE.MeshStandardMaterial({color:col,metalness:gold?1:0.7,roughness:gold?0.22:0.45,envMapIntensity:gold?1.5:0.8}));
      body.position.y=0.1; g.add(body);
      const cab=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.1,gold?0.4:0.36),
        new THREE.MeshStandardMaterial({color:0x0c0e12,metalness:0.6,roughness:0.2}));
      cab.position.set(0,0.2,gold?-0.03:0); g.add(cab);
      const hl=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.035,0.03),headMat); hl.position.set(0,0.1,0.39); g.add(hl);
      const tl2=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.03,0.02),tailMat); tl2.position.set(0,0.11,-0.39); g.add(tl2);
      g.scale.setScalar(scale); scene.add(g); return g; }
    (function(){
      const cols=[0x22242a,0x3a3d44,0x14161b,0x4a4038,0x2c3038];
      /* FIZYKA RUCHU: w obrębie pasa wszyscy jadą tą samą prędkością i z równym rozstawem = zero kolizji */
      const lane=(curve,dir,off,v,ts,mk)=>ts.forEach((t,i)=>VEH.push({o:mk(i),c:curve,t,v,d:dir,off}));
      lane(roadB, 1, 0.45,0.012,[0.06,0.39,0.72],i=>makeCar(cols[i%5],1));
      lane(roadB,-1,-0.45,0.010,[0.20,0.53,0.86],i=>makeCar(cols[(i+2)%5],1));
      lane(roadA,-1,-0.36,0.008,[0.10,0.43,0.76],i=>makeCar(cols[(i+1)%5],0.94));
      /* SUPERSAMOCHÓD - złoty, sam na swoim pasie bulwaru */
      VEH.push({o:makeCar(0xA6957A,1.06,true),c:roadA,t:0.35,v:0.0065,d:1,off:0.36,star:true});
    })();
    function updateVehicles(dt){
      VEH.forEach(v=>{
        /* v9: fizyka - auta ZWALNIAJĄ na łukach (ostrość z różnicy stycznych; cała kolumna
           zwalnia w tym samym miejscu = odstępy naturalnie się zagęszczają jak w realu) */
        const tgA=v.c.getTangent(v.t), tgB=v.c.getTangent((v.t+0.015*v.d+1)%1);
        const kSlow=0.55+0.45*Math.pow(Math.max(0,tgA.dot(tgB)),14);
        v.t=(v.t+v.v*kSlow*dt*v.d+1)%1;
        const p=v.c.getPoint(v.t),tg=v.c.getTangent(v.t);
        const nx=-tg.z,nz=tg.x;
        v.o.position.set(p.x+nx*v.off,0.02,p.z+nz*v.off);
        v.o.lookAt(p.x+nx*v.off+tg.x*v.d,0.02,p.z+nz*v.off+tg.z*v.d); });
    }

    /* ========== MOTORÓWKI ========== */
    const wakeTex=(()=>{ const c=document.createElement('canvas'); c.width=128;c.height=64; const g=c.getContext('2d');
      const gr=g.createLinearGradient(0,0,128,0);
      gr.addColorStop(0,'rgba(255,255,255,0)'); gr.addColorStop(0.75,'rgba(255,255,255,0.35)'); gr.addColorStop(1,'rgba(255,255,255,0.75)');
      g.fillStyle=gr; g.beginPath(); g.moveTo(0,10); g.lineTo(128,28); g.lineTo(128,36); g.lineTo(0,54); g.closePath(); g.fill();
      const t=new THREE.CanvasTexture(c); return t; })();
    const BOATS=[],MOORED=[];
    function makeBoat(){
      const g=new THREE.Group();
      const hull=new THREE.Mesh(new THREE.BoxGeometry(1.15,0.14,0.36),new THREE.MeshStandardMaterial({color:0x1a1c22,metalness:0.5,roughness:0.5}));
      hull.position.y=0.06; g.add(hull);
      const bow=new THREE.Mesh(new THREE.ConeGeometry(0.18,0.42,4),hull.material);
      bow.rotation.z=-Math.PI/2; bow.rotation.y=Math.PI/4; bow.position.set(0.75,0.06,0); bow.scale.set(1,1,0.8); g.add(bow);
      const cab2=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.14,0.26),new THREE.MeshStandardMaterial({color:0x2b2e35,metalness:0.4,roughness:0.4}));
      cab2.position.set(-0.08,0.2,0); g.add(cab2);
      const lamp=new THREE.Mesh(new THREE.SphereGeometry(0.035,8,6),new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xFFE9B8,emissiveIntensity:3}));
      lamp.position.set(-0.5,0.32,0); g.add(lamp);
      /* kilwater usunięty - fragment tekstury wyglądał jak wycinek na wodzie przy brzegu */
      scene.add(g); return g; }
    const loopCrv=pts=>new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],0,p[1])),true,'centripetal');
    /* v12: petle w obrebie rzeki nowego miasta - daleki brzeg (nabrzeze) zaczyna sie w z=43, bliski konczy w z<=8.5 */
    [{p:[[-78,20],[-10,16],[70,20],[74,34],[-40,36]],v:0.010},
     {p:[[74,26],[5,29],[-78,23],[-60,37],[40,35]],v:0.008},
     {p:[[-78,32],[0,28],[74,27],[76,37],[-50,37]],v:0.006}].forEach((b,i)=>{
      BOATS.push({o:makeBoat(),c:loopCrv(b.p),t:i*0.33,v:b.v}); });
    function updateBoats(dt,tm){
      BOATS.forEach((b,i)=>{ b.t=(b.t+b.v*dt)%1;
        const p=b.c.getPoint(b.t),tg=b.c.getTangent(b.t);
        b.o.position.set(p.x,-0.40+Math.sin(tm*1.7+i*2)*0.012,p.z);
        b.o.lookAt(p.x+tg.x,-0.40,p.z+tg.z);
        b.o.rotation.z=Math.sin(tm*1.3+i)*0.02; });
      MOORED.forEach((b,i)=>{ b.position.y=-0.4+Math.sin(tm*1.4+i*2.4)*0.01; b.rotation.z=Math.sin(tm*1.1+i)*0.015; });
    }

    /* ========== DŹWIĘK (WebAudio, start po pierwszym geście) ========== */
    const SND={on:true,ctx:null,g:{},started:false,inLobby:false};
    function sndInit(){
      if(SND.started||!SND.on)return; SND.started=true;
      try{
        const C=SND.ctx=new (window.AudioContext||window.webkitAudioContext)();
        const master=SND.master=C.createGain(); master.gain.value=0.9; master.connect(C.destination);
        /* nagrany ambient wieczornego nabrzeża (woda, ptaki, rozmowy), pętla 22 s, bez pasma <160 Hz = bez buczenia */
        const amb=SND.g.city=C.createGain(); amb.gain.value=0; amb.connect(master);
        fetch(M3D.ambience).then(r=>r.arrayBuffer()).then(b=>C.decodeAudioData(b)).then(buf=>{
          const src=C.createBufferSource(); src.buffer=buf; src.loop=true;
          src.loopStart=0.05; src.loopEnd=buf.duration-0.05;        // omija ciszę kodera MP3 na styku pętli
          src.connect(amb); src.start(0,0.05);
          amb.gain.setTargetAtTime(SND.inLobby?0.25:0.9,C.currentTime,1.2); }).catch(e=>console.warn('audio',e));
      }catch(e){ console.warn('audio',e); }
    }
    SND.chime=()=>{ if(!SND.ctx)return; const C=SND.ctx,t=C.currentTime;
      [[987,0.0],[1318,0.14]].forEach(([f,d])=>{ const o=C.createOscillator(),g=C.createGain();
        o.frequency.value=f; g.gain.setValueAtTime(0.0001,t+d); g.gain.exponentialRampToValueAtTime(0.12,t+d+0.02);
        g.gain.exponentialRampToValueAtTime(0.0001,t+d+1.4); o.connect(g); g.connect(SND.master); o.start(t+d); o.stop(t+d+1.6); }); };
    SND.lobby=(inside)=>{ SND.inLobby=inside; if(!SND.ctx)return; const t=SND.ctx.currentTime;
      const ramp=(g,v)=>{ g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(v,t,0.8); };
      ramp(SND.g.city,inside?0.25:0.9); };  // recepcja: miasto przyciszone jak zza szyby
    addEventListener('pointerdown',sndInit,{once:true});
    const sndBtn=document.getElementById('sndBtn');
    if(sndBtn)sndBtn.addEventListener('click',()=>{ SND.on=!SND.on; sndBtn.textContent=SND.on?'🔊':'🔇'; sndBtn.setAttribute('aria-pressed',String(SND.on));
      if(SND.on&&!SND.started)sndInit();
      if(SND.master)SND.master.gain.value=SND.on?0.9:0; });

    function offsetCurve(curve,d,n){ n=n||28; const pts=[];
      for(let i=0;i<=n;i++){ const t=i/n,p=curve.getPoint(t),tg=curve.getTangent(t);
        pts.push([p.x-tg.z*d, p.z+tg.x*d]); }
      return crv(pts); }
    const walkB=offsetCurve(roadB,1.7);

    /* ========== MIASTO v4 - model Blender (Codex 2026-09-05): dzielnica, plac, marina, kosciol, dalekie tlo ========== */
    /* Jeden GLB (meshopt) zamiast proceduralnej dzielnicy; emisyjne okna/lampy skalowane suwakiem nocy w applyDay. */
    const envEmitters=[];
    const cityGroup=new THREE.Group(); scene.add(cityGroup);
    (async()=>{
      try{
        const ldr=new GLTFLoader(); ldr.setMeshoptDecoder(MeshoptDecoder);
        const files=[M3D.cityEnv];
        if(!MOBILE)files.push(M3D.cityBackdrop);   // 398 bryl tla + 586 drzew + mosty - desktop only
        for(const g of await Promise.all(files.map(f=>ldr.loadAsync(f)))){
          const root=g.scene; root.updateMatrixWorld(true);
          /* drzewa i powtarzalne bryly -> InstancedMesh (jak w podgladzie Codexa) */
          const batches=new Map();
          root.traverse(o=>{ if(o.isMesh&&(o.name.startsWith('Tree_')||o.name.startsWith('Architecture_instance_'))){
            const k=o.geometry.uuid+'|'+o.material.uuid; if(!batches.has(k))batches.set(k,[]); batches.get(k).push(o); } });
          for(const b of batches.values()){ if(b.length<2)continue;
            const inst=new THREE.InstancedMesh(b[0].geometry,b[0].material,b.length);
            b.forEach((o,i)=>{ inst.setMatrixAt(i,o.matrixWorld); o.removeFromParent(); });
            inst.instanceMatrix.needsUpdate=true; inst.castShadow=inst.receiveShadow=!MOBILE; root.add(inst); }
          root.traverse(o=>{ if(!o.isMesh)return; o.castShadow=!MOBILE; o.receiveShadow=!MOBILE;
            (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{ if(!m)return;
              if(m.name.startsWith('Leaf')||m.name==='Grass blade')m.side=THREE.DoubleSide;
              if(m.emissive&&m.emissive.getHex()!==0&&!envEmitters.some(e=>e.m===m))envEmitters.push({m,base:m.emissiveIntensity}); }); });
          cityGroup.add(root);
        }
        applyDay(parseFloat(dayInput.value)); needsRender=true;
      }catch(e){ console.warn('miasto GLB',e); }
    })();

    /* ========== LUDZIE (sylwetki FLUX na promenadzie i placu) ========== */
    const PEOPLE=[];
    (function(){ const tl=new THREE.TextureLoader(); const mats=[];
      let done=0,total=4;
      const BASE=[-1,-1,1,-1];   // w którą stronę patrzy postać NA teksturze (-1=lewo)
      function spawn(){
        if(!mats.length)return;
        let sd=23; const rr=()=>((sd=sd*16807%2147483647)/2147483647);
        for(let i=0;i<9;i++){ const mt=mats[i%mats.length];
          const s=new THREE.Sprite(mt.m); const h=0.6+rr()*0.06;
          s.scale.set(h*mt.asp,h,1);
          PEOPLE.push({s,t:rr(),v:(0.0012+rr()*0.0016)*(rr()<0.5?1:-1),h,walk:true,base:mt.base,asp:mt.asp,path:walkPath});
          scene.add(s); }
        /* spacerujący chodnikiem przy alei (dzielnica) */
        for(let i=0;i<5;i++){ const mt=mats[(i+1)%mats.length];
          const s=new THREE.Sprite(mt.m); const h=0.6+rr()*0.05;
          s.scale.set(h*mt.asp,h,1);
          PEOPLE.push({s,t:rr(),v:(0.0012+rr()*0.0014)*(rr()<0.5?1:-1),h,walk:true,base:mt.base,asp:mt.asp,path:walkB});
          scene.add(s); }
        /* stojący: plac, fontanna, kawiarnia, molo, skwer */
        [[-4.6,5.4],[5.7,5.6],[-1.4,6.5],[-14,5.8],[-17.8,4.9]].forEach((p,i)=>{ const mt=mats[(i+2)%mats.length];
          const s=new THREE.Sprite(mt.m); const h=0.6;
          s.scale.set(h*mt.asp,h,1); s.position.set(p[0],h/2+0.03,p[1]);
          PEOPLE.push({s,walk:false,h}); scene.add(s); });
        needsRender=true;
      }
      for(let n=1;n<=total;n++){
        tl.load(M3D.people(n),t=>{ t.colorSpace=THREE.SRGBColorSpace;
          mats.push({m:new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false,alphaTest:0.06}),asp:t.image.width/t.image.height,base:BASE[(n-1)%4]});
          if(++done===total)spawn(); },undefined,()=>{ if(++done===total)spawn(); });
      }
    })();
    const walkPath=crv(BND.map(([x,z])=>[x,z-0.85]).slice(1,BND.length-1));
    function updatePeople(dt,tm){
      PEOPLE.forEach((p,i)=>{ if(!p.walk)return;
        p.t=(p.t+p.v*dt+1)%1;
        const pth=p.path||walkPath;
        const pos=pth.getPoint(p.t),tg=pth.getTangent(p.t);
        /* rytm kroku: lekki bob + minimalna oscylacja szerokości sylwetki */
        const stride=1+0.04*Math.sin(tm*5.2+i*1.7);
        p.s.position.set(pos.x,p.h/2+0.03+Math.abs(Math.sin(tm*2.6+i))*0.004,pos.z);
        const moveR=(p.v*tg.x)>=0;                     // czy idzie w prawo ekranu świata
        const face=(p.base===1)===moveR?1:-1;          // dopasuj kierunek twarzy z tekstury
        p.s.scale.x=Math.abs(p.h*p.asp)*face*stride; });
    }

    /* ========== WIEŻA (rekonstrukcja V4; oryginalny tower.glb zachowany) ========== */
    const TROT=-0.90;                    // główny narożnik nowej bryły w stronę kamery
    const towerMats=[];
    let towerScale=1,towerBaseY=0;
    let towerBox=null,goldSliceH=null,goldSliceS=null,floorsY0=0,floorH=0.5;
    const plNum=tlo.querySelector('.tmark');
    const gl=new GLTFLoader(); gl.setMeshoptDecoder(MeshoptDecoder);
    gl.load(M3D.tower,g=>{
      const root=g.scene;
      /* normalizacja: baza w y=0, wysokość TH, wyśrodkowanie XZ (bbox liczony PRZED obrotem) */
      let bb=new THREE.Box3().setFromObject(root);
      const s=TH/(bb.max.y-bb.min.y); root.scale.setScalar(s);
      bb=new THREE.Box3().setFromObject(root);
      towerScale=s; towerBaseY=0.015-bb.min.y;
      // Oś bryły jest w XZ=0; asymetryczne schody nie mogą przesuwać całego budynku.
      root.position.set(0,towerBaseY,0);
      root.name='STELE_Rebuild_V4';
      const seenMaterials=new Set();
      root.traverse(o=>{ if(o.isMesh){
        const materials=Array.isArray(o.material)?o.material:[o.material];
        const glass=materials.some(m=>m&&m.transparent);
        o.castShadow=!MOBILE&&!glass; o.receiveShadow=!MOBILE&&!glass;
        materials.forEach(m=>{ if(!m||seenMaterials.has(m))return; seenMaterials.add(m);
          m.envMapIntensity=0.85;
          if(m.emissive&&m.emissive.getHex()!==0){
            towerMats.push({material:m,base:m.emissiveIntensity??1});
          }
        });
      }});
      towerGroup.add(root);
      towerBox=new THREE.Box3().setFromObject(root);
      buildPickers();                                // pickery w towerGroup - kręcą się razem z wieżą
      towerGroup.rotation.y=TROT;
      tlo.classList.add('off');
      applyDay(parseFloat(dayInput.value));
      if(window.__flightLastP!=null)window.steleFlight(window.__flightLastP);
      needsRender=true;
    },ev=>{ if(ev.total&&plNum)plNum.textContent=Math.round(ev.loaded/ev.total*100)+'%'; },
      err=>{ console.warn('GLB',err); fail(); });
    // Współrzędne kondygnacji pochodzą z generatora V4, nie z procentów bbox skanu.

    /* niewidzialne pickery pięter + złote "plastry" podświetlenia */
    function buildPickers(){
      const w=17*1.296*towerScale*1.03, d=16*1.296*towerScale*1.03;
      floorsY0=towerBaseY+7.1*towerScale;
      floorH=3*towerScale;
      const pickGeo=new THREE.BoxGeometry(w,floorH,d);
      for(let f=3;f<=FLOORS;f++){
        const p=new THREE.Mesh(f===18?new THREE.BoxGeometry(8.3*1.296*towerScale*1.03,floorH,d):pickGeo,new THREE.MeshBasicMaterial({visible:false}));
        if(f===18)p.position.x=4.35*1.296*towerScale;
        p.position.y=floorsY0+(f-3+0.5)*floorH; p.userData.floor=f;
        towerGroup.add(p); floorPickers.push(p);
      }
      const mk=op=>{ const grp=new THREE.Group();
        const bx=new THREE.Mesh(new THREE.BoxGeometry(w*1.015,floorH*0.94,d*1.015),
          new THREE.MeshBasicMaterial({color:0xA6957A,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false}));
        const ed=new THREE.LineSegments(new THREE.EdgesGeometry(bx.geometry),
          new THREE.LineBasicMaterial({color:0xE9C86A,transparent:true,opacity:op*3.2}));
        grp.add(bx,ed); grp.visible=false; towerGroup.add(grp); return grp; };
      goldSliceH=mk(0.10); goldSliceS=mk(0.20);
    }
    function sliceTo(sl,f){ if(!sl)return; if(f==null){sl.visible=false;} else {
      sl.visible=true; sl.position.y=floorsY0+(f-3+0.5)*floorH;
      sl.position.x=f===18?4.35*1.296*towerScale:0;
      sl.scale.x=f===18?8.3/17:1;
    } needsRender=true; }

    /* ========== PORA DNIA (0 = zmierzch .. 1 = noc) ========== */
    const fogDay=new THREE.Color(0xdcd1c3),fogDusk=new THREE.Color(0xc8a18b),fogNight=new THREE.Color().setRGB(0.018,0.027,0.044);
    const watDusk=new THREE.Color(0x1c2b38),watNight=new THREE.Color(0x0d1420);
    function applyDay(v){
      renderer.toneMappingExposure=1.3-1.02*v;      // noc wyraźnie ciemniejsza
      scene.backgroundIntensity=0.42-0.30*v;        // v12: czyste niebo HDR bylo za jasne (user) - 0.42 w dzien (blekit + zloty horyzont), 0.12 noca
      scene.environmentIntensity=1.0-0.68*v;
      sun.intensity=2.4*(1-v)+0.12;
      sun.color.setHex(v>0.55?0x8fa3c8:0xffc07a);
      hemi.intensity=0.35-0.2*v; amb.intensity=0.12+0.05*v;
      envEmitters.forEach(({m,base})=>{ m.emissiveIntensity=base*(0.55+1.25*v); });   // okna/lampy miasta GLB dojasniaja noca
      plA.intensity=plB.intensity=1.4+2.2*v;
      towerMats.forEach(({material,base})=>{ material.emissiveIntensity=base*(0.7+1.1*v); });
      waterMat.color.copy(watDusk).lerp(watNight,v);
      waterMat.envMapIntensity=1.15-0.45*v;
      /* kolor mgly = horyzont nieba (schemat Codexa): zloty -> cieplejszy o zmierzchu -> granat noca */
      scene.fog.color.copy(fogDay).lerp(fogDusk,Math.sin(v*Math.PI)*0.55).lerp(fogNight,THREE.MathUtils.smoothstep(v,0.48,1));
      /* napisy nad sceną 3D: ciemne w dzień (v=0) -> jasne w nocy (v=1), płynnie wg suwka */
      if(fzEl){ const mix=(a,b)=>Math.round(a+(b-a)*v);
        fzEl.style.setProperty('--sky-ink',`rgb(${mix(24,242)},${mix(25,238)},${mix(30,230)})`);
        fzEl.style.setProperty('--sky-muted',`rgb(${mix(72,142)},${mix(75,138)},${mix(82,128)})`);
        fzEl.style.setProperty('--sky-glow',`0 1px 3px rgba(255,255,255,${(0.5*(1-v)).toFixed(3)}),0 3px 22px rgba(0,0,0,${(0.6*v).toFixed(3)})`);
      }
      needsRender=true;
    }
    dayInput.addEventListener('input',()=>applyDay(parseFloat(dayInput.value)));
    applyDay(parseFloat(dayInput.value));

    /* ========== INTERAKCJA: orbita kamery + raycast pięter ========== */
    let dragging=false,lastX=0,lastY=0,vel=0,idle=0;
    const AZ0=0.08;                         // domyślny kadr: znad rzeki (narożnik wieży dzięki TROT)
    const H0=4.2,LY0=4.6;                   // niska kamera znad wody, patrzy w środek masy wieży
    let camAz=AZ0,camH=H0,lookY=LY0;        // orbita wokół wieży (świat stoi, kamera krąży)
    const CAMR=27.5;
    function applyOrbit(){ camera.position.set(Math.sin(camAz)*CAMR,camH,Math.cos(camAz)*CAMR); camera.lookAt(0,lookY,0); needsRender=true; }
    canvas.addEventListener('pointerdown',e=>{ if(MODE!=='tower')return; dragging=true;lastX=e.clientX;lastY=e.clientY;vel=0;try{canvas.setPointerCapture(e.pointerId);}catch(_){}});
    canvas.addEventListener('pointermove',e=>{
      if(MODE==='lobby'){ lobbyMove(e); return; }
      if(dragging){ const d=(e.clientX-lastX)*0.006; lastX=e.clientX;
        camH=Math.max(1.2,Math.min(13,camH-(e.clientY-lastY)*0.02)); lastY=e.clientY;
        camAz+=d; vel=d; idle=0; applyOrbit(); }
      else pickAt(e);
    });
    const endDrag=()=>{dragging=false;};
    canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);
    const ray=new THREE.Raycaster(),ptr=new THREE.Vector2();
    /* interakcja z piętrami (hover/klik) DOPIERO gdy finder osiadł = panel widoczny; w trakcie przelotu wyłączona */
    const towerReady=()=>{ const fz=document.getElementById('flightzone'); return !fz||fz.classList.contains('settled'); };
    function pickAt(e){
      if(!towerReady()){ if(hovered){ hovered=null; sliceTo(goldSliceH,null); canvas.style.cursor='grab'; } return; }
      if(!floorPickers.length)return;
      const r=canvas.getBoundingClientRect();
      ptr.x=((e.clientX-r.left)/r.width)*2-1; ptr.y=-((e.clientY-r.top)/r.height)*2+1;
      ray.setFromCamera(ptr,camera);
      const hit=ray.intersectObjects(floorPickers,false)[0];
      const m=hit?hit.object:null;
      if(m!==hovered){ hovered=m;
        sliceTo(goldSliceH,(m&&m!==selected)?m.userData.floor:null);
        tbFloor.textContent=m?m.userData.floor:(selected?selected.userData.floor:'-');
        canvas.style.cursor=m?'pointer':'grab'; }
    }
    canvas.addEventListener('click',e=>{
      if(MODE!=='tower')return;
      if(!towerReady())return;               // przed osiadnięciem findera klik piętra nieaktywny
      if(Math.abs(vel)>0.004)return;
      pickAt(e);
      selectFloorMesh(hovered);
    });
    function selectFloorMesh(m){
      selected=(m===selected)?null:m;
      sliceTo(goldSliceS,selected?selected.userData.floor:null);
      if(selected){ sliceTo(goldSliceH,null); setFloorFilter(selected.userData.floor); tbFloor.textContent=selected.userData.floor; }
      else setFloorFilter(null);
    }
    window.selectFloor=f=>{ selectFloorMesh(f==null?null:floorPickers.find(x=>x.userData.floor===f)||null); };
    window.highlightFloor=(f,on)=>{ if(selected&&selected.userData.floor===f)return; sliceTo(goldSliceH,on?f:null); };

    /* ========== PRZELOT KAMERY (scroll) - miasto -> fasada -> korona -> kadr findera ========== */
    let flightP=1;
    const lerp=(a,b,t)=>a+(b-a)*t, sm=(t)=>t*t*(3-2*t);
    function seg(p,a,b){ return Math.max(0,Math.min(1,(p-a)/(b-a))); }
    window.steleFlight=(p)=>{
      if(MODE!=='tower')return;
      flightP=p;
      if(p>=0.999){ camAz=AZ0;camH=H0;lookY=LY0; applyOrbit(); applyDay(parseFloat(dayInput.value)); return; }
      let a,r,h,ly;
      if(p<0.3){ const t=sm(seg(p,0,0.3));        a=lerp(1.15,0.35,t); r=lerp(40,27,t);  h=lerp(17,3,t);    ly=lerp(3.4,0.6,t); }
      else if(p<0.62){ const t=sm(seg(p,0.3,0.62)); a=lerp(0.35,-0.55,t); r=lerp(27,13.5,t); h=lerp(3,-1.6,t); ly=lerp(0.6,2.6,t); }
      else if(p<0.86){ const t=sm(seg(p,0.62,0.86)); a=lerp(-0.55,-1.15,t); r=lerp(13.5,17.5,t); h=lerp(-1.6,6.6,t); ly=lerp(2.6,5.6,t); }
      else { const t=sm(seg(p,0.86,1));            a=lerp(-1.15,0.08,t); r=lerp(17.5,27.5,t); h=lerp(6.6,-1.2,t); ly=lerp(5.6,-0.8,t); }
      camera.position.set(Math.sin(a)*r,h+OFF,Math.cos(a)*r);
      camera.lookAt(0,ly+OFF,0);
      /* pora dnia sterowana WYŁĄCZNIE suwakiem (dostępny cały czas) - przelot nie nadpisuje */
      needsRender=true;
    };
    window.__flightActive=()=>flightP<0.999;

    /* ========== RECEPCJA (wnętrze 360) ========== */
    let MODE='tower';
    let lobbyScene=null,lobbyCam=null,lobbyLon=0,lobbyLat=0,lobbyDrag=false,lobLX=0,lobLY=0;
    /* max obrót w recepcji zależny od aspektu: pół panoramy (74.5°) - pół hFOV - margines na sway;
       stała klamra ±52° na szerokim ekranie wpuszczała kadr w czarne tło poza cylindrem */
    function lobMaxLon(){ const a=lobbyCam?lobbyCam.aspect:1.8;
      const h=Math.atan(Math.tan(THREE.MathUtils.degToRad(32))*a)*180/Math.PI;
      return Math.max(6,74.5-h-3.5); }
    const lobbyBtn=document.getElementById('lobbyBtn'),lobbyExit=document.getElementById('lobbyExit'),lobbyFade=document.getElementById('lobbyFade');
    function lobbyMove(e){
      if(!lobbyDrag){return;}
      const ML=lobMaxLon(); lobbyLon=Math.max(-ML,Math.min(ML,lobbyLon-(e.clientX-lobLX)*0.11));
      lobbyLat=Math.max(-16,Math.min(20,lobbyLat+(e.clientY-lobLY)*0.09));
      lobLX=e.clientX; lobLY=e.clientY; needsRender=true;
    }
    canvas.addEventListener('pointerdown',e=>{ if(MODE!=='lobby')return; lobbyDrag=true; lobLX=e.clientX; lobLY=e.clientY; });
    addEventListener('pointerup',()=>{lobbyDrag=false;});
    if(lobbyBtn){
      /* pokaż przycisk tylko jeśli panorama istnieje */
      fetch(M3D.lobbyPano,{method:'HEAD'}).then(r=>{ if(r.ok)lobbyBtn.hidden=false; }).catch(()=>{});
      lobbyBtn.addEventListener('click',()=>{
        if(MODE!=='tower')return;
        window.stelePulse&&window.stelePulse('lobby_enter');
        new THREE.TextureLoader().load(M3D.lobbyPano,tex=>{
          tex.colorSpace=THREE.SRGBColorSpace;
          tex.wrapS=THREE.RepeatWrapping; tex.repeat.x=-1; tex.offset.x=1;   // BackSide odbija w poziomie - odwracamy z powrotem
          lobbyScene=new THREE.Scene(); lobbyScene.background=new THREE.Color(0x070605);
          /* zakrzywiony ekran (cylinder ~150 stopni) - obraz FLUX bez zniekształceń sfery */
          const theta=2.6, R=10, H=R*theta/2;      // proporcja 2:1 obrazu
          const cyl=new THREE.Mesh(new THREE.CylinderGeometry(R,R,H,64,1,true,-theta/2+Math.PI,theta),
            new THREE.MeshBasicMaterial({map:tex,side:THREE.BackSide,toneMapped:false}));
          cyl.position.y=0.6; lobbyScene.add(cyl);
          /* miękkie domknięcie góra/dół */
          const capM=new THREE.MeshBasicMaterial({color:0x070605});
          const capT=new THREE.Mesh(new THREE.CylinderGeometry(R+0.2,R+0.2,6,64,1,true),capM);
          capT.position.y=0.6+H/2+3; lobbyScene.add(capT);
          const capB=capT.clone(); capB.position.y=0.6-H/2-3; lobbyScene.add(capB);
          lobbyCam=new THREE.PerspectiveCamera(64,camera.aspect,0.1,40);
          /* dolot do wejścia, potem fade */
          const t0=performance.now(),p0=camera.position.clone(),tgt=new THREE.Vector3(0,1.1,9.5);
          (function fly(){ const t=Math.min(1,(performance.now()-t0)/1400), k=sm(t);
            camera.position.lerpVectors(p0,tgt,k); camera.lookAt(0,1.6+k*0.4,0); needsRender=true;
            if(t<1)requestAnimationFrame(fly);
            else{ lobbyFade.classList.add('on');
              setTimeout(()=>{ MODE='lobby'; lobbyLon=0;lobbyLat=4;
                document.body.classList.add('inlobby');
                lobbyFade.classList.remove('on'); needsRender=true;
                sndInit(); SND.lobby(true); SND.chime();
                conciergeGreet();
              },620); }
          })();
        });
      });
      /* Ines welcome bubble: local illustrative copy, with no external video or voice service. */
      const abBub=document.getElementById('conBubble'),abTxt=document.getElementById('abText'),abMeet=document.getElementById('abMeet');
      function conciergeGreet(){
        if(!abBub)return;
        const msg=isEN()
          ?'Hello. I am Ines, the illustrated guide to the STELE concept. Would you like to explore the model or read about the design intent?'
          :'Dzień dobry. Jestem Ines — ilustracyjną przewodniczką po koncepcji STELE. Chcesz poznać model czy założenia projektu?';
        abBub.hidden=false; abTxt.textContent='';
        let i=0; (function type(){ if(MODE!=='lobby')return; abTxt.textContent=msg.slice(0,++i);
          if(i<msg.length)setTimeout(type,18); })();
        window.stelePulse&&window.stelePulse('lobby_enter');
      }
      abMeet&&abMeet.addEventListener('click',()=>{
        window.stelePulse&&window.stelePulse('lobby_meet');
        window.steleMeet&&window.steleMeet(isEN()?'I would like to explore the STELE concept. ':'Chcę poznać koncepcję STELE. ');
      });
      lobbyExit&&lobbyExit.addEventListener('click',()=>{
        lobbyFade.classList.add('on');
        setTimeout(()=>{ MODE='tower'; document.body.classList.remove('inlobby');
          const ab=document.getElementById('conBubble'); if(ab)ab.hidden=true;
          SND.lobby(false);
          camAz=AZ0;camH=H0;lookY=LY0; applyOrbit();
          lobbyFade.classList.remove('on'); needsRender=true; },620);
      });
      addEventListener('keydown',e=>{ if(e.key==='Escape'&&MODE==='lobby')lobbyExit.click(); });
    }

    /* ========== PĘTLA RENDERU ========== */
    let last=performance.now();
    function resize(){ const r=canvas.getBoundingClientRect(); if(r.width<2)return; renderer.setSize(r.width,r.height,false); canvas.style.width='100%'; canvas.style.height='100%'; camera.aspect=r.width/r.height; camera.updateProjectionMatrix(); if(lobbyCam){lobbyCam.aspect=camera.aspect;lobbyCam.updateProjectionMatrix();} needsRender=true; }
    new ResizeObserver(()=>resize()).observe(canvas); resize();   // follows the sticky stage, not just the window
    applyOrbit();
    renderer.setAnimationLoop(t=>{
      if(!ioVisible||pageHidden)return;
      const dt=Math.min((t-last)/1000,0.05); last=t;
      if(MODE==='lobby'&&lobbyScene){
        const ML=lobMaxLon(), effLon=Math.max(-ML-2.5,Math.min(ML+2.5,lobbyLon));
        const phi=THREE.MathUtils.degToRad(90-lobbyLat), th=THREE.MathUtils.degToRad(effLon);
        lobbyCam.position.set(0,0.6,0);
        lobbyCam.lookAt(Math.sin(phi)*Math.sin(th),0.6+Math.cos(phi),-Math.sin(phi)*Math.cos(th));
        renderer.render(lobbyScene,lobbyCam); return;
      }
      if(!RM&&!dragging&&flightP>=0.999){ if(Math.abs(vel)>0.0004){ camAz+=vel; vel*=0.94; applyOrbit(); }
        else { idle+=dt; if(idle>2.4){ camAz+=dt*0.05; applyOrbit(); } } }
      if(!RM){ wnorm.offset.x+=dt*0.016; wnorm.offset.y+=dt*0.009;
        updateVehicles(dt); updateBoats(dt,t/1000); updatePeople(dt,t/1000); needsRender=true; }
      if(needsRender){ needsRender=false; renderer.render(scene,camera); }
    });
  }catch(e){ console.warn('3D init failed',e); fail(); }
}

new IntersectionObserver(es=>{ ioVisible=es[0].isIntersecting;
  if(ioVisible&&!started){ started=true; init3D(); }
},{rootMargin:'260px 0px',threshold:0}).observe(canvas);
document.addEventListener('visibilitychange',()=>{ pageHidden=document.hidden; });

}
