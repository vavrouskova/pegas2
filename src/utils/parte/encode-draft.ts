import { ParteDraft } from '@/types/parte';

const toUrlSafe = (value: string): string =>
  // eslint-disable-next-line sonarjs/slow-regex
  value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const fromUrlSafe = (value: string): string => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  return padded + '='.repeat(padLength);
};

export const encodeDraft = (draft: ParteDraft): string => {
  const json = JSON.stringify(draft);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCodePoint(byte);
  });
  return toUrlSafe(btoa(binary));
};

export const decodeDraft = (token: string): ParteDraft | null => {
  try {
    const binary = atob(fromUrlSafe(token));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.codePointAt(index) ?? 0;
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as ParteDraft;
    if (parsed?.version !== 1 || !parsed.templateId) return null;
    return parsed;
  } catch {
    return null;
  }
};
