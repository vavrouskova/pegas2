import { FormattedText } from '@/components/_shared/FormattedText';

interface BranchOpeningHoursProps {
  workingDays?: string;
  weekendDays?: string;
}

export const BranchOpeningHours = ({ workingDays, weekendDays }: BranchOpeningHoursProps) => {
  if (!workingDays && !weekendDays) return null;

  return (
    <div>
      {workingDays && (
        <FormattedText
          text={workingDays}
          as='p'
        />
      )}
      {weekendDays && (
        <FormattedText
          text={weekendDays}
          as='p'
        />
      )}
    </div>
  );
};
