OSOBNÍ TERMINÁL VZ. 37 — EDICE 1.4
===================================

NOVINKY
- Kliknutí na znak Pragy v záhlaví vrátí hlavní obrazovku a zároveň se
  pokusí obnovit celoobrazovkový režim (pokud jej prohlížeč dovolí).
- Volba fullscreen byla odstraněna ze stránky NASTAVENÍ.
- Nastavení nyní obsahuje TECHNICKÉ ÚDAJE, pětimístné ID uživatele,
  export čitelného TXT a export/import zálohy JSON.
- ID je na hlavní obrazovce a ukládá se ke každému NOVÉMU záznamu.
  Pokud ID ještě nenastavíte, záznam se uloží s označením NEUVEDENO.
  Změna čísla zpětně nepřepisuje autorství starších záznamů.
- Starší záznamy zůstávají zachovány, pouze nemají přiřazené ID.

ZÁLOHY DENÍKU
- EXPORT ZÁLOHY (.JSON) vytvoří soubor vz37-denik-zaloha.json.
  Zahrnuje texty, data a původní ID autorů. TENTO formát je určen pro import.
- IMPORT ZÁLOHY (.JSON) soubor zkontroluje, nabídne potvrzení a pouze
  PŘIDÁ dosud neexistující záznamy. Duplicity se ignorují. Stávající
  záznamy nepřepisuje, uživatelské ID přístroje nemění.
- EXPORT KE ČTENÍ (.TXT) je určen pouze k čtení a tisku, nelze jej importovat.
- Zachována místní paměť a klíč pt37-notes-v1. Uložení a import probíhá
  lokálně v prohlížeči; soubor JSON nikam automaticky neodesíláme.

ENCYKLOPEDIE
- Dále se upravuje pouze soubor encyklopedie.txt.
- Každé heslo začíná na samostatném řádku "## NÁZEV HESLA" (bez mezer ve slově HESLA).
- V online režimu se soubor načítá aktuálně, offline z cache.

AKTUALIZACE
- Nahrajte celý obsah ZIPu do kořenové složky GitHub Pages repozitáře,
  včetně podsložky icons/ a souboru sw.js. URL aplikace musí zůstat stejná.
- Nemažte data webu; tam jsou uloženy stávající zápisky a ID.
- Ověřte v patičce číslo VERZE 1.4. Service Worker se někdy aktualizuje
  až při dalším otevření aplikace.

POZNÁMKA K ANDROIDU
- Fullscreen API vyžaduje skutečný klik uživatele. Android nebo Chrome
  jej mohou odmítnout; pak přesto proběhne návrat do hlavní nabídky.
- Jiná systémová oznámení (například zdravotní) aplikace neovládá.
