export const LEGACY_URL = "https://vespuccicollege.net";

export const contact = {
  phone: "+5999 888 7227",
  phoneHref: "tel:+59998887227",
  email: "info@vespuccicollege.net",
  address: "St.Michielsweg 14 S, Julianadorp",
  facebook: "https://www.facebook.com/vespuccicollege",
  magister: "https://magister.nl/",
};

export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { children?: NavLink[] };

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Onderwijs",
    href: "/onderwijs/tweejarige-brugklas",
    children: [
      { label: "Tweejarige brugklas", href: "/onderwijs/tweejarige-brugklas" },
      { label: "Mavo", href: "/onderwijs/mavo" },
      { label: "Havo", href: "/onderwijs/havo" },
      { label: "Vwo", href: "/onderwijs/vwo" },
      { label: "Over de lesuren", href: "/onderwijs/over-de-lesuren" },
      { label: "Bevorderingsnormen", href: "/onderwijs/bevorderingsnormen" },
      { label: "Regels rondom toetsing", href: "/onderwijs/regels-rondom-toetsing" },
      { label: "PTA", href: "/onderwijs/programma-van-toetsing-en-afsluiting-pta" },
      { label: "PTD", href: "/onderwijs/programma-van-toetsing-en-doorstroom" },
      { label: "Examenzaken", href: "/onderwijs/examenzaken" },
      { label: "Examenrooster", href: "/onderwijs/examenrooster" },
      { label: "Roosters", href: "/onderwijs/roosters" },
      { label: "Boekenlijst", href: "/onderwijs/boekenlijst" },
    ],
  },
  {
    label: "Onze school",
    href: "/onze-school/visie-en-missie",
    children: [
      { label: "Visie en missie", href: "/onze-school/visie-en-missie" },
      { label: "Onze organisatie", href: "/onze-school/onze-organisatie" },
      { label: "Ouderraad", href: "/onze-school/ouderraad" },
      { label: "Schoolgids", href: "/onze-school/schoolgids" },
      { label: "Schoolondersteuningsprofiel (SOP)", href: "/onze-school/schoolondersteuningsprofielsop" },
      { label: "Gedragscode personeel", href: "/onze-school/gedragscode-personeel" },
      { label: "Schoolregels", href: "/onze-school/schoolregels" },
      { label: "Veiligheidsplan", href: "/onze-school/veiligheidsplan" },
      { label: "Inspectierapport", href: "/onze-school/inspectierapport" },
      { label: "Schoolkosten", href: "/onze-school/schoolkosten" },
      { label: "Stage lopen", href: "/onze-school/stage-lopen" },
      { label: "Vacatures", href: "/onze-school/vacatures" },
    ],
  },
  { label: "Agenda", href: "/agenda" },
  {
    label: "Begeleiding",
    href: "/begeleiding/individuele-begeleiding",
    children: [
      { label: "Individuele begeleiding", href: "/begeleiding/individuele-begeleiding" },
      { label: "Kwt & begeleidingsles", href: "/begeleiding/kwt-begeleidingsles" },
      { label: "Huiswerkbegeleiding", href: "/begeleiding/huiswerkbegeleiding" },
      { label: "Decanaat", href: "/begeleiding/decanaat" },
      { label: "Stages & werkweken", href: "/begeleiding/stages-werkweken" },
      { label: "Leerlingenraad", href: "/begeleiding/leerlingenraad" },
      { label: "School- en studiereizen", href: "/begeleiding/school-en-studiereizen" },
      { label: "Begeleiding bij verhuizing", href: "/begeleiding/begeleiding-bij-verhuizing" },
    ],
  },
  {
    label: "Aanmelding & Info",
    href: "/aanmelding-info/inschrijven",
    children: [
      { label: "Inschrijven", href: "/aanmelding-info/inschrijven" },
      { label: "Inventarisatieformulier", href: "/aanmelding-info/inventarisatieformulier" },
      { label: "Verlof aanvragen", href: "/aanmelding-info/verlof-aanvragen" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

/** All internal pages except home, flattened — used for not-yet-migrated routes. */
export const allPages: NavLink[] = navigation
  .flatMap((item) => [item, ...(item.children ?? [])])
  .filter((link, i, arr) => link.href !== "/" && arr.findIndex((l) => l.href === link.href) === i);

export const opleidingen = [
  {
    title: "Tweejarige Brugklas",
    text: "Als je bij ons in de brugklas begint, kijken we eerst goed op welk niveau je het beste kunt instromen...",
    href: "/onderwijs/tweejarige-brugklas",
    color: "bg-orange",
  },
  {
    title: "MAVO",
    text: "In leerjaar 3 en 4 van de mavo krijg je lesstof die belangrijk is voor je examen. In het zogenaamde...",
    href: "/onderwijs/mavo",
    color: "bg-sun",
  },
  {
    title: "HAVO",
    text: "Tijdens het derde leerjaar krijg je nog alle vakken. In de onderbouw heb je het vak mens...",
    href: "/onderwijs/havo",
    color: "bg-blue",
  },
  {
    title: "VWO",
    text: "Het hele derde leerjaar staat in het teken van het maken van een gemotiveerde keuze voor...",
    href: "/onderwijs/vwo",
    color: "bg-navy",
  },
];

export const reviews = [
  {
    quote:
      "Hallo, ik ben Thijs. Het grootste voordeel van het Vespucci College vind ik dat er in de les veel meer rust is. In Nederland is het vaak druk in de les en is de leraar veel bezig met orde. Op het Vespucci College is dit niet het geval. Je krijgt echt de kans om je optimaal te ontwikkelen.",
    name: "Thijs",
    role: "VWO",
  },
  {
    quote:
      "Als moeder van een leerling op Vespucci College wil ik graag mijn ervaring delen over deze bijzondere school. Mijn dochter, Sophie, zit nu in haar tweede jaar en ik ben buitengewoon tevreden met de progressie die ze maakt. Ik ben enorm dankbaar dat Sophie op Vespucci College zit.",
    name: "Maria de Vries",
    role: "Moeder van Sophie",
  },
  {
    quote:
      "Hoi. Ik ben Abby en ik zit nu een half jaar op het Vespucci College. Wat ik heel erg gemerkt heb, is dat de klassen veel kleiner zijn en daardoor er meer persoonlijke aandacht voor je is. Ook worden al je vragen beantwoord en is er veel begeleiding. We doen vaak activiteiten en dat houdt ons als leerlingen enthousiast.",
    name: "Abby",
    role: "Havo",
  },
];
