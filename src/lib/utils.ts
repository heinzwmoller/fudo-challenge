/**
 * Utility function to merge classes into a single string
 * @param classes - The classes to merge
 * @returns The merged classes as a string
 */

export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats a date in a Reddit-style relative time format in Spanish
 * @param date - The date to format (can be a Date object or ISO string)
 * @returns A string like "Hace 1 día", "Hace 3 horas", etc.
 */

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return diffInSeconds <= 1
      ? "Hace 1 segundo"
      : `Hace ${diffInSeconds} segundos`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1
      ? "Hace 1 minuto"
      : `Hace ${diffInMinutes} minutos`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? "Hace 1 hora" : `Hace ${diffInHours} horas`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? "Hace 1 día" : `Hace ${diffInDays} días`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? "Hace 1 semana" : `Hace ${diffInWeeks} semanas`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? "Hace 1 mes" : `Hace ${diffInMonths} meses`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  if (diffInYears === 0) {
    return diffInMonths === 1 ? "Hace 1 mes" : `Hace ${diffInMonths} meses`;
  }
  return diffInYears === 1 ? "Hace 1 año" : `Hace ${diffInYears} años`;
}
