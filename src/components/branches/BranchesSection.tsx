import { FormattedText } from '@/components/_shared/FormattedText';
import { filterAllBranches, filterShowroomBranches, filterWeekendBranches } from '@/utils/branch-filters';
import type { PobockaPost } from '@/utils/wordpress-types';

import BranchCardClient from '@/components/branches/BranchCardClient';

type FilterType = 'all' | 'showroom' | 'weekend';

interface BranchesSectionProps {
  branches: PobockaPost[];
  title?: string;
  filterType?: FilterType;
}

const FILTER_MAP = {
  all: filterAllBranches,
  showroom: filterShowroomBranches,
  weekend: filterWeekendBranches,
} as const;

const BranchesSection = ({ branches, title, filterType = 'all' }: Readonly<BranchesSectionProps>) => {
  const filterFn = FILTER_MAP[filterType];
  const filteredBranches = branches.filter(filterFn);

  if (filteredBranches.length === 0) return null;

  return (
    <section className='section-container'>
      <div className='max-w-container mx-auto'>
        {title && (
          <FormattedText
            text={title}
            as='h2'
            className='mb-12.5'
          />
        )}

        <div className='flex flex-wrap gap-x-7.5 gap-y-12.5 max-lg:justify-center lg:gap-7.5'>
          {filteredBranches.map((branch) => (
            <BranchCardClient
              key={branch.id}
              branch={branch}
              className='w-full max-w-[15.75rem] min-w-[15.75rem]'
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchesSection;
