import { FormattedText } from '@/components/_shared/FormattedText';

interface BranchHeaderProps {
  city: string;
  branchTitle: string;
}

export const BranchHeader = ({ city, branchTitle }: BranchHeaderProps) => {
  return (
    <h1 className='flex flex-col'>
      <FormattedText
        text={city}
        as='span'
        className='font-heading text-primary text-2xl leading-[150%]'
      />
      <FormattedText
        text={branchTitle}
        as='span'
        className='font-heading text-primary text-2xl leading-[150%]'
      />
    </h1>
  );
};
