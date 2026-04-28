import { getTemplateMeta } from '@/data/parte-template-meta';
import { parteTemplates } from '@/data/parte-templates';
import {
  ParteCharacter,
  ParteMood,
  ParteTag,
  ParteTemplate,
  ParteWizardAnswers,
} from '@/types/parte';

const characterTagPreference: Record<ParteCharacter, ParteTag[]> = {
  classic: ['classic'],
  soft: ['classic'],
  dark: ['classic'],
  minimal: ['minimal'],
  modern: ['modern'],
};

const characterMoodPreference: Record<ParteCharacter, ParteMood[]> = {
  classic: ['light'],
  soft: ['cream', 'light'],
  dark: ['dark'],
  minimal: ['light', 'cream'],
  modern: ['light', 'grey'],
};

export const scoreTemplate = (template: ParteTemplate, answers: ParteWizardAnswers): number => {
  const meta = getTemplateMeta(template.id);
  let score = 0;

  const tagPreference = characterTagPreference[answers.character];
  if (meta.tags.some((tag) => tagPreference.includes(tag))) {
    score += 40;
  }

  const moodPreference = characterMoodPreference[answers.character];
  if (moodPreference.includes(meta.mood)) {
    score += 20;
  }

  if (answers.character === 'soft' && meta.accent === 'warm') {
    score += 10;
  }
  if (answers.character === 'modern' && (meta.accent === 'plum' || meta.accent === 'subtle')) {
    score += 10;
  }
  if (answers.character === 'minimal' && meta.accent === 'none') {
    score += 5;
  }

  if (answers.gender === 'female' && (meta.mood === 'cream' || meta.accent === 'warm')) {
    score += 5;
  }

  return score;
};

export const scoreParteTemplates = (
  answers: ParteWizardAnswers,
  limit = 10
): ParteTemplate[] => {
  const filtered = parteTemplates.filter((template) => {
    const meta = getTemplateMeta(template.id);
    return meta.hasPhoto === answers.hasPhoto;
  });

  const ranked = filtered
    .map((template, index) => ({
      template,
      score: scoreTemplate(template, answers),
      index,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.index - b.index;
    });

  return ranked.slice(0, limit).map((item) => item.template);
};
