# Boekenhulp

Adviesapp voor de boekenkast van groep 5 en 6: het kind beantwoordt 3 vragen (AVI-niveau, hobby, soort verhaal; de laatste mag overgeslagen worden) en krijgt 3 boeken voorgesteld (met "Nog meer boeken" voor de volgende 3). Geen uitleenfunctie, geen accounts, geen internet nodig tijdens gebruik.

## Uitproberen
Dubbelklik op `index.html` (of sleep het bestand in Chrome/Safari).

## Op de tablet zetten
1. Zet de hele map online, bijvoorbeeld met Netlify Drop (app.netlify.com/drop) of GitHub Pages. Gratis, en het is gewoon een statische site.
2. Open de link op de tablet en kies *Zet op beginscherm* (iPad: Delen → Zet op beginscherm; Android: menu → App installeren). Hij opent dan schermvullend.
3. Na het eerste bezoek werkt hij ook zonder wifi (`sw.js` bewaart de bestanden).
4. Vergrendel de tablet zodat kinderen niet uit de app kunnen: iPad → *Begeleide toegang* (Instellingen → Toegankelijkheid), Android → *App vastzetten*.
5. Na 2 minuten zonder aanraking springt de app zelf terug naar het beginscherm (`IDLE_SECONDEN` bovenin `app.js`).

Na een wijziging in de boeken moet je de map opnieuw uploaden.

## De boeken beheren
De database is `boeken.csv` (open in Excel/Numbers; scheidingsteken is `;`).

| kolom | betekenis |
|---|---|
| id | korte unieke naam zonder spaties, bijv. `dolfje-weerwolfje`. Ook de bestandsnaam van het omslag |
| niveau | 1 = AVI M5–E5, 2 = M6–E6, 3 = Plus |
| dikte | 1 dun, 2 gemiddeld, 3 dik |
| plaatjes | 1 weinig, 2 een paar, 3 veel (strips = 3) |
| serie | 1 of 0 |
| genres | uit: `grappig spannend fantasie avontuur gevoel detective griezel weetjes` |
| themas | vrije trefwoorden, gescheiden door spaties. De hobby's in de app wijzen hiernaartoe (zie `HOBBYS` in `app.js`) |
| omschrijving | max. 1–2 korte zinnen, voor kinderen geschreven |

Daarna:
```
python3 tools/maak_boeken.py     # CSV -> books.js
python3 tools/haal_covers.py     # (optioneel) ontbrekende omslagen zoeken bij Open Library
```
Een eigen omslag? Zet `covers/<id>.jpg` neer en draai `maak_boeken.py`. Boeken zonder omslag krijgen een gekleurde kaft met de titel.

## Hoe wordt het advies berekend?
`score()` in `app.js`: leesniveau (AVI M5/E5 → niveau 1, M6/E6 → 2, Plus → 3; te moeilijk telt zwaar mee), gekozen genres en hobby's tellen punten op; er komt een klein toeval bij zodat een tweede kind niet altijd hetzelfde krijgt, en er staat nooit twee keer dezelfde auteur in één rijtje van 3.

## Hobby's die de app niet kent
Bij "Iets anders…" kan een kind een woord typen. `SYNONIEMEN` in `app.js` koppelt woorden aan hobby's/thema's. Woorden die niet herkend worden, worden op de tablet bewaard. Bekijken: open de site in de browser van de tablet/computer en typ in de console `localStorage.getItem('onbekendeHobbys')`. Voeg de vaakst voorkomende woorden toe aan `SYNONIEMEN`.

## Let op bij de startdata
- De ±100 boeken zijn een startset. Titels, auteurs en korte omschrijvingen zijn door mij opgesteld, niet overgenomen van de uitgever; het AVI-niveau en de dikte zijn schattingen. Controleer dat voor je ze aan kinderen laat zien.
- Omslagen komen van Open Library/Wikipedia en zijn soms een andere uitgave (bijv. Engelstalig of een oudere druk). Voor een definitieve versie liever eigen foto's van de boeken in de kast.
