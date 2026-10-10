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
| `src/lib/site.ts` | Menu, contactgegevens, opleidingen en reviews |
| `src/app/page.tsx` | Homepage met alle secties |
| `src/app/[...slug]/page.tsx` | Tijdelijke pagina voor subpagina's die nog niet zijn overgezet |
| `src/components/` | Header, Footer en kleine UI-onderdelen |
| `src/app/globals.css` | Kleuren en fonts (Tailwind-theme) |
| `public/images/` | Afbeeldingen van de huidige site |

## Kleuren

| Naam | Hex | Tailwind |
| --- | --- | --- |
| Oranje | `#FF821F` | `orange` |
| Navy | `#1C244C` | `navy` |
| Blauw | `#417CD4` | `blue` |
| Crème | `#FBF3E8` | `cream` |

## Werkwijze

- Iedereen werkt op een eigen branch (bijvoorbeeld `reza`), nooit direct op `main`.
- Wijzigingen gaan via een pull request naar `main`.
- Teksten neem je letterlijk over van de huidige site; verzin geen nieuwe feiten.

## Team

- Lex
