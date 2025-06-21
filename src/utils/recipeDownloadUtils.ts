
interface Recipe {
  name: string;
  ingredients: string[];
  description: string;
  image: string;
}

export const downloadRecipeAsPDF = (recipe: Recipe) => {
  // Create a simple text-based recipe format for download
  const recipeContent = `
BARRUSH COCKTAIL RECIPE
========================

${recipe.name.toUpperCase()}
${'-'.repeat(recipe.name.length)}

DESCRIPTION:
${recipe.description}

INGREDIENTS:
${recipe.ingredients.map(ingredient => `• ${ingredient}`).join('\n')}

INSTRUCTIONS:
1. Add all ingredients to a mixing glass with ice
2. Stir well to combine and chill
3. Strain into appropriate glassware
4. Garnish as specified
5. Serve immediately

---
Recipe courtesy of Barrush Delivery
Visit us at barrush.com for premium spirits
`;

  // Create and trigger download
  const blob = new Blob([recipeContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${recipe.name.replace(/\s+/g, '_').toLowerCase()}_recipe.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadRecipeAsText = (recipe: Recipe) => {
  downloadRecipeAsPDF(recipe); // For now, same implementation
};
