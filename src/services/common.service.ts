export function estDateValide(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function validateEmail(value: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
}

export const supprimerEspacesVides = (commande: object): void => {
  trimStrings(commande as Record<string, any>);
}

const trimStrings = (obj: Record<string, any>): void => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (value == null) continue;

      if (typeof value === "string") {
        obj[key] = value.trim();
      }

      else if (typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
        trimStrings(value);
      }
    }
  }
}