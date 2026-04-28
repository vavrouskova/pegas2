import {
  ParteDraft,
  ParteFamilyRole,
  ParteGender,
  ParteTemplate,
  ParteWizardAnswers,
} from '@/types/parte';
import { buildDatesString, formatCzechDate } from '@/utils/parte/format-dates';

const genderVerb: Record<ParteGender, string> = {
  male: 'opustil',
  female: 'opustila',
};

const familyRoleNoun: Record<ParteFamilyRole, string> = {
  father: 'tatínek',
  husband: 'manžel',
  son: 'syn',
  grandfather: 'dědeček',
  brother: 'bratr',
  uncle: 'strýc',
  'friend-male': 'přítel',
  mother: 'maminka',
  wife: 'manželka',
  daughter: 'dcera',
  grandmother: 'babička',
  sister: 'sestra',
  aunt: 'teta',
  'friend-female': 'přítelkyně',
};

const joinRoles = (roles: ParteFamilyRole[]): string => {
  if (roles.length === 0) return '';
  const nouns = roles.map((role) => familyRoleNoun[role]);
  if (nouns.length === 1) return nouns[0];
  if (nouns.length === 2) return `${nouns[0]} a ${nouns[1]}`;
  return `${nouns.slice(0, -1).join(', ')} a ${nouns.at(-1)}`;
};

const buildIntroduction = (
  gender: ParteGender,
  roles: ParteFamilyRole[]
): string => {
  const verb = genderVerb[gender];
  const subject = joinRoles(roles);
  if (!subject) {
    return `S hlubokým zármutkem oznamujeme,\nže nás navždy ${verb}`;
  }
  return `S hlubokým zármutkem oznamujeme,\nže nás navždy ${verb} ${subject}`;
};

const buildFarewell = (
  place: string,
  dateIso: string,
  time: string
): string | null => {
  const date = formatCzechDate(dateIso);
  if (!place && !date && !time) return null;
  const parts: string[] = [];
  parts.push('Poslední rozloučení se uskuteční');
  const datePart = [date, time && `v ${time} hodin`].filter(Boolean).join(' ');
  if (datePart) parts.push(datePart);
  if (place) parts.push(`v ${place}.`);
  return parts.join('\n');
};

export const buildDraftFromWizard = (
  template: ParteTemplate,
  answers: ParteWizardAnswers
): ParteDraft => {
  const fullName = [answers.firstName, answers.lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');

  const datesString = buildDatesString(answers.birthDate, answers.deathDate);

  const introductionText = buildIntroduction(answers.gender, answers.familyRoles);

  const signatureText = answers.signature.trim() || 'S láskou vzpomíná rodina';

  let quoteText: string | null = null;
  if (answers.verseChoice === 'custom' && answers.verseText) {
    quoteText = answers.verseText.trim();
  } else if (
    (answers.verseChoice === 'religious' || answers.verseChoice === 'secular') &&
    answers.verseText
  ) {
    quoteText = answers.verseText.trim();
  } else if (answers.verseChoice === 'none') {
    quoteText = '';
  }

  const farewellText = buildFarewell(
    answers.ceremonyPlace.trim(),
    answers.ceremonyDate,
    answers.ceremonyTime.trim()
  );

  const texts: Record<string, string> = {};
  for (const slot of template.slots) {
    if (slot.type !== 'text') continue;
    switch (slot.id) {
      case 'introduction':
        texts[slot.id] = introductionText;
        break;
      case 'name':
        texts[slot.id] = fullName || slot.defaultText;
        break;
      case 'dates':
        texts[slot.id] = datesString || slot.defaultText;
        break;
      case 'quote':
        if (quoteText !== null) texts[slot.id] = quoteText;
        else texts[slot.id] = slot.defaultText;
        break;
      case 'farewell':
        texts[slot.id] = farewellText ?? slot.defaultText;
        break;
      case 'signature':
        texts[slot.id] = signatureText;
        break;
      default:
        texts[slot.id] = slot.defaultText;
    }
  }

  const photos: Record<string, string> = {};
  if (answers.hasPhoto && answers.photoDataUrl) {
    const photoSlot = template.slots.find((slot) => slot.type === 'photo');
    if (photoSlot) photos[photoSlot.id] = answers.photoDataUrl;
  }

  return {
    templateId: template.id,
    texts,
    photos,
    textStyles: {},
    version: 1,
  };
};
