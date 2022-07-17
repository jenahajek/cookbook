const TYPES = [
  "nevím",
  "snídaně a svačiny",
  "polévky a vývary",
  "obědy a večeře",
  "omáčky a dresinky",
  "přílohy",
  "saláty",
  "předkrmy a chuťovky",
  "pomazánky",
  "přísady a zavařeniny",
  "dezerty, dorty, zákusky a koláče",
  "pití",
];

const CATEGORIES = [
  "nevím",
  "vyloženě zdravé",
  "vhodné pro těhotné",
  "veganské",
  "vegetariánské",
  "paleo",
  "bez lepku",
  "bez laktózy",
  "bez cukru",
  "vhodné pro děti",
  "z jednoho hrnce",
  "lehké jídlo",
  "co se dá zabalit na výlet, na kolo",
  "party jídlo",
];

const TASTE = [
  "nevím",
  "sladká",
  "slaná",
  "kyselá",
  "pikantní",
  "hořká",
  "umami",
];

const STOCK = [
  "prakticky stále doma",
  "běžně doma",
  "běžně k sehnání",
  "exotické",
  "sezónní",
];

const SEASON = [
  "nevím",
  "Leden",
  "Únor",
  "Březen",
  "Duben",
  "Květen",
  "Červen",
  "Červenec",
  "Srpen",
  "Září",
  "Říjen",
  "Listopad",
  "Prosinec",
];

const DIFFICULTY = [
  "nevím",
  "vyloženě snadné",
  "spíš snadné",
  "spíš složité",
  "složité",
];

const INGREDIENCES_PREP_TIME = [
  // rozmrazovani, nalozeni pres noc do vody atp.
  "nevím",
  "cca 1 den",
  "pár hodin",
  "krátce",
  "vůbec",
];

const ACTIVE_COOKING_TIME = [
  // krajeni, cisteni, michani atp
  "nevím",
  "více než 4 hodiny",
  "cca do 4 hodin",
  "cca do 90 minut",
  "cca do 30 minut",
  "instantní",
];

const TOTAL_COOKING_TIME = [
  // vcetne cekani, az se to nakyne, dopece v troube atp. a lze delat neco mezitim
  "nevím",
  "více než 4 hodiny",
  "cca do 4 hodin",
  "cca do 90 minut",
  "cca do 30 minut",
  "instantní",
];

const PROCESS = [
  "nevím",
  "raw",
  "vaření",
  "na páře",
  "pošírování (vaření do 100℃)",
  "intenzivní var",
  "vaření pod tlakem",
  "konfitování (vaření v oleji)",
  "blanšírování (zchlazení po vaření)",
  "zadělávání",
  "zahušťování",
  "dušení",
  "pečení",
  "mělké smažení",
  "hluboké smažení",
  "grilování",
];

const SERVING_TEMP = ["nevím", "teplé", "lze ohřát", "studené"];

const CUISINE = [
  "nevím",
  "Finsko",
  "Francie",
  "Česko",
  "Slovensko",
  "Střední Evropa",
  "Itálie",
  "Středozemí",
  "Řecko",
  "Balkán",
  "Turecko",
  "Blízký východ",
  "Indie",
  "Nepál",
  "Asie",
  "Korea",
  "Vietnam",
  "Mexiko",
  "USA",
  "Jižní Amerika",
  "Gruzie",
  "Necháme se podat",
];

const PRICE = ["nevím", "levné", "normální", "exkluzivní"];

export {
  TYPES,
  CATEGORIES,
  TASTE,
  STOCK,
  SEASON,
  DIFFICULTY,
  INGREDIENCES_PREP_TIME,
  ACTIVE_COOKING_TIME,
  TOTAL_COOKING_TIME,
  PROCESS,
  SERVING_TEMP,
  CUISINE,
  PRICE,
};
