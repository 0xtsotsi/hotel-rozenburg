# Hotel Rozenburg — website concept

Een nieuw ontwerp voor [hotelrozenburg.nl](https://hotelrozenburg.nl/), geïnspireerd op de
redactionele luxury-stijl van [The Berkeley (Maybourne)](https://www.maybourne.com/en/hotels/the-berkeley),
maar toegespitst op Hotel Rozenburg: warme zand- en goudtinten, het eigen goud `#CDB382`,
en de echte foto's, teksten en contactgegevens van het hotel.

> **Status: concept / voorbeeld.** Alle pagina's zijn statisch (HTML + CSS + vanilla JS),
> zonder build-stap. De boekingsbalk en het contactformulier zijn *demo's* en versturen
> nog niets. De "Boek nu"-knoppen verwijzen wel naar de echte boekingsmotor van het hotel.

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
  js/main.js         header, mobiel menu, sliders, reveal, formulieren, teller
  img/               foto's, logo's en betaalmiddelen (geoptimaliseerd, ~6 MB)
server.mjs           kleine statische server voor lokaal preview
```

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
(public domain). Het wordt zeer subtiel ingezet:

- een minuscuul schildje in de topbar naast het adres;
- een klein schildje boven de wordmark in de footer;
- een klein ornament boven de titel op de binnenpagina's;
- het heraldische rood (`--rozenburg-red`) in het lijntje vóór de eyebrow-labels, de actieve
  review-dot en de hover van de "lees meer"-links.

Het logo van het hotel zelf is ongewijzigd overgenomen.

Kenmerken: transparante header over de hero die vastplakt bij scrollen, hairline-lijnen
in plaats van kaders, kleine uppercase labels met ruime letterspacing, grote
full-bleed-beelden, donkere secties voor de brasserie en de reviews.

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
