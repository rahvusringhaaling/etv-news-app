export function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// #2E3192 => rgba(46, 49, 146, 0.1)
export function hexToRgba(hex: string) {
  const integer = parseInt(hex.substring(1), 16);
  const r = (integer >> 16) & 255;
  const g = (integer >> 8) & 255;
  const b = integer & 255;
  return `rgba(${r}, ${g}, ${b}, 0.1)`;
}

export function getWeekDay(date: Date): string {
  return capitalize(date.toLocaleDateString('et', { weekday: 'long' }));
}

export function getMonthName(date: Date): string {
  return date.toLocaleDateString('et', { month: 'long' });
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
