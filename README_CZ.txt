OSOBNÍ TERMINÁL P.T. 37 — prototyp 0.2
======================================
Tento balíček obsahuje webovou aplikaci ve stylu jantarového retro terminálu.

FUNKCE
- Hodiny a datum (skutečný čas telefonu)
- Zápisník; záznamy se ukládají lokálně v prohlížeči
- Export deníku do TXT
- Malá cestovní encyklopedie fiktivního světa
- GPS poloha na vyžádání (nutné povolit polohu)
- Otevření online OpenStreetMap v prohlížeči
- Offline načítání základního rozhraní po prvním návštěvě na HTTPS

JAK ZPROVOZNIT NA MOBILU
1. Rozbalte ZIP a nahrajte celý obsah složky na hosting statických webů
   s HTTPS (například Netlify Drop nebo GitHub Pages).
2. Otevřete výslednou HTTPS adresu v Chrome na Androidu.
3. Z nabídky Chromu zvolte Instalovat aplikaci / Přidat na plochu,
   pokud prohlížeč tuto možnost nabízí.
4. Spouštějte P.T. 37 z vytvořené ikony. Nastavený fullscreen
   a landscape závisejí na podpoře telefonu/prohlížeče.
5. Připojení je třeba pro prvotní načtení, později má základ běžet offline.

POZOR
- Pouhé otevření index.html jako místního souboru může zobrazit náhled,
  ale neumožní plnou instalaci PWA ani všechny funkce.
- Kódy v balíčku nejsou zveřejněné ani nahrané na server.
- Údaje deníku jsou v localStorage daného webového původu/prohlížeče;
  odstranění dat aplikace je smaže. Používejte Exportovat deník.
- Offline mapa není součástí prototypu; GPS může fungovat bez internetu,
  otevření mapové služby připojení potřebuje.
- Nápis P.T. 37 a značení TESLA jsou prozatímní grafickou stylizací.

NOVINKY VERZE 0.2
- Kliknutím na horní znak T (či název) návrat do hlavní nabídky.
- V dolní liště již pouze označení verze a aktuální čas.
- Datum bez roku; hodiny a informace posunuty výše.
- Větší a tučnější text, větší ikonky, popisky a dotykové cíle.
- Rezerva pro přední kameru vlevo uprostřed v režimu na šířku.
- Poznámky z předchozí verze zůstávají uložené (stejná adresa a prohlížeč).

AKTUALIZACE NA GITHUB PAGES
- Nahraďte všechny soubory novou verzí v kořeni stejného repozitáře;
  zachovejte původní HTTPS adresu.
- Soubory nahrajte rozbalené, nikoli jako ZIP.
- Offline cache má nové označení; po nasazení aplikaci zavřete a znovu
  otevřete. Pokud se objeví stará verze, aplikaci znovu načtěte.
- Není nutné přeinstalovat aplikaci ani mazat její data.
