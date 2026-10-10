import { $, $$ } from '../core/env.js';
import { SITE } from '../config/site.js';

/**
 * Ines, the STELE concierge chat. Ported from the supplied source.
 * Backend contract: POST CHAT_ENDPOINT {messages:[{role,content}], lang} -> {reply} | {error:'not_configured', reply?}.
 * The endpoint (a serverless function in the original deployment) is NOT part of this repo; without it the widget
 * shows an explicit local demo message until an owner-configured endpoint is provided.
 */
const CHAT_ENDPOINT = SITE.chatEndpoint;

export function initConciergeChat() {
  /* ---------- AGENTKA AI ---------- */
  function run(){
    const fab=$('#fab'),chat=$('#chat'),bodyEl=$('#cbody'),input=$('#cinput'),sendBtn=$('#csend'),closeBtn=$('#cclose'),chips=$('#cchips'),limitEl=$('#climit');
    if(!fab||!chat)return;
    const MAX_USER=10;
    let history=[],userCount=0,busy=false,greeted=false;
    const T={
      pl:{
        greet:"Dzień dobry. Jestem Ines — ilustracyjną przewodniczką po koncepcji STELE. To fikcyjne studium architektury; dostępność, ceny i rezydencje są przykładowe.",
        chips:["Dlaczego kamień i szkło?","Poznaj kolekcje","Jak działa model 3D?","Jakie są założenia?"],
        limit:n=>n+'/'+MAX_USER+' wiadomości',
        ended:"Koniec demonstracyjnej sesji. Żadna wiadomość nie została wysłana ani zapisana.",
        err:"Usługa czatu nie jest skonfigurowana. Ta prezentacja działa w trybie demonstracyjnym.",
        offline:"Czat Ines jest demonstracją interfejsu. Nie ma aktywnego zespołu sprzedaży, a wiadomości nie są przekazywane."
      },
      en:{
        greet:"Hello. I'm Ines, the illustrated guide to the STELE concept. This is a fictional architectural study; homes, availability and prices are illustrative.",
        chips:["Why stone and glass?","Explore the collections","How does the 3D model work?","What is the design intent?"],
        limit:n=>n+'/'+MAX_USER+' messages',
        ended:"The demo session has ended. No message was sent or stored.",
        err:"The chat service is not configured. This presentation is running in demo mode.",
        offline:"Ines chat is an interface demonstration. There is no active sales team, and messages are not forwarded."
      }
    };
    const L=()=>document.documentElement.lang==='en'?T.en:T.pl;
    const scrollDown=()=>{bodyEl.scrollTop=bodyEl.scrollHeight;};
    function add(role,text){const d=document.createElement('div');d.className='msg '+(role==='user'?'me':'bot');d.textContent=text;bodyEl.appendChild(d);scrollDown();return d;}
    function typing(on){let t=bodyEl.querySelector('.typing');
      if(on){if(!t){t=document.createElement('div');t.className='msg bot typing';t.innerHTML='<i></i><i></i><i></i>';bodyEl.appendChild(t);scrollDown();}}
      else if(t)t.remove();}
    function renderChips(){chips.innerHTML='';if(userCount>0||chat.classList.contains('done'))return;
      L().chips.forEach(c=>{const b=document.createElement('button');b.className='cchip';b.textContent=c;b.onclick=()=>{input.value=c;send();};chips.appendChild(b);});}
    const setLimit=()=>{limitEl.textContent=L().limit(userCount);};
    function endChat(){chat.classList.add('done');add('bot',L().ended);setLimit();}
    async function callAgent(){
      if(!CHAT_ENDPOINT)return L().offline;
      try{
        const r=await fetch(CHAT_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:history,lang:document.documentElement.lang})});
        if(!r.ok)throw new Error('http '+r.status);
        const d=await r.json();
        if(d&&d.reply)return d.reply;
        if(d&&d.error==='not_configured')return d.reply||L().offline;
        throw new Error('empty');
      }catch(e){return L().offline;}
    }
    async function send(){
      const text=(input.value||'').trim();
      if(!text||busy||chat.classList.contains('done'))return;
      input.value='';input.style.height='auto';
      add('user',text);history.push({role:'user',content:text});userCount++;setLimit();renderChips();
      busy=true;sendBtn.disabled=true;typing(true);
      const reply=await callAgent();
      typing(false);add('bot',reply);history.push({role:'assistant',content:reply});
      busy=false;sendBtn.disabled=false;
      if(userCount>=MAX_USER)endChat();else input.focus();
    }
    function open(seedText){
      chat.classList.add('open');fab.classList.add('hide');
      if(!greeted){greeted=true;setLimit();typing(true);
        setTimeout(()=>{typing(false);add('bot',L().greet);history.push({role:'assistant',content:L().greet});renderChips();},600);}
      if(seedText){input.value=seedText;input.style.height='auto';input.style.height=Math.min(input.scrollHeight,90)+'px';}
      setTimeout(()=>input.focus(),420);
    }
    const close=()=>{chat.classList.remove('open');fab.classList.remove('hide');};
    fab.onclick=()=>open();closeBtn.onclick=close;
    const cChat=$('#cChat');if(cChat)cChat.onclick=()=>open();
    $('#askBtn').onclick=()=>open(document.documentElement.lang==='en'?'I\'d like to ask about an apartment: ':'Chcę zapytać o apartament: ');
    $$('.ask-type').forEach(b=>b.addEventListener('click',()=>open((document.documentElement.lang==='en'?'I\'m interested in type ':'Interesuje mnie typ ')+b.dataset.type+'. ')));
    window.steleAsk=u=>open((document.documentElement.lang==='en'?'I am exploring an illustrative layout ':'Oglądam przykładowy układ ')+u.id+' ('+u.floor+' / '+u.rooms+' rooms / '+u.m2+' m²). No sale or availability data is real. ');
    window.steleMeet=msg=>open(msg||((document.documentElement.lang==='en')?'I\'d like to explore the STELE concept. ':'Chcę poznać koncepcję STELE. '));
    sendBtn.onclick=send;
    input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
    input.addEventListener('input',()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,90)+'px';});
    addEventListener('keydown',e=>{if(e.key==='Escape'&&chat.classList.contains('open'))close();});
  }
  run();
}
