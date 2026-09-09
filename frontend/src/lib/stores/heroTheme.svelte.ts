let bg = $state('linear-gradient(90deg, #FFE4C7 0%, #FFD9B0 28%, #FF8C4D 65%, #D84317 100%)');

export function heroThemeState() {
  return {
    get bg() {
      return bg;
    },
    set(value: string) {
      bg = value;
    }
  };
}