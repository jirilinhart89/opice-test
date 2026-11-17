'use strict';
const $ = (id) => document.getElementById(id);
const STORAGE = 'pt37-notes-v1';
const APP_VERSION = '1.3';
let coords = null;

/*
  TECHNICKÉ ÚDAJE TERMINÁLU
  -------------------------
  Tento objekt můžeš libovolně upravovat přímo v kódu.
  Změny se promítnou na stránce 06 / TECHNICKÉ ÚDAJE.
*/
const TECH_SPECS = {
  deviceName: 'Osobní terminál vz. 37',
  fields: [
    ['Výrobce', 'Praga'],
    ['Závod', 'Vysočany'],
    ['Vývojové centrum', 'Užitné Přístroje a Pomůcky, Digitalizace a Komponenty Výkonové'],
    ['Typové označení', 'OT vz. 37'],
    ['Rok výroby', '2037'],
    ['Druh přístroje', 'Osobní počítač s integrovanou cestovní encyklopedií'],
    ['Určení', 'Civilní a služební použití'],
    ['Displej', 'Jantarový zobrazovací režim s vysokým kontrastem'],
    ['Ovládání', 'Dotyková plocha / kapacitní stylus'],
    ['Napájení', 'Vestavěný akumulátor, nabíjení 5 VDC'],
    ['Spojení', 'Místní bezdrátové sítě, navigační přijímač, lokální archiv'],
    ['Paměť', 'Lokální záznamová paměť uživatele'],
    ['Doporučené rozměry tělesa', 'max. 200 × 90 × 28 mm'],
    ['Provozní podmínky', '-10 °C až +40 °C, chránit před přímým deštěm'],
    ['Uživatelské prostředí', 'v1.5 "Vltava"']
  ],
  description:
    'Osobní terminál vz. 37 je osobní počítač s integrovanou cestovní encyklopedií, ' +
    'určený pro nošení na předloktí. ' +
    'Uživatel má k dispozici časové údaje, polohu, polní deník, místní encyklopedický archiv a systémové funkce. ' +
    'Rozhraní je přizpůsobeno pohodlí uživatele a ztíženým světelným podmínkám.',
  features: [
    'Ústřední informační obrazovka s časem a stavem přístroje',
    'Polní deník s lokálním ukládáním záznamů',
    'Modul mapa a poloha',
    'Cestovní encyklopedie pro offline provoz',
    'Systémové nastavení a servisní list',
    'Kompatibilita s kapacitním stylusem'
  ],
  serviceNote:
    'Praga akciová společnost, UPPDKV, 2037, patentově chráněno.'
};

/*
  ENCYKLOPEDIE
  -----------
  Hesla nejsou součástí JavaScriptu. Jsou v souboru "encyklopedie.txt".
  Každé heslo začíná řádkem "## NÁZEV" a následuje prostý text.
  Díky tomu mohou přibývat hesla bez úprav programového kódu.
*/
let encyclopediaLoadSequence = 0;

