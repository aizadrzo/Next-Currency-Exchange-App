export const baseUrl = "https://api.frankfurter.dev/v1";

export const imageUrl = (currency : string) => {
  return `https://hatscripts.github.io/circle-flags/flags/${currency}.svg`
};


// Currencies list has been migrated to dynamic Route Handlers /api/currencies