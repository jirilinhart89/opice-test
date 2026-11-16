'use strict';
const $ = (id) => document.getElementById(id);
const STORAGE = 'pt37-notes-v1';
let coords = null;
const enc = [
 {title:'O.P.I.C.E.',body:'Lidové označení osobního přenosného terminálu. Rozšíření zkratky se v jednotlivých oblastech liší. V tomto přístroji znamená „Osobní Počítač s Integrovanou Cestovní Encyklopedií“.\n\nPůvod a výrobní řady přístrojů jsou předmětem místních pověstí.'},
 {title:'REPUBLIKA',body:'Souhrnné označení někdejšího státního zřízení a společného území Čech, Moravy, Slezska a Slovenska. Historické záznamy o jeho jednotlivých obdobích jsou neúplné.\n\nNěkteré komunity užívají název „Republika“ i dnes.'},
 {title:'CIVILNÍ OBRANA',body:'Předkoncová organizace spojená s přípravou obyvatelstva na nebezpečí, ochranou civilistů a budováním krytů. Nálezy jejích plánů a označení jsou časté.\n\nUPOZORNĚNÍ: Archivní plány nemusí odpovídat stavu terénu.'},
 {title:'LEGIONÁŘI',body:'Pověsti vyprávějí o ozbrojených poutnících, kteří pro Republiku putovali přes vzdálené země. Dobové prameny i lidové písně jim připisují různé činy. Přesné časové zařazení je sporné.'},
 {title:'SLOVENSKO',body:'Země východně od Moravy, spojovaná s Republikou. Dochované mapy se neshodují v jejím politickém postavení. Příběhy o Tisovi a Mečiarovi se v lidovém podání někdy prolínají.'},
 {title:'KONEC',body:'Obecné označení pro zánik starého světa. Mezi tradovaná vysvětlení patří války, havárie, rozpad zásobování a dlouhotrvající krize. Datum ani příčina nejsou všeobecně přijímány.'}
];
function formatNow(){
 const now = new Date();
 $('clock').textContent = now.toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
 $('footerClock').textContent = now.toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit',hour12:false});
 $('date').textContent = now.toLocaleDateString('cs-CZ',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).toLocaleUpperCase('cs-CZ');
}
function showPage(name){document.querySelectorAll('.page').forEach(n=>n.classList.toggle('active',n.id===name));}
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.go)));
$('homeBtn').addEventListener('click',()=>showPage('home'));
function readNotes(){try {const data=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(data)?data:[];}catch{return [];}}
function storeNotes(notes){try{localStorage.setItem(STORAGE,JSON.stringify(notes));return true;}catch{return false;}}
function renderNotes(){
 const list=$('noteList');list.replaceChildren();const notes=readNotes();$('notesCount').textContent=String(notes.length);
 if(!notes.length){const empty=document.createElement('p');empty.textContent='ARCHIV JE PRÁZDNÝ.';list.append(empty);return;}
 notes.forEach((n,i)=>{const article=document.createElement('article');article.className='note';const stamp=document.createElement('time');stamp.textContent=new Date(n.at).toLocaleString('cs-CZ');const p=document.createElement('p');p.textContent=n.text;const del=document.createElement('button');del.textContent='ODSTRANIT';del.setAttribute('aria-label','Odstranit záznam '+(i+1));del.addEventListener('click',()=>{if(confirm('Opravdu odstranit tento záznam?')){const updated=readNotes();updated.splice(i,1);if(storeNotes(updated)){renderNotes();}else alert('Nepodařilo se změnit archiv.');}});article.append(stamp,p,del);list.append(article);});
}
$('saveNote').addEventListener('click',()=>{const val=$('noteText').value.trim();if(!val){$('saveStatus').textContent='ZÁZNAM JE PRÁZDNÝ';return;}const notes=readNotes();notes.unshift({text:val,at:new Date().toISOString()});if(!storeNotes(notes)){$('saveStatus').textContent='UKLÁDÁNÍ SELHALO';return;}$('noteText').value='';$('saveStatus').textContent='ULOŽENO';renderNotes();});
$('exportBtn').addEventListener('click',()=>{const notes=readNotes();const body='P.T. 37 — POLNÍ DENÍK\n\n'+notes.map(n=>new Date(n.at).toLocaleString('cs-CZ')+'\n'+n.text).join('\n\n-----\n\n');const blob=new Blob([body],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='pt37-denik.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);});
function renderEncyclopedia(){const list=$('entryList');list.replaceChildren();enc.forEach((e,i)=>{const b=document.createElement('button');b.textContent=(i+1).toString().padStart(2,'0')+' / '+e.title;b.addEventListener('click',()=>{list.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');$('entryTitle').textContent=e.title;$('entryBody').textContent=e.body;});list.append(b);if(i===0)b.click();});}
$('locateBtn').addEventListener('click',()=>{
 $('locateStatus').textContent='ZJIŠŤOVÁNÍ POLOHY...';
 if(!('geolocation' in navigator)){$('locateStatus').textContent='TENTO PROHLÍŽEČ NEPODPORUJE URČENÍ POLOHY.';return;}
 navigator.geolocation.getCurrentPosition(p=>{const {latitude,longitude,accuracy}=p.coords;coords={latitude,longitude};$('coordinates').textContent=`SEVER: ${latitude.toFixed(5)}°\nVÝCHOD: ${longitude.toFixed(5)}°\nPŘESNOST: ±${Math.round(accuracy)} m`;$('coordinates').style.whiteSpace='pre-line';$('locationSummary').textContent='URČENA';$('locateStatus').textContent='POLOHA BYLA URČENA.';const link=$('mapLink');link.href=`https://www.openstreetmap.org/?mlat=${encodeURIComponent(latitude)}&mlon=${encodeURIComponent(longitude)}#map=15/${encodeURIComponent(latitude)}/${encodeURIComponent(longitude)}`;link.classList.remove('disabled');link.removeAttribute('aria-disabled');},err=>{const msgs={1:'PŘÍSTUP K POLOZE BYL ZAMÍTNUT.',2:'POLOHA NENÍ DOSTUPNÁ.',3:'VYPRŠEL ČASOVÝ LIMIT.'};$('locateStatus').textContent=msgs[err.code]||'URČENÍ POLOHY SELHALO.';},{enableHighAccuracy:true,timeout:15000,maximumAge:60000});
});
$('mapLink').addEventListener('click',(ev)=>{if(!coords)ev.preventDefault()});
$('fullBtn').addEventListener('click',async()=>{try{if(!document.fullscreenElement && document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock('landscape');$('fullStatus').textContent='REŽIM SPUŠTĚN / POKUS O UZAMČENÍ ORIENTACE.';}catch{$('fullStatus').textContent='PROHLÍŽEČ NEPOVOLIL CELOU OBRAZOVKU NEBO UZAMČENÍ ORIENTACE. PO INSTALACI NA PLOCHU TO MŮŽE FUNGOVAT LÉPE.';}});
function status(){ $('connectivity').textContent=navigator.onLine?'MÍSTNÍ REŽIM':'BEZ SPOJENÍ'; }
window.addEventListener('online',status);window.addEventListener('offline',status);
formatNow();setInterval(formatNow,1000);status();renderNotes();renderEncyclopedia();
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