function parseEncyclopedia(source) {
  const entries = [];
  let currentTitle = null;
  let bodyLines = [];
  const saveEntry = () => {
    if (currentTitle !== null) {
      entries.push({ title: currentTitle, body: bodyLines.join('\n').trim() });
    }
  };
  for (const line of source.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const heading = line.match(/^##[ \t]+(.+?)\s*$/);
    if (heading) {
      saveEntry();
      currentTitle = heading[1].trim();
      bodyLines = [];
    } else if (currentTitle !== null) {
      bodyLines.push(line);
    }
  }
  saveEntry();
  return entries;
}


/*
  STAV AKUMULÁTORU
  ----------------
  Výdrž v hodinách pochází z Battery Status API (dischargingTime).
  Pokud ji Android / prohlížeč neposkytuje, nezobrazujeme odhad naslepo.
*/
let batteryManager = null;
function updateBattery() {
  const percent = $('batteryPercent');
  const hours = $('batteryHours');
  const fill = $('batteryFill');
  const wrapper = $('batteryIndicator');
  if (!batteryManager) {
    percent.textContent = '— %';
    hours.textContent = '— h';
    fill.style.width = '0%';
    wrapper.title = 'Stav akumulátoru není dostupný';
    return;
  }
  const level = batteryManager.level;
  const validLevel = Number.isFinite(level) && level >= 0 && level <= 1;
  const pct = validLevel ? Math.round(level * 100) : null;
  percent.textContent = pct === null ? '— %' : `${pct} %`;
  fill.style.width = pct === null ? '0%' : `${pct}%`;
  fill.classList.toggle('battery-low', pct !== null && pct <= 15);

  const remaining = batteryManager.dischargingTime;
  if (batteryManager.charging) {
    hours.textContent = 'NABÍJENÍ';
    wrapper.title = 'Přístroj je připojen k nabíjení';
  } else if (Number.isFinite(remaining) && remaining > 0) {
    const roundedHours = Math.round(remaining / 3600);
    hours.textContent = roundedHours < 1 ? '< 1 h' : `${roundedHours} h`;
    wrapper.title = 'Orientační doba do vybití podle údajů přístroje';
  } else {
    hours.textContent = '— h';
    wrapper.title = 'Odhad zbývající výdrže není dostupný';
  }
}
async function initBattery() {
  if (typeof navigator.getBattery !== 'function') {
    updateBattery();
    return;
  }
  try {
    batteryManager = await navigator.getBattery();
    ['levelchange', 'chargingchange', 'dischargingtimechange']
      .forEach(event => batteryManager.addEventListener(event, updateBattery));
  } catch (_) {
    batteryManager = null;
  }
  updateBattery();
}

function formatNow(){
 const now = new Date();
 $('clock').textContent = now.toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
 $('footerClock').textContent = now.toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit',hour12:false});
 $('date').textContent = now.toLocaleDateString('cs-CZ',{weekday:'long',day:'numeric',month:'long'}).toLocaleUpperCase('cs-CZ');
}

function showPage(name){
 if(name==='field-nav') navRefreshAstronomy();
  if(name==='encyclopedia') loadEncyclopedia();
 document.querySelectorAll('.page').forEach(n=>n.classList.toggle('active',n.id===name));
}

document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.go)));
$('homeLogo').addEventListener('click',()=>showPage('home'));

