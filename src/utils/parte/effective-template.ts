import { getBackgroundById } from '@/data/parte-backgrounds';
import { ParteDraft, ParteTemplate } from '@/types/parte';

export const mergeTemplateWithDraft = (template: ParteTemplate, draft?: ParteDraft): ParteTemplate => {
  if (!draft) return template;

  const background = draft.backgroundId ? getBackgroundById(draft.backgroundId) : undefined;

  return {
    ...template,
    background: background ? { ...template.background, color: background.solidFallback } : template.background,
    slots: template.slots.map((slot) => {
      if (slot.type !== 'text') return slot;
      const override = draft.textStyles?.[slot.id];
      if (!override) return slot;
      return {
        ...slot,
        style: { ...slot.style, ...override },
      };
    }),
  };
};
