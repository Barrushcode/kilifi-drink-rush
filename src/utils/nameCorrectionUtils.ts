
/**
 * Map of known product name typos to corrections.
 * Add more to this list as needed.
 */
const PRODUCT_NAME_CORRECTIONS: Record<string, string> = {
  "bllack ram": "Black Ram",
  "johny walker": "Johnnie Walker",
  "hennessey": "Hennessy",
  "moet chandon": "Moët & Chandon",
  "captain morgon": "Captain Morgan",
  "jonnie walker": "Johnnie Walker",
  "ballentines": "Ballantine's",
  // Add more known common corrections below
  "vokka": "Vodka",
  "chamdor": "Chamdor",
  "red lable": "Red Label",
  "chivas regal": "Chivas Regal",
  "jamesno": "Jameson",
  "red winee": "Red Wine",
  // ...extend as needed...
};

/**
 * Returns the corrected product name for display.
 * If not found, it returns the original name with normalized casing.
 */
export function correctProductName(name: string): string {
  const normalized = name.trim().toLowerCase();
  if (PRODUCT_NAME_CORRECTIONS.hasOwnProperty(normalized)) {
    return PRODUCT_NAME_CORRECTIONS[normalized];
  }
  // Fuzzy: Fix common issues (extra spaces, all lowercase, e.g. 'bllack ram 1l')
  for (const typo in PRODUCT_NAME_CORRECTIONS) {
    if (normalized.startsWith(typo + " ")) {
      return name.replace(new RegExp(typo, "i"), PRODUCT_NAME_CORRECTIONS[typo]);
    }
    if (normalized.includes(typo)) {
      return name.replace(new RegExp(typo, "ig"), PRODUCT_NAME_CORRECTIONS[typo]);
    }
  }
  // Auto-capitalize each word
  return name.replace(/\b\w/g, c => c.toUpperCase());
}
