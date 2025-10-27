import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formátuje přeložený text nahrazením HTML tagů a {{br}} značek za znaky nového řádku
 * @param text - Text k formátování
 * @returns Formátovaný text s novými řádky místo HTML tagů a {{br}} značek
 */
export function formatTranslation(text: string): string {
  // Nahradit staré <br/> i nové {{br}} za \n
  return text.replaceAll('<br/>', '\n').replaceAll('{{br}}', '\n');
}

/**
 * Aplikuje českou typografii - nahrazuje mezery za jednopísmenými předložkami/spojkami
 * nezlomitelnou mezerou, aby se zabránilo jejich umístění na konci řádku.
 *
 * Typické české jednopísmenné předložky a spojky:
 * - a (and)
 * - i (also, even)
 * - o (about)
 * - u (at, by)
 * - v (in)
 * - z (from)
 * - k (to)
 * - s (with)
 *
 * @param text - Text k formátování
 * @returns Text s nezlomitelnými mezerami za jednopísmenými slovy
 *
 * @example
 * czechTypography("Jsem v Praze") // "Jsem v\u00A0Praze"
 * czechTypography("To je a bylo") // "To je a\u00A0bylo"
 */
export function czechTypography(text: string): string {
  if (!text) return text;

  // Nezlomitelná mezera (non-breaking space)
  const nbsp = '\u00A0';

  // Regexp pro jednopísmenná slova následovaná běžnou mezerou
  // \b = word boundary (začátek/konec slova)
  // [aáiíoóuúvzksAÁIÍOÓUÚVZKS] = jednopísmenné předložky (včetně verzí s diakritikou)
  // \b za skupinou zajistí, že se jedná o celé jednopísmenné slovo, ne poslední písmeno delšího slova
  // \s+ = jedna nebo více mezer
  // (?=\S) = positive lookahead - následuje non-whitespace znak (nenahradí mezeru na konci věty)
  const pattern = /\b([aáiíoóuúvzksAÁIÍOÓUÚVZKS])\b\s+(?=\S)/g;

  return text.replace(pattern, `$1${nbsp}`);
}