function readNotes(){try {const data=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(data)?data:[];}catch{return [];}}
function storeNotes(notes){try{localStorage.setItem(STORAGE,JSON.stringify(notes));return true;}catch{return false;}}
function renderNotes(){
 const list=$('noteList');list.replaceChildren();const notes=readNotes();$('notesCount').textContent=String(notes.length);
 if(!notes.length){const empty=document.createElement('p');empty.textContent='ARCHIV JE PRÁZDNÝ.';list.append(empty);return;}
 notes.forEach((n,i)=>{const article=document.createElement('article');article.className='note';const stamp=document.createElement('time');stamp.textContent=new Date(n.at).toLocaleString('cs-CZ');const p=document.createElement('p');p.textContent=n.text;const del=document.createElement('button');del.textContent='ODSTRANIT';del.setAttribute('aria-label','Odstranit záznam '+(i+1));del.addEventListener('click',()=>{if(confirm('Opravdu odstranit tento záznam?')){const updated=readNotes();updated.splice(i,1);if(storeNotes(updated)){renderNotes();}else alert('Nepodařilo se změnit archiv.');}});article.append(stamp,p,del);list.append(article);});
}
$('saveNote').addEventListener('click',()=>{const val=$('noteText').value.trim();if(!val){$('saveStatus').textContent='ZÁZNAM JE PRÁZDNÝ';return;}const notes=readNotes();notes.unshift({text:val,at:new Date().toISOString()});if(!storeNotes(notes)){$('saveStatus').textContent='UKLÁDÁNÍ SELHALO';return;}$('noteText').value='';$('saveStatus').textContent='ULOŽENO';renderNotes();});
$('exportBtn').addEventListener('click',()=>{const notes=readNotes();const body='OSOBNÍ TERMINÁL VZ. 37 — POLNÍ DENÍK\n\n'+notes.map(n=>new Date(n.at).toLocaleString('cs-CZ')+'\n'+n.text).join('\n\n-----\n\n');const blob=new Blob([body],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='vz37-denik.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);});

function renderEncyclopedia(entries){
 const list=$('entryList');
 list.replaceChildren();
 entries.forEach((e,i)=>{
   const b=document.createElement('button');
   b.textContent=(i+1).toString().padStart(2,'0')+' / '+e.title;
   b.addEventListener('click',()=>{
     list.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));
     b.classList.add('selected');
     $('entryTitle').textContent=e.title;
     $('entryBody').textContent=e.body || 'ZÁZNAM ZATÍM NEMÁ TEXT.';
   });
   list.append(b);
   if(i===0)b.click();
 });
}

async function loadEncyclopedia(){
 const requestId=++encyclopediaLoadSequence;
 const list=$('entryList');
 const item=document.createElement('p');
 item.textContent='NAČÍTÁM ENCYKLOPEDII...';
 list.replaceChildren(item);
 $('entryTitle').textContent='CESTOVNÍ ENCYKLOPEDIE';
 $('entryBody').textContent='Načítání místního archivu.';
 try {
   // Na síti vždy načti nové heslo. Offline ho poskytne Service Worker z cache.
   const response=await fetch('./encyklopedie.txt', {cache:'no-store'});
   if(!response.ok) throw new Error('HTTP '+response.status);
   const entries=parseEncyclopedia(await response.text());
   if(requestId!==encyclopediaLoadSequence) return;
   if(!entries.length) {
     list.replaceChildren();
     $('entryTitle').textContent='ARCHIV JE PRÁZDNÝ';
     $('entryBody').textContent='Přidejte první heslo do souboru encyklopedie.txt: řádek začínající ## a pod ním text.';
     return;
   }
   renderEncyclopedia(entries);
 } catch (error) {
   if(requestId!==encyclopediaLoadSequence) return;
   item.textContent='ARCHIV NENÍ DOSTUPNÝ';
   list.replaceChildren(item);
   $('entryTitle').textContent='CHYBA NAČÍTÁNÍ';
   $('entryBody').textContent='Soubor encyklopedie.txt se nepodařilo načíst. Zkontrolujte, zda je v kořeni webu. Při prvním spuštění je potřeba internet; následně funguje i offline.';
   console.warn('Encyklopedie není dostupná:',error);
 }
}

function renderSpecs(){
  $('specDeviceName').textContent = TECH_SPECS.deviceName;
  $('specDescription').textContent = TECH_SPECS.description;
  $('specServiceNote').textContent = TECH_SPECS.serviceNote;

  const list = $('specList');
  list.replaceChildren();
  TECH_SPECS.fields.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'spec-row';
    const left = document.createElement('span');
    left.className = 'spec-label';
    left.textContent = label;
    const right = document.createElement('strong');
    right.className = 'spec-value';
    right.textContent = value;
    row.append(left, right);
    list.append(row);
  });

  const features = $('specFeatures');
  features.replaceChildren();
  TECH_SPECS.features.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    features.append(li);
  });
}

$('locateBtn').addEventListener('click',()=>{
 $('locateStatus').textContent='ZJIŠŤOVÁNÍ POLOHY...';
 if(!('geolocation' in navigator)){$('locateStatus').textContent='TENTO PROHLÍŽEČ NEPODPORUJE URČENÍ POLOHY.';return;}
 navigator.geolocation.getCurrentPosition(p=>{const {latitude,longitude,accuracy}=p.coords;coords={latitude,longitude};navCoords={lat:latitude,lon:longitude};$('navPosition').textContent=latitude.toFixed(3)+'°, '+longitude.toFixed(3)+'°';$('navAltitude').textContent=Number.isFinite(p.coords.altitude)?Math.round(p.coords.altitude)+' m':'NEDOSTUPNÁ';$('navLocateStatus').textContent='GPS POLOHA ZJIŠTĚNA';navRefreshAstronomy();$('coordinates').textContent=`SEVER: ${latitude.toFixed(5)}°\nVÝCHOD: ${longitude.toFixed(5)}°\nPŘESNOST: ±${Math.round(accuracy)} m`;$('coordinates').style.whiteSpace='pre-line';$('locationSummary').textContent='URČENA';$('locateStatus').textContent='POLOHA BYLA URČENA.';const link=$('mapLink');link.href=`https://www.openstreetmap.org/?mlat=${encodeURIComponent(latitude)}&mlon=${encodeURIComponent(longitude)}#map=15/${encodeURIComponent(latitude)}/${encodeURIComponent(longitude)}`;link.classList.remove('disabled');link.removeAttribute('aria-disabled');},err=>{const msgs={1:'PŘÍSTUP K POLOZE BYL ZAMÍTNUT.',2:'POLOHA NENÍ DOSTUPNÁ.',3:'VYPRŠEL ČASOVÝ LIMIT.'};$('locateStatus').textContent=msgs[err.code]||'URČENÍ POLOHY SELHALO.';},{enableHighAccuracy:true,timeout:15000,maximumAge:60000});
});
$('mapLink').addEventListener('click',(ev)=>{if(!coords)ev.preventDefault()});
$('fullBtn').addEventListener('click',async()=>{try{if(!document.fullscreenElement && document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock('landscape');$('fullStatus').textContent='REŽIM SPUŠTĚN / POKUS O UZAMČENÍ ORIENTACE.';}catch{$('fullStatus').textContent='PROHLÍŽEČ NEPOVOLIL CELOU OBRAZOVKU NEBO UZAMČENÍ ORIENTACE. PO INSTALACI NA PLOCHU TO MŮŽE FUNGOVAT LÉPE.';}});
function status(){ $('connectivity').textContent=navigator.onLine?'MÍSTNÍ REŽIM':'BEZ SPOJENÍ'; }
window.addEventListener('online',status);window.addEventListener('offline',status);
formatNow();setInterval(formatNow,1000);status();renderNotes();loadEncyclopedia();renderSpecs();
initBattery();
setInterval(updateBattery, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateBattery(); });
if('serviceWorker' in navigator){
  let reloadingForUpdate=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
    if(!reloadingForUpdate){reloadingForUpdate=true;window.location.reload();}
  });
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}


