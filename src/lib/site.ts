export const LEGACY_URL = "https://vespuccicollege.net";
export const SITE_URL = LEGACY_URL;

export const contact = {
  phone: "+5999 888 7227",
  phoneHref: "tel:+59998887227",
  email: "info@vespuccicollege.net",
  address: "St.Michielsweg 14 S, Julianadorp",
  street: "St. Michielsweg 14 S",
  locality: "Julianadorp",
  country: "Curaçao",
  maps: "https://maps.google.com/?q=Vespucci+College+St.Michielsweg+14+Julianadorp+Curacao",
  // TODO: coördinaten laten controleren door de school (nu afgerond op boogminuten).
  coordinates: "12°09′N 68°59′W",
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
