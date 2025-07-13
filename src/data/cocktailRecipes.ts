export interface Recipe {
  name: string;
  imageKey: string;
  fallbackImage: string;
  ingredients: string[];
  description: string;
  difficulty: string;
  time: string;
}

export const classicRecipes: Recipe[] = [
  {
    name: "Old Fashioned",
    imageKey: 'old-fashioned',
    fallbackImage: "/lovable-uploads/d3fc1dba-2426-4f52-b8af-cb3f2972d874.png",
    ingredients: ["2oz Bourbon Whiskey", "2 dashes Angostura Bitters", "1 sugar cube", "Orange peel", "Ice"],
    description: "The timeless classic that never goes out of style. A perfect balance of whiskey, bitters, and sweetness.",
    difficulty: "Easy",
    time: "3 mins"
  },
  {
    name: "Martini",
    imageKey: 'martini',
    fallbackImage: "/lovable-uploads/eed458a0-c82d-483b-b67a-887e67da1b9c.png",
    ingredients: ["2.5oz Gin", "0.5oz Dry Vermouth", "Lemon twist or olive", "Ice"],
    description: "Sophistication in a glass - shaken or stirred to perfection.",
    difficulty: "Medium",
    time: "2 mins"
  },
  {
    name: "Manhattan",
    imageKey: 'manhattan',
    fallbackImage: "/lovable-uploads/3d2d9178-c92a-47f5-b7cb-43eb099a90ff.png",
    ingredients: ["2oz Rye Whiskey", "1oz Sweet Vermouth", "2 dashes Angostura Bitters", "Cherry garnish"],
    description: "New York's signature cocktail with perfect balance and elegance.",
    difficulty: "Easy",
    time: "3 mins"
  },
  {
    name: "Negroni",
    imageKey: 'negroni',
    fallbackImage: "/lovable-uploads/6ecc4d5a-c5bb-4f87-bc26-efe644461c76.png",
    ingredients: ["1oz Gin", "1oz Campari", "1oz Sweet Vermouth", "Orange peel"],
    description: "Italian aperitif with a perfect bitter-sweet harmony.",
    difficulty: "Easy",
    time: "2 mins"
  },
  {
    name: "Whiskey Sour",
    imageKey: 'whiskey-sour',
    fallbackImage: "/lovable-uploads/a3a04ef4-78fa-4911-8f2f-be21369dba75.png",
    ingredients: ["2oz Bourbon", "1oz Fresh lemon juice", "0.75oz Simple syrup", "Egg white (optional)", "Cherry garnish"],
    description: "Classic sour cocktail with perfect sweet-tart balance.",
    difficulty: "Medium",
    time: "4 mins"
  },
  {
    name: "Daiquiri",
    imageKey: 'daiquiri',
    fallbackImage: "/lovable-uploads/72bc2b2d-1f24-4b19-8f90-68e1f260d2b1.png",
    ingredients: ["2oz White Rum", "1oz Fresh lime juice", "0.75oz Simple syrup", "Lime wheel"],
    description: "Ernest Hemingway's favorite - clean and refreshing.",
    difficulty: "Easy",
    time: "2 mins"
  }
];

export const modernRecipes: Recipe[] = [
  {
    name: "Mojito",
    imageKey: 'mojito',
    fallbackImage: "/lovable-uploads/d5a394f1-75bd-4021-b1ee-89deaea33ab6.png",
    ingredients: ["2oz White Rum", "1oz Fresh lime juice", "2 tsp Sugar", "6-8 Fresh mint leaves", "Soda water", "Ice"],
    description: "Cuban classic with refreshing mint and lime - perfect for summer.",
    difficulty: "Medium",
    time: "5 mins"
  },
  {
    name: "Cosmopolitan",
    imageKey: 'cosmopolitan',
    fallbackImage: "/lovable-uploads/96d89dca-3bcc-4670-b40b-a7bf842d8f48.png",
    ingredients: ["2oz Vodka", "1oz Cointreau", "0.5oz Fresh lime juice", "0.25oz Cranberry juice", "Lime wheel"],
    description: "Pink perfection made famous by Sex and the City.",
    difficulty: "Easy",
    time: "3 mins"
  },
  {
    name: "Margarita",
    imageKey: 'margarita',
    fallbackImage: "/lovable-uploads/ce4a2004-2057-4be6-9e23-2a002763e200.png",
    ingredients: ["2oz Tequila", "1oz Cointreau", "1oz Fresh lime juice", "Salt rim", "Lime wheel"],
    description: "Mexico's gift to the world - perfect for any occasion.",
    difficulty: "Easy",
    time: "3 mins"
  },
  {
    name: "Espresso Martini",
    imageKey: 'espresso-martini',
    fallbackImage: "/lovable-uploads/094b78f1-6048-40cd-84c7-60aab34b4eae.png",
    ingredients: ["2oz Vodka", "1oz Coffee liqueur", "1oz Fresh espresso", "3 Coffee beans"],
    description: "The perfect after-dinner cocktail with a coffee kick.",
    difficulty: "Medium",
    time: "4 mins"
  },
  {
    name: "Moscow Mule",
    imageKey: 'moscow-mule',
    fallbackImage: "/lovable-uploads/f91b31d7-2b11-4bef-b4bd-d54b10ae73de.png",
    ingredients: ["2oz Vodka", "0.5oz Fresh lime juice", "4oz Ginger beer", "Lime wheel", "Fresh mint"],
    description: "Served in copper mugs for the authentic experience.",
    difficulty: "Easy",
    time: "2 mins"
  },
  {
    name: "Piña Colada",
    imageKey: 'pina-colada',
    fallbackImage: "/lovable-uploads/384ba519-4954-4fe4-a346-d5b8de93f533.png",
    ingredients: ["2oz White Rum", "1oz Coconut cream", "1oz Heavy cream", "6oz Pineapple juice", "Pineapple wedge"],
    description: "Tropical paradise in a glass - escape to the islands.",
    difficulty: "Easy",
    time: "3 mins"
  }
];