/* =============================================================
   POLNÍ NAVIGÁTOR — VERZE 1.2
   Výpočty jsou lokální, bez síťového spojení.
   - východ a západ Slunce: aproximace dle astronomického algoritmu NOAA
   - osvětlení Měsíce: aproximace ze souřadnic Slunce/Měsíce
   - kompas: pouze absolutní orientační data senzorů
   ============================================================= */
let navCoords = null;
let navCompassActive = false;
let navGotHeading = false;
let navHeadingUpdated = 0;

function navNormalize(a) { return ((a % 360) + 360) % 360; }
function navDmsCardinal(deg){
 const directions = ['SEVER','SV','VÝCHOD','JV','JIH','JZ','ZÁPAD','SZ'];
 return directions[Math.round(navNormalize(deg) / 45) % 8];
}
function navOnOrientation(e){
 let raw = null;
 if (Number.isFinite(e.webkitCompassHeading)) raw = e.webkitCompassHeading;
 else if (e.absolute === true && Number.isFinite(e.alpha)) raw = 360 - e.alpha;
 if (raw === null) return; // relativní orientace nesmí být vydávána za kompas
 const angle = screen.orientation && Number.isFinite(screen.orientation.angle) ? screen.orientation.angle : 0;
 const heading = navNormalize(raw + angle);
 navGotHeading = true;
 navHeadingUpdated = Date.now();
 $('navAzimuth').textContent = Math.round(heading).toString().padStart(3, '0') + '°';
 $('navCardinal').textContent = navDmsCardinal(heading);
 $('navNeedle').style.transform = `rotate(${-heading}deg)`;
 $('navCompassStatus').textContent = 'ABSOLUTNÍ ORIENTACE';
}
async function navStartCompass(){
 $('navCompassStatus').textContent = 'ČEKÁ SE NA ČIDLO...';
 if (typeof DeviceOrientationEvent === 'undefined') {
  $('navCompassStatus').textContent = 'SENZOR NENÍ DOSTUPNÝ';
  return;
 }
 try {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
   const answer = await DeviceOrientationEvent.requestPermission(true);
   if (answer !== 'granted') { $('navCompassStatus').textContent = 'PŘÍSTUP K ČIDLU ZAMÍTNUT'; return; }
  }
  if (!navCompassActive){
   window.addEventListener('deviceorientationabsolute', navOnOrientation, true);
   window.addEventListener('deviceorientation', navOnOrientation, true);
   navCompassActive = true;
  }
  window.setTimeout(()=>{
   if (!navGotHeading) $('navCompassStatus').textContent = 'ABSOLUTNÍ SMĚR NENÍ DOSTUPNÝ';
  }, 2600);
 } catch(_){ $('navCompassStatus').textContent = 'NEPODAŘILO SE ZAPNOUT ČIDLO'; }
}
$('navCompassBtn').addEventListener('click', navStartCompass);

