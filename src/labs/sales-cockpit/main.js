import './style.css';
import '@fontsource-variable/newsreader';
import '@fontsource-variable/instrument-sans';

/* STELE Pulse concept UI study: reads the local interaction log and mixes it with clearly synthetic demo records. No CRM/backend or real lead scoring exists. */

(function(){
const $=s=>document.querySelector(s);
const FLOORS=16; // piętra 3-18
/* ===== LOCAL interaction events from this browser only ===== */
let mine=[]; try{ mine=JSON.parse(localStorage.getItem('stele_pulse')||'[]'); }catch(e){}
const myUnits=[...new Set(mine.filter(e=>e.type==='unit').map(e=>e.id))];
const myFloors=[...new Set(mine.filter(e=>e.type==='tower_click'&&e.floor&&e.floor!=='-').map(e=>+e.floor).filter(Number.isFinite))];
const myNight=mine.some(e=>e.type==='daynight'&&e.v>0.6);
const myGame=mine.some(e=>e.type==='game_open');
const myChat=mine.some(e=>e.type==='chat_open');
const myFaq=mine.filter(e=>e.type==='faq').length;
const myVisits=mine.filter(e=>e.type==='visit').length;
let myScore=18+myVisits*6+myFloors.length*8+myUnits.length*14+(myNight?9:0)+(myGame?12:0)+(myChat?15:0)+myFaq*3;
myScore=Math.min(97,myScore);

/* ===== symulowani odwiedzający ===== */
let seed=42; const rnd=()=>((seed=seed*16807%2147483647)/2147483647);

const SIM=[
 {id:'SAMPLE-01',score:91,floors:[17,18],units:['A18.02','A17.01'],traits:['sample UI interactions','concept layout · evening','demo flight completed','crown-view study'],wait:'demo data'},
 {id:'SAMPLE-02',score:74,floors:[12,13,14],units:['A12.03','A14.01'],traits:['illustrative 3-room layout','plan filter interaction','night-light demo'],wait:'demo data'},
 {id:'SAMPLE-03',score:58,floors:[5,6],units:['A5.02'],traits:['synthetic session','filter test','concept FAQ opened'],wait:'demo data'},
 {id:'SAMPLE-04',score:33,floors:[3],units:[],traits:['short simulated session','gallery demo only'],wait:'demo data'},
];
/* Synthetic interaction index per concept floor, plus this browser's local events. */
const heat=[]; for(let f=0;f<FLOORS;f++){ let base=0.22+rnd()*0.4; if(f>=13)base+=0.25; if(f<3)base-=0.08; heat.push(base); }
SIM.forEach(s=>s.floors.forEach(f=>{ heat[f-3]=Math.min(1,heat[f-3]+0.14); }));
myFloors.forEach(f=>{ if(f>=3&&f<=18)heat[f-3]=Math.min(1,heat[f-3]+0.2); });
const DIMMED_FLOORS=[0,1,4,7]; // decorative contrast only; no sold / available status exists

/* ===== KPI ===== */
$('#kVis').textContent=String(147+Math.floor(rnd()*30));
$('#kAct').textContent=String(3+Math.floor(rnd()*3));
$('#kHot').textContent=String(myScore>=70?3:2);

/* ===== heatmapa wieży (canvas) ===== */
(function(){
  const c=$('#heat'),g=c.getContext('2d');
  const W=c.width,H=c.height,rowH=(H-90)/FLOORS,bw=W-210;
  g.clearRect(0,0,W,H);
  g.font='600 20px Manrope'; g.textBaseline='middle';
  for(let f=FLOORS-1;f>=0;f--){
    const y=34+(FLOORS-1-f)*rowH, v=heat[f];
    const dimmed=DIMMED_FLOORS.includes(f);
    const col=dimmed?'#2a2d36':(v>0.72?'#E4574B':v>0.45?'#A6957A':'#5B7C99');
    const w=dimmed?bw*0.35:bw*(0.2+v*0.8);
    g.fillStyle='rgba(242,238,230,.07)'; g.fillRect(96,y,bw,rowH-9);
    g.fillStyle=col; g.globalAlpha=dimmed?0.5:0.92; g.fillRect(96,y,w,rowH-9); g.globalAlpha=1;
    g.fillStyle='#8E8A80'; g.textAlign='right'; g.fillText(String(f+3),82,y+(rowH-9)/2);
    if(myFloors.includes(f+3)){ g.fillStyle='#D8CCB4'; g.textAlign='left'; g.font='800 15px Manrope'; g.fillText('● TY',102+w,y+(rowH-9)/2); g.font='600 20px Manrope'; }
  }
  g.fillStyle='#8E8A80'; g.textAlign='left'; g.font='600 16px Manrope';
  g.fillText('PIĘTRO',20,14); g.fillText('PRZYKŁADOWY INDEKS INTERAKCJI',96,14);
  g.fillStyle='#A6957A'; g.font='600 15px Manrope';
  g.fillText('Mapa schematyczna — bez danych o popycie / sprzedaży',96,H-22);
})();

/* ===== strumień intencji ===== */
const feed=$('#feed');
const fmtT=d=>{const x=new Date(d);return String(x.getHours()).padStart(2,'0')+':'+String(x.getMinutes()).padStart(2,'0');};
function ev(who,what,you,ts){
  const d=document.createElement('div'); d.className='ev';
  d.innerHTML='<span class="t">'+fmtT(ts||Date.now())+'</span><span class="who'+(you?' you':'')+'">'+who+'</span><span class="what">'+what+'</span>';
  feed.prepend(d); while(feed.children.length>40)feed.lastChild.remove();
}
/* Twoja historia (ostatnie 12 zdarzeń) */
const label={visit:'otwiera koncepcję STELE',tower_click:'wybiera poziom <b>#F#</b> modelu 3D',unit:'otwiera układ <b>#ID#</b>',filter:'filtruje układy: <b>#F#</b>',daynight:'zmienia oświetlenie (<b>#V#</b>)',game_open:'uruchamia lot demo 🚁',chat_open:'otwiera przewodniczkę demo 💬',faq:'czyta FAQ koncepcji (#Q#)',gallery:'ogląda planszę: <b>#G#</b>'};
mine.slice(-12).forEach(e=>{ let w=label[e.type]||e.type;
  w=w.replace('#F#',e.floor||e.f||'').replace('#ID#',e.id||'').replace('#V#',e.v>0.6?'noc':'dzień').replace('#Q#',e.q||'').replace('#G#',e.g||'');
  ev('TY',w,true,e.t); });
if(!mine.length) ev('TY','brak lokalnych zdarzeń — wróć do koncepcji, wejdź w interakcję i odśwież demo',true);
/* symulowany strumień */
const SIMEV=[
 ['SAMPLE-01','otwiera układ koncepcyjny <b>A18.02</b>'],
 ['SAMPLE-02','ogląda piętro <b>12</b> o zmierzchu'],
 ['SAMPLE-03','testuje przykładowy filtr układu'],
 ['SAMPLE-01','otwiera sekcję lobby demo'],
 ['SAMPLE-05','uruchamia dashboard symulowany'],
 ['SAMPLE-02','otwiera rzut koncepcyjny <b>A12.03</b>'],
 ['SAMPLE-06','kończy lot dronem demo · kod <b>STELE-FLIGHT-DEMO</b>'],
 ['SAMPLE-03','czyta FAQ koncepcji'],
 ['SAMPLE-07','tryb nocny · piętra <b>15-17</b>'],
 ['SAMPLE-01','ogląda układ koncepcyjny <b>18</b>'],
];
let si=0; setInterval(()=>{ const [w,t]=SIMEV[si++%SIMEV.length]; ev(w,t,false); },3400);

/* ===== leady ===== */
const leadsEl=$('#leads');
function leadCard(nm,score,doss,you,wait){
  const cls=score>=70?'hot':score>=45?'warm':'cold';
  const d=document.createElement('div'); d.className='lead';
  d.innerHTML='<div class="lh"><span class="nm'+(you?' you':'')+'">'+nm+'</span><span class="badge '+cls+'">'+'DEMO · '+score+'</span></div>'
   +'<div class="scorebar"><i style="width:'+score+'%"></i></div>'
   +'<div class="doss">'+doss+'</div>'
   +'<div class="act"><button type="button" class="abtn gold" data-crm="'+nm+'">Testuj akcję demo</button><button type="button" class="abtn" data-preview="'+nm+'">Podgląd demo</button>'+(you?'':'<button type="button" class="abtn" data-preview="'+nm+'">Szczegóły demo</button>')+'</div>';
  leadsEl.appendChild(d);
}
const myDoss=[]
  ;if(myFloors.length)myDoss.push('ogląda piętra <b>'+myFloors.slice(0,4).join(', ')+'</b>');
  if(myUnits.length)myDoss.push('lokale: <b>'+myUnits.slice(0,3).join(', ')+'</b>');
  if(myNight)myDoss.push('tryb nocny - <b>szuka klimatu</b>');
  if(myGame)myDoss.push('ukończył/a wejście w grę 🚁');
  if(myChat)myDoss.push('rozmawiał/a z Ines');
  if(myFaq)myDoss.push('FAQ x'+myFaq);
  if(!myDoss.length)myDoss.push('świeża sesja - profil buduje się z każdą interakcją na stronie');
leadCard('TY (ta przeglądarka)',myScore,myDoss.join(' · ')+' · wizyt: <b>'+Math.max(1,myVisits)+'</b>',true,'');
SIM.forEach(s=>leadCard(s.id,s.score,s.traits.join(' · ')+(s.wait?' · <b>'+s.wait+'</b>':''),false,s.wait));

/* ===== Illustrative dashboard recommendations — not AI or commercial advice ===== */
const recos=$('#recos');
const R=[
 ['Przykładowy sygnał: układ <b>A18.02</b>.','Symulowane odsłony tego layoutu — dane demonstracyjne, nie lead ani intencja zakupu.'],
 [(myScore>=45?'Twoja lokalna sesja ma więcej interakcji.':'Twoja lokalna sesja jest na początku.'),(myUnits.length?('Otwarty układ: '+myUnits[0]+'. To podsumowanie wyłącznie tej przeglądarki.'):'Interaguj z koncepcyjną wieżą lub lotem demo, aby zobaczyć aktywność lokalną.')],
 ['Przykładowa reguła: układ <b>A12.03</b>.','Pokazano sposób prezentacji reguły — nie jest to prognoza cenowa ani rekomendacja sprzedaży.'],
 ['Przykładowa klasyfikacja sesji.','Tylko demonstracja interfejsu. Nie przypisuje się prawdziwego klienta ani nie wysyła powiadomienia.'],
];
R.forEach(([t,w])=>{ const d=document.createElement('div'); d.className='reco'; d.innerHTML='<span class="ic">A</span><div>'+t+'<span class="why">'+w+'</span></div>'; recos.appendChild(d); });

/* ===== Generated chart placeholders — not price / market signals ===== */
const sigs=$('#sigs');
function spark(vals,col){ const c=document.createElement('canvas'); c.className='spark'; c.width=148; c.height=44; const g=c.getContext('2d');
  g.strokeStyle=col; g.lineWidth=3; g.beginPath();
  vals.forEach((v,i)=>{ const x=6+i*(136/(vals.length-1)), y=38-v*32; i?g.lineTo(x,y):g.moveTo(x,y); }); g.stroke(); return c; }
const S=[
 ['Piętra 16-18 · typologia koncepcyjna','schemat syntetyczny · nie jest prognozą popytu ani zaleceniem ceny',[0.3,0.35,0.42,0.5,0.66,0.8,0.95],'#E4574B','u','demo'],
 ['Piętra 12-15 · typologia koncepcyjna','wartości demonstracyjne · brak danych o rezerwacjach',[0.55,0.5,0.58,0.62,0.6,0.64,0.66],'#A6957A','u','demo'],
 ['Piętra 3-5 · układ kompaktowy','wartości demonstracyjne · brak cennika ani oferty promocyjnej',[0.5,0.46,0.44,0.4,0.42,0.38,0.36],'#5B7C99','d','demo'],
];
S.forEach(([t,w,vals,col,dir,tag])=>{ const d=document.createElement('div'); d.className='sig';
  d.innerHTML='<div><b style="font-weight:600">'+t+'</b><div style="color:var(--muted);font-size:11px;margin-top:2px">'+w+'</div></div>';
  d.appendChild(spark(vals,col));
  const s=document.createElement('span'); s.className=dir==='u'?'u':'dn'; s.textContent=tag; d.appendChild(s);
  sigs.appendChild(d); });

/* ===== local-only demo actions; no CRM connector exists ===== */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-crm],[data-preview]'); if(!b)return;
  const id=b.dataset.crm||b.dataset.preview;
  const t=$('#toast');
  t.textContent=b.dataset.crm
    ? 'Demo action for '+id+' — nothing was sent to a CRM.'
    : 'Sample profile '+id+' — no real person or data record exists.';
  t.classList.add('on'); setTimeout(()=>t.classList.remove('on'),2600);
});
})();
