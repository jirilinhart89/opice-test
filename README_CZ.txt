OSOBNÍ TERMINÁL VZ. 37 — VERZE 0.8
==================================

CO JE NOVÉ
- Hlavní obrazovka: horní polovina hodiny a stav terminálu,
  spodní polovina řada čtvercových dotykových tlačítek.
- Nový záznam a Archiv záznamů jsou dvě oddělené obrazovky.
- Zachované Hradčany jako podklad, navigace, encyklopedie,
  technické údaje Praga a offline provoz.

AKTUALIZACE NA GITHUB PAGES
1. Nahraj VŠECHNY soubory z archivu do KOŘENE stejného
   repozitáře (index.html, app.js, style.css, sw.js,
   manifest.webmanifest, pozadi-hradcany.webp, icons/).
2. Po dokončení publikace znovu otevři PWA. Aktualizace
   service workeru může vyžadovat úplné zavření aplikace.
3. Poznáš ji podle VERZE 0.8 ve spodní liště.

DENÍK
Aplikace stále používá původní klíč úložiště pt37-notes-v1.
Při aktualizaci na stejné adrese se staré zápisy zachovají.
Před většími zásahy je vhodné v Nastavení exportovat deník.
Nemaž data webu; můžeš tak smazat i deník.

JAK PŘIDAT DALŠÍ MODUL
V index.html najdi <div class="home-modules"> a přidej tlačítko
podobné existujícím. Nová funkce vyžaduje také vlastní
<section id="...">. Když se moduly nevejdou, spodní řadu lze
posouvat do strany.

TECHNICKÉ ÚDAJE
Lze je snadno editovat v app.js v objektu TECH_SPECS.

DŮLEŽITÉ
Bezpečnostní upozornění z jiných aplikací závisí na Androidu;
i nadále je potřeba jejich chování na skutečném telefonu ověřit.

NOVINKY VE VERZI 0.8:
- V záhlaví je heraldický štít s českým lvem namísto písmene T.
- Klepnutím na štít se stále vracíš na hlavní nabídku.
- Kontrolka MÍSTNÍ REŽIM pomalu pulzuje jantarovou barvou.
- Nápis PŘERUŠENO rovněž jemně pulzuje (jde o stylizaci, nikoli detekci spojení).
- Nový soubor icons/cesky-lev.png musí být nahraný společně s ostatními soubory.
- Při zapnutém omezení pohybu systému jsou animace vypnuté.
