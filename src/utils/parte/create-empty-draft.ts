import { ParteDraft, ParteTemplate } from '@/types/parte';

export const createEmptyDraft = (template: ParteTemplate): ParteDraft => {
  const texts: Record<string, string> = {};
  for (const slot of template.slots) {
    if (slot.type === 'text') {
      texts[slot.id] = slot.defaultText;
    }
  }
  return { templateId: template.id, texts, photos: {}, textStyles: {}, version: 1 };
};
