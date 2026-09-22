export function getGreeting(name: string | null, date: Date = new Date()): string {
  const hour = date.getHours();
  const timeGreeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';
  return name ? `${timeGreeting}, ${name} ✨` : `${timeGreeting} ✨`;
}