function navGetPosition(){
 $('navLocateStatus').textContent = 'ZJIŠŤOVÁNÍ GPS...';
 if (!navigator.geolocation){ $('navLocateStatus').textContent = 'GPS NENÍ DOSTUPNÁ';return; }
 navigator.geolocation.getCurrentPosition(pos=>{
  navCoords = {lat:pos.coords.latitude,lon:pos.coords.longitude};
  coords = {latitude:pos.coords.latitude,longitude:pos.coords.longitude};
  $('locationSummary').textContent = 'URČENA';
  $('navPosition').textContent = navCoords.lat.toFixed(3)+'°, '+navCoords.lon.toFixed(3)+'°';
  const alt = pos.coords.altitude;
  const altAccuracy = pos.coords.altitudeAccuracy;
  $('navAltitude').textContent = alt === null || !Number.isFinite(alt) ? 'NEDOSTUPNÁ' : Math.round(alt) + ' m' + (Number.isFinite(altAccuracy) ? ' (±'+Math.round(altAccuracy)+' m)' : '');
  $('navLocateStatus').textContent = 'GPS POLOHA ZJIŠTĚNA';
  navRefreshAstronomy();
 },err=>{
  $('navLocateStatus').textContent = ({1:'PŘÍSTUP K GPS ZAMÍTNUT',2:'GPS NEDOSTUPNÁ',3:'PŘEKROČEN ČASOVÝ LIMIT'})[err.code] || 'GPS SELHALA';
 },{enableHighAccuracy:true,maximumAge:60000,timeout:15000});
}
$('navLocateBtn').addEventListener('click',navGetPosition);

