OSOBNÍ TERMINÁL VZ. 37 — VÝVOJOVÁ VERZE 0.5

OPRAVA ZOBRAZENÍ POZADÍ HRADČAN

Původní pozadí verze 0.4 bylo velmi nízko a zakrývaly ho neprůhledné panely.
V této verzi je panorama výše, panely na úvodní stránce jsou průhlednější.
Navíc je zmenšená kopie obrázku zabudovaná přímo v souboru style.css,
takže se zobrazí i v případě, že pozadi-hradcany.webp nenahrajete.

INSTALACE NA GITHUB PAGES
1. Nahrajte do stejného veřejného repozitáře VŠECHNY soubory z balíčku
   včetně index.html, app.js, style.css, sw.js, manifest.webmanifest
   a složky icons. Volitelný soubor pozadi-hradcany.webp slouží jako
   samostatně vyměnitelné pozadí.
2. Vyčkejte na dokončení nasazení GitHub Pages.
3. Zavřete nainstalovanou aplikaci a spusťte ji znovu.
4. Pokud vidíte stále starý vzhled, otevřete adresu aplikace v Chromu
   a obnovte ji s připojením k internetu. Neodstraňujte úložiště webu,
   pokud chcete zachovat záznamy polního deníku.

KONTROLA SAMOSTATNÉHO SOUBORU
K adrese aplikace přidejte pozadi-hradcany.webp, např.:
https://UZIVATEL.github.io/REPOZITAR/pozadi-hradcany.webp
Jestli jej GitHub zobrazí, byl soubor nahrán.
I bez něj použije aplikace záložní obrázek v CSS.

EDITACE TECHNICKÝCH ÚDAJŮ
Upravujte objekt TECH_SPECS na začátku souboru app.js.

UKLÁDÁNÍ ZÁZNAMŮ
Klíč localStorage pt37-notes-v1 se nemění. Zachovejte stejnou webovou
adresu a nečistěte data stránky.

POZNÁMKA
Režim fullscreen či uzamčení orientace závisí na Androidu/Chromu.
