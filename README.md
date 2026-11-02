# Hotel Rozenburg — website concept

Een nieuw ontwerp voor [hotelrozenburg.nl](https://hotelrozenburg.nl/), geïnspireerd op de
redactionele luxury-stijl van [The Berkeley (Maybourne)](https://www.maybourne.com/en/hotels/the-berkeley),
maar toegespitst op Hotel Rozenburg: warme zand- en goudtinten, het eigen goud `#CDB382`,
en de echte foto's, teksten en contactgegevens van het hotel.

> **Status: concept / voorbeeld.** Alle pagina's zijn statisch (HTML + CSS + vanilla JS),
> zonder build-stap. De boekingsbalk en het contactformulier zijn *demo's* en versturen
> nog niets. De "Boek nu"-knoppen verwijzen wel naar de echte boekingsmotor van het hotel.

## Git

De code staat in de repository `jalvdbroek-ship-it/hotel-rozenburg`. Elke push naar `main` publiceert de site opnieuw op GitHub Pages (workflow in `.github/workflows/deploy.yml`).

## Live

De site draait op GitHub Pages:

**<https://jalvdbroek-ship-it.github.io/hotel-rozenburg/>**

Publiceren gaat automatisch bij elke push naar `main` (workflow in `.github/workflows/deploy.yml`).

## Bekijken

```bash
node server.mjs 4187      # → http://localhost:4187
```

Elk bestand kan ook rechtstreeks in de browser worden geopend; alleen de Google Maps
iframe en de Google Fonts hebben dan internet nodig.

## Pagina's

| Bestand | Inhoud |
| --- | --- |
| `index.html` | Home: hero, boekingsbalk, kamers, brasserie, omgeving, arrangementen, zakelijk, reviews, galerij |
| `hotel.html` | Het hotel: kamertypes, ontbijt, vergaderen, ligging, praktische informatie |
| `restaurant.html` | Brasserie Noortje: sfeer, menukaart, openingstijden, reserveren |
| `arrangementen.html` | Weekend-, zomer- en high-tea-arrangement, fietsen, zakelijk verblijf |
| `contact.html` | Contactformulier, gegevens van hotel/brasserie/catering, kaart |

## Opbouw

```
index.html / hotel.html / restaurant.html / arrangementen.html / contact.html
assets/
  css/style.css      volledig design system (tokens, componenten, responsive)
  js/main.js         header, mobiel menu, sliders, reveal, formulieren, teller (ESM)
  img/               foto's, logo's en betaalmiddelen (geoptimaliseerd, ~4,7 MB)
server.mjs           kleine statische server voor lokaal preview
```

`main.js` is een ES-module (`<script type="module">`) zonder globale state.

## Layout & ritme

Om te voorkomen dat de site als een reeks identieke blokken leest, wisselen de
pagina's af tussen vier layouts:

| Layout | Gebruikt voor |
| --- | --- |
| `.feature` | tekst + beeld naast elkaar (intro, kamers, ontbijt) |
| `.band` | full-bleed foto met tekst erover (brasserie, vergaderen, openingstijden) |
| `.grid--3` / `.tile` | drie beelden naast elkaar (omgeving, arrangementen) |
| `.card` | tekstkaarten met eigen kop (kamertypes, speciales) |

Daarbovenop: `.section-head` (kop + aside op één basislijn), `.pillars` (drie korte
kolommen), `.divider-crest` (wapen-scheiding) en een `.stats`-band.

De hero is een beeldrotatie met per beeld een eigen `--focus`, plus een zachte scrim
(`radial-gradient`) die precies over de koptekst ligt zodat de tekst altijd leesbaar
blijft, ook op drukke foto's.

## Design

| Token | Waarde | Gebruik |
| --- | --- | --- |
| `--paper` | `#f7f4ee` | cream achtergrond |
| `--paper-2` | `#efe9de` | zand, afwisselende secties |
| `--ink` | `#16130e` | donkere secties, tekst |
| `--gold` | `#cdb382` | merkaccent (komt uit de bestaande huisstijl) |
| `--gold-deep` | `#8a7333` | accent op cream |
| `--rozenburg-red` | `#a11a20` | heraldisch rood, alleen als subtiel accent |
| `--forest` | `#1e2a23` | CTA-band |

Typografie: **Cormorant Garamond** (display, serif) + **Inter** (tekst en navigatie),
beide via Google Fonts met system-fallbacks.

### Wapen van Rozenburg

`assets/img/crest-rozenburg.svg` is het officiële **wapen van Rozenburg** (goud met twee
rode palen, twee gouden rozen en een zilveren toren), in tekening van de Hoge Raad van
Adel via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Rozenburg_wapen.svg)
(public domain). Het is zichtbaar aanwezig, zonder te schreeuwen:

- een schildje naast de wordmark in de header (de "lockup");
- een schildje naast de wordmark in de footer;
- een schildje boven de titel op de binnenpagina's;
- een schildje tussen twee haarlijnen als sectiescheider;
- een groot silhouet (10% opacity) als watermerk in de CTA-band;
- een minuscuul schildje in de topbar naast het adres.

Het heraldische rood (`--rozenburg-red`, `#a11a20`) loopt door de site: de 2px-lijn
onder de topbar, de onderstreping van de actieve navigatie, het lijntje vóór de
eyebrow-labels, de actieve review-dot en de hover van de "lees meer"-links. Het goud
(`--gold`, `#cdb382`) blijft de primaire merk- en knopkleur, zodat de knoppen
onmiddellijk herkenbaar blijven.

Het logo van het hotel zelf is ongewijzigd overgenomen.

Kenmerken: transparante header over de hero die vastplakt bij scrollen, hairline-lijnen
in plaats van kaders, kleine uppercase labels met ruime letterspacing, grote
full-bleed-beelden, donkere secties voor de brasserie en de reviews.

### Robuustheid

- Zonder JavaScript blijft alle tekst leesbaar (`<noscript>`-fallback).
- De scroll-reveal heeft een vangnet: content die al voorbij het viewport ligt, wordt
  altijd zichtbaar gemaakt, ook als de IntersectionObserver niet vuurt.
- `prefers-reduced-motion` schakelt alle animaties uit.
- Er is een printstylesheet dat de donkere vlakken en vaste elementen vereenvoudigt.

## Wat er nog moet gebeuren voor livegang

1. **Boekingsbalk koppelen** aan de boekingsmotor (`ibe.smarthotel.nl`) of een eigen
   availability-endpoint; nu is het een demo-antwoord.
2. **Contactformulier** aansluiten op WordPress (Contact Form 7) of een mail-API.
3. **Engelse versie** bouwen (de site heeft nu `/en/`); de topbar-link verwijst
   nog naar de huidige live versie.
4. **Content ophalen** uit WordPress: arrangementen, kamerlijst, prijzen en de
   ontbijttijden kunnen live worden ingeladen zodat ze bijgewerkt kunnen worden.
5. **Beeldmateriaal**: de huidige foto's komen uit de bestaande mediabibliotheek.
   Voor een definitieve look zijn professionele interieur- en sfeerfoto's aan te bevelen.
6. **Toegankelijkheid & SEO** controleren met een echte audit ( Lighthouse, axe) en
   de bestaande `Privacy policy` en `Vacatures`-pagina's in het menu opnemen.

## Bronnen

- Teksten, openingstijden, contactgegevens en reviews: [hotelrozenburg.nl](https://hotelrozenburg.nl/)
- Fotografie: de bestaande mediabibliotheek van hotelrozenburg.nl
- Wapen van Rozenburg: Hoge Raad van Adel, via Wikimedia Commons (public domain)
- Stijlreferentie: [The Berkeley by Maybourne](https://www.maybourne.com/en/hotels/the-berkeley)