function navSolarEvent(date,latitude,longitude,isSunrise){
 // NOAA / USNO jednoduchý astronomický výpočet (orientační čas za standardní refrakce)
 const y=date.getFullYear(),m=date.getMonth(),d=date.getDate();
 const N=Math.round((Date.UTC(y,m,d)-Date.UTC(y,0,0))/86400000);
 const lngHour=longitude/15;
 const t=N+((isSunrise?6:18)-lngHour)/24;
 const M=0.9856*t-3.289;
 const rad=Math.PI/180;
 const L=navNormalize(M+1.916*Math.sin(M*rad)+0.020*Math.sin(2*M*rad)+282.634);
 let RA=navNormalize(Math.atan(0.91764*Math.tan(L*rad))/rad);
 RA += Math.floor(L/90)*90 - Math.floor(RA/90)*90;
 RA/=15;
 const sinDec=0.39782*Math.sin(L*rad);
 const cosDec=Math.sqrt(1-sinDec*sinDec);
 const cosH=(Math.cos(90.833*rad)-sinDec*Math.sin(latitude*rad))/(cosDec*Math.cos(latitude*rad));
 if(cosH>1||cosH< -1) return null;
 const H=(isSunrise?360-Math.acos(cosH)/rad:Math.acos(cosH)/rad)/15;
 const T=H+RA-0.06571*t-6.622;
 const UT=T-lngHour;
 return new Date(Date.UTC(y,m,d)+UT*3600000);
}
function navFormatHour(date){return date instanceof Date&&!Number.isNaN(+date)?date.toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit'}):'—:—';}

function navMoonIllumination(date){
 // Zjednodušená astronomická geometrie pro Slunce a Měsíc, dny od J2000.
 const rad=Math.PI/180;
 const d=date.valueOf()/86400000-0.5+2440588-2451545;
 const e=rad*23.4397;
 const M=rad*(357.5291+0.98560028*d);
 const C=rad*(1.9148*Math.sin(M)+0.02*Math.sin(2*M)+0.0003*Math.sin(3*M));
 const L=M+C+rad*102.9372+Math.PI;
 const sra=Math.atan2(Math.sin(L)*Math.cos(e),Math.cos(L));
 const sdec=Math.asin(Math.sin(e)*Math.sin(L));
 const moonL=rad*(218.316+13.176396*d);
 const moonM=rad*(134.963+13.064993*d);
 const moonF=rad*(93.272+13.229350*d);
 const ml=moonL+rad*6.289*Math.sin(moonM);
 const mb=rad*5.128*Math.sin(moonF);
 const mdist=385001-20905*Math.cos(moonM);
 const mra=Math.atan2(Math.sin(ml)*Math.cos(e)-Math.tan(mb)*Math.sin(e),Math.cos(ml));
 const mdec=Math.asin(Math.sin(mb)*Math.cos(e)+Math.cos(mb)*Math.sin(e)*Math.sin(ml));
 const phi=Math.acos(Math.max(-1,Math.min(1,Math.sin(sdec)*Math.sin(mdec)+Math.cos(sdec)*Math.cos(mdec)*Math.cos(sra-mra))));
 const inc=Math.atan2(149598000*Math.sin(phi),mdist-149598000*Math.cos(phi));
 const angle=Math.atan2(Math.cos(sdec)*Math.sin(sra-mra),Math.sin(sdec)*Math.cos(mdec)-Math.cos(sdec)*Math.sin(mdec)*Math.cos(sra-mra));
 return {fraction:(1+Math.cos(inc))/2,phase:navNormalize((0.5+0.5*inc*(angle<0?-1:1)/Math.PI)*360)/360};
}
function navDrawMoon(phase){
 const c=$('navMoonDisc'),ctx=c.getContext('2d');
 if(!ctx) return;
 const w=c.width,h=c.height, cx=w/2,cy=h/2,r=w*.42;
 ctx.clearRect(0,0,w,h);
 ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle='#130b05';ctx.fill();
 const img=ctx.getImageData(0,0,w,h);
 const cosVal=Math.cos(phase*2*Math.PI);
 for(let py=0;py<h;py++) for(let px=0;px<w;px++){
  const x=px+.5-cx, y=py+.5-cy;
  const distance=x*x+y*y;
  if(distance>r*r)continue;
  const bound=Math.sqrt(r*r-y*y);
  const lit=phase<0.5 ? x>cosVal*bound : x< -cosVal*bound;
  if(lit){const idx=(py*w+px)*4;img.data[idx]=255;img.data[idx+1]=196;img.data[idx+2]=112;img.data[idx+3]=255;}
 }
 ctx.putImageData(img,0,0);
 ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='#bd8244';ctx.lineWidth=2;ctx.stroke();
}
function navRefreshAstronomy(){
 const now=new Date();
 const moon=navMoonIllumination(now);
 const phases=['NOV','DORŮSTAJÍCÍ SRPEK','PRVNÍ ČTVRŤ','DORŮSTAJÍCÍ MĚSÍC','ÚPLNĚK','COUVAJÍCÍ MĚSÍC','POSLEDNÍ ČTVRŤ','UBÝVAJÍCÍ SRPEK'];
 $('navMoonPhase').textContent=phases[Math.round(moon.phase*8)%8];
 $('navMoonLit').textContent='OSVĚTLENÍ '+Math.round(100*moon.fraction)+' %';
 navDrawMoon(moon.phase);
 if(!navCoords) return;
 const rise=navSolarEvent(now,navCoords.lat,navCoords.lon,true);
 const set=navSolarEvent(now,navCoords.lat,navCoords.lon,false);
 $('navSunrise').textContent=navFormatHour(rise);
 $('navSunset').textContent=navFormatHour(set);
 if(!rise||!set){$('navCountdownLabel').textContent='SLUNEČNÍ REŽIM';$('navCountdown').textContent='POLÁRNÍ OBLAST';return;}
 if(now<set){
  const mins=Math.max(0,Math.ceil((set-now)/60000));
  $('navCountdownLabel').textContent='DO ZÁPADU';
  $('navCountdown').textContent=Math.floor(mins/60)+' h '+(mins%60)+' min';
 } else {
  // Po západu ukážeme odpočet do zítřejšího východu.
  const tomorrow=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,12,0,0);
  const nextRise=navSolarEvent(tomorrow,navCoords.lat,navCoords.lon,true);
  $('navCountdownLabel').textContent='DO VÝCHODU';
  if(nextRise){const mins=Math.max(0,Math.ceil((nextRise-now)/60000));$('navCountdown').textContent=Math.floor(mins/60)+' h '+(mins%60)+' min';}
  else $('navCountdown').textContent='— h — min';
 }
 $('navAstroStatus').textContent='ČASY JSOU VYPOČTENÉ Z GPS A MÍSTNÍHO ČASU PŘÍSTROJE; TERÉNNÍ PŘEKÁŽKY SE NEZOHLEDŇUJÍ.';
}
navRefreshAstronomy();
setInterval(()=>{if($('field-nav').classList.contains('active'))navRefreshAstronomy();},60000);
