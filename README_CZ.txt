OSOBNÍ TERMINÁL VZ. 37 – EDICE 1.4
===================================================

NOVINKA: Hesla encyklopedie jsou nyní v jediném textovém souboru:
    encyklopedie.txt

JAK PŘIDAT HESLO:
1. Otevřete encyklopedie.txt v editoru prostého textu (UTF-8).
2. Za poslední heslo vložte prázdný řádek a nový nadpis s dvěma mřížkami:

## NÁZEV NOVÉHO HESLA
Zde napíšete první odstavec.

Tady může pokračovat další odstavec. Uvozovky, čárky a dvojtečky jsou v pořádku.

3. Soubor uložte a nahrajte do kořenové složky vašeho GitHub Pages repozitáře.
4. Po nasazení otevřete v aplikaci Encyklopedii; při otevření znovu načte hesla.
   Pro aktualizaci hesel už není třeba měnit app.js ani sw.js.

DŮLEŽITÉ:
- Nadpis každého hesla musí být na samostatném řádku a začínat „## “.
- Text přísluší heslu až do dalšího řádku začínajícího „## “.
- Název a text se zobrazují jako obyčejný text. HTML není podporováno.
- Při online provozu se načte aktuální archiv. Při offline provozu
  se použije poslední dříve načtená verze uložená v PWA cache.
- Na GitHub Pages se změny mohou projevit s krátkým zpožděním.

INSTALACE VERZE 1.4:
Nahrajte VŠECHNY soubory z tohoto ZIPu do stejného veřejného GitHub
repozitáře jako stávající aplikaci. Dodržte podsložku icons/.
Při prvním nasazení je potřeba nahrát také encyklopedie.txt i sw.js.
Stávající zápisky deníku se uchovávají pod stejným klíčem
pt37-notes-v1 v localStorage při zachování stejné adresy aplikace.
Neodstraňujte data webu prohlížeče, jinak můžete o deník přijít.

Soubor app.js obsahuje vaše upravené technické údaje Praga a další funkce.

NOVINKA VERZE 1.4:
Klepnutí na znak českého lva v záhlaví vrací na hlavní obrazovku
a současně požádá prohlížeč o režim celé obrazovky. Přepnutí
se může lišit podle verze Androidu a Chrome. Pokud ho prohlížeč
nepovolí, návrat do nabídky zůstává funkční.
