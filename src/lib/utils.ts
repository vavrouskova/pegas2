import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formátuje přeložený text nahrazením HTML tagů za znaky nového řádku
 * @param text - Text k formátování
 * @returns Formátovaný text s novými řádky místo HTML tagů
 */
export function formatTranslation(text: string): string {
  return text.replaceAll('<br/>', '\n');
}
