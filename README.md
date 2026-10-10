# Vespucci College — nieuwe website

Redesign van [vespuccicollege.net](https://vespuccicollege.net) in Next.js 16, React en Tailwind CSS v4.
Fase 1: dezelfde kleuren, dezelfde secties en dezelfde teksten als de huidige WordPress-site.

## Starten

```bash
npm install
npm run dev
```

Open daarna http://localhost:3000.

Controleren voordat je pusht:

```bash
npm run lint
npm run build
```

## Structuur

| Pad | Inhoud |
| --- | --- |
| `src/lib/site.ts` | Menu en contactgegevens |
| `src/app/page.tsx` | Homepage: metadata, JSON-LD en de volgorde van de secties |
| `src/components/home/` | Eén component per homepage-sectie, plus `Reveal`, `Parallax` en gedeelde UI |
| `src/app/[...slug]/page.tsx` | Tijdelijke pagina voor subpagina's die nog niet zijn overgezet |
| `src/components/` | Header, Footer en kleine UI-onderdelen |
| `src/app/globals.css` | Kleuren en fonts (Tailwind-theme) |
| `public/images/` | Afbeeldingen van de huidige site |

## Kleuren en typografie

Tokens staan in `src/app/globals.css`. Oranje is de enige accentkleur.

| Naam | Hex | Tailwind | Gebruik |
| --- | --- | --- | --- |
| Oranje | `#FF821F` | `orange` | Vlakken, lijnen, knoppen (met navy tekst) |
| Ember | `#A8440A` | `ember` | Oranje als tekst op lichte vlakken (AA) |
| Navy | `#1C244C` | `navy` | Tekst en donkere vlakken |
| Slate | `#4A5072` | `slate` | Secundaire tekst op licht |
| Mist | `#C9CDE0` | `mist` | Secundaire tekst op navy |
| Kalk | `#FDFAF5` | `chalk` | Paginagrond |
| Zand | `#F3E7D3` | `sand` | Warme vlakken |

Koppen: Bricolage Grotesque (`font-display`). Lopende tekst: Hanken Grotesk (`font-sans`).

## Werkwijze

- Iedereen werkt op een eigen branch (bijvoorbeeld `reza`), nooit direct op `main`.
- Wijzigingen gaan via een pull request naar `main`.
- Teksten neem je letterlijk over van de huidige site; verzin geen nieuwe feiten.

## Team

- Lex
