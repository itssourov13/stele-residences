/**
 * Apartment finder: unit data, filters and the list panel next to the 3D tower.
 * Deliberately independent from WebGL so the list keeps working if 3D is unavailable.
 * Ported from the supplied source (inline_script_6.js, first half).
 *
 * Bridge (see docs/ARCHITECTURE.md):
 *   window.selectFloor(f)        -> defined by webgl/tower-scene.js (no-op until the scene is ready)
 *   window.highlightFloor(f,on)  -> same
 *   window.steleAsk(unit)        -> defined by components/chat.js
 */
import { UNITS } from '../content/units.js';

export function initApartmentFinder(){



/* unit data now lives in content/units.js */

/* ---- panel finder ---- */
const ulist=document.getElementById('ulist'), uCount=document.getElementById('uCount'), uTotal=document.getElementById('uTotal');
const fFloor=document.getElementById('fFloor');
let fRooms='all', fFloorNo=null;
const PLN=n=>n.toLocaleString('pl-PL')+' zł';
const isEN=()=>document.documentElement.lang==='en';
function stTxt(){ return isEN()?'concept sample':'przykład koncepcyjny'; }
function renderUnits(){
  const match=UNITS.filter(u=>(fRooms==='all'||u.rooms===+fRooms||(fRooms==='4'&&u.rooms>=4))&&(fFloorNo==null||u.floor===fFloorNo));
  uCount.textContent=match.length;
  uTotal.textContent=UNITS.length;
  ulist.innerHTML='';
  match.sort((a,b)=>a.floor-b.floor||a.id.localeCompare(b.id)).forEach(u=>{
    const d=document.createElement('div'); d.className='ucard concept'; d.dataset.floor=u.floor;
    d.innerHTML='<span class="uid">'+u.id+'</span>'
      +'<span class="um">'+(isEN()?'floor':'piętro')+' '+u.floor+' · '+u.rooms+' '+(isEN()?(u.rooms===1?'room':'rooms'):(u.rooms===1?'pokój':u.rooms<5?'pokoje':'pokoi'))+' · '+u.m2+' m²'+(u.label?' · '+u.label:'')+'</span>'
      +'<span class="up">'+(isEN()?'DEMO DATA':'DANE DEMO')+'</span>'
      +'<span class="ust concept">'+stTxt()+'</span>';
    d.addEventListener('click',()=>{ window.steleAsk&&window.steleAsk(u); });
    d.addEventListener('mouseenter',()=>window.highlightFloor(u.floor,true));
    d.addEventListener('mouseleave',()=>window.highlightFloor(u.floor,false));
    ulist.appendChild(d);
  });
}
document.getElementById('tfilters').addEventListener('click',e=>{
  const b=e.target.closest('.fbtn'); if(!b)return;
  if(b.id==='fFloor'){ fFloorNo=null; b.hidden=true; window.selectFloor(null); renderUnits(); return; }
  document.querySelectorAll('#tfilters .fbtn[data-rooms]').forEach(x=>x.classList.toggle('act',x===b));
  fRooms=b.dataset.rooms; renderUnits();
});
function setFloorFilter(f){
  fFloorNo=f;
  if(f==null){ fFloor.hidden=true; }
  else { fFloor.hidden=false; fFloor.textContent=(isEN()?'floor ':'piętro ')+f+'  ×'; fFloor.classList.add('act'); }
  renderUnits();
}
window.steleRenderUnits=renderUnits;
renderUnits();


  window.selectFloor=window.selectFloor||(()=>{});
  window.highlightFloor=window.highlightFloor||(()=>{});
  window.setFloorFilter=setFloorFilter;
}
