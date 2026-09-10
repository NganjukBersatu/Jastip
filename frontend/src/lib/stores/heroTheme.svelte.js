let overHero = $state(true);

export function heroThemeState() {
  return {
    get overHero() {
      return overHero;
    },
   /** @param {boolean} value */
setOverHero(value) {
  overHero = value;
}
  };
}