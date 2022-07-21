// filter will be rendered in this order
const FILTER_DIMENSIONS = [
  // {
  //   dimension: "queue",
  //   label: "Ve frontě",
  // },
  // {
  //   dimension: "sources",
  //   label: "Zdroj",
  // },
  {
    dimension: "type",
    label: "Typ jídla",
  },
  // temporarily off, due to the fact it is not array, but boolean. And I need to make adjustments to redux setup
  // {
  //   dimension: "wishlist",
  //   label: "Wishlist",
  // },
  {
    dimension: "taste",
    label: "Chuť",
  },
  {
    dimension: "mainIngredience",
    label: "Hlavní ingredience",
  },
  {
    dimension: "stock",
    label: "Dostupnost surovin",
  },
  // {
  //   dimension: "season",
  //   label: "Sezóna",
  // },
  {
    dimension: "difficulty",
    label: "Náročnost",
  },
  {
    dimension: "activeCookingTime",
    label: "Délka aktivního vaření",
  },
  {
    dimension: "totalCookingTime",
    label: "Celková délka vaření",
  },
  {
    dimension: "process",
    label: "Způsob přípravy",
  },
  {
    dimension: "servingTemp",
    label: "Teplé studené",
  },
  {
    dimension: "categories",
    label: "Kategorie",
  },
  {
    dimension: "cuisine",
    label: "Kuchyně",
  },
  {
    dimension: "price",
    label: "Cena",
  },
  // {
  //   dimension: "tags",
  //   label: "Štítky",
  // },
];

export default FILTER_DIMENSIONS;
