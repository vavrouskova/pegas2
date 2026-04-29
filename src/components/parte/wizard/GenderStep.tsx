'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import StepHeader from '@/components/parte/wizard/StepHeader';
import { cn } from '@/lib/utils';
import { ParteFamilyRole, ParteGender } from '@/types/parte';

const GENDERS: { value: ParteGender; key: 'male' | 'female' }[] = [
  { value: 'male', key: 'male' },
  { value: 'female', key: 'female' },
];

const MALE_ROLES: ParteFamilyRole[] = [
  'father',
  'husband',
  'son',
  'grandfather',
  'brother',
  'uncle',
  'friend-male',
];

const FEMALE_ROLES: ParteFamilyRole[] = [
  'mother',
  'wife',
  'daughter',
  'grandmother',
  'sister',
  'aunt',
  'friend-female',
];

/* eslint-disable no-unused-vars */
interface GenderStepProps {
  gender: ParteGender | undefined;
  familyRoles: ParteFamilyRole[];
  onGenderChange: (gender: ParteGender) => void;
  onFamilyRolesChange: (roles: ParteFamilyRole[]) => void;
}
/* eslint-enable no-unused-vars */

const GenderStep = ({
  gender,
  familyRoles,
  onGenderChange,
  onFamilyRolesChange,
}: GenderStepProps) => {
  const t = useTranslations('parte.wizard.steps.gender');

  const visibleRoles = gender === 'male' ? MALE_ROLES : gender === 'female' ? FEMALE_ROLES : null;

  const toggleRole = (role: ParteFamilyRole) => {
    if (familyRoles.includes(role)) {
      onFamilyRolesChange(familyRoles.filter((r) => r !== role));
    } else {
      onFamilyRolesChange([...familyRoles, role]);
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      <StepHeader title={t('title')} />

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        {GENDERS.map((option) => {
          const active = gender === option.value;
          return (
            <button
              key={option.value}
              type='button'
              onClick={() => onGenderChange(option.value)}
              className={cn(
                'text-primary flex h-32 items-center justify-center px-4 py-4 text-2xl transition',
                active ? 'bg-primary/[0.06]' : 'bg-white hover:bg-white-smoke'
              )}
            >
              {t(option.key)}
            </button>
          );
        })}
      </div>

      {visibleRoles && (
        <div className='flex flex-col gap-3'>
          <p className='text-primary/55 text-[11px] tracking-[0.1em] uppercase'>
            {t('roles-hint')}
          </p>
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'>
            {visibleRoles.map((role) => {
              const checked = familyRoles.includes(role);
              return (
                <button
                  key={role}
                  type='button'
                  onClick={() => toggleRole(role)}
                  className='text-primary hover:text-primary/80 flex h-10 items-center justify-start gap-2.5 text-[14px] transition'
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center transition',
                      checked ? 'bg-primary' : 'bg-white'
                    )}
                  >
                    {checked && <Check className='text-white-smoke h-3 w-3' />}
                  </span>
                  <span>{t(`roles.${role}`)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenderStep;
