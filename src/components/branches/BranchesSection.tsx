import { FormattedText } from '@/components/_shared/FormattedText';
import BranchCardClient from '@/components/branches/BranchCardClient';
import { cn } from '@/lib/utils';
import { filterAllBranches, filterShowroomBranches, filterWeekendBranches, sortBranches } from '@/utils/branch-filters';
import type { PobockaPost } from '@/utils/wordpress-types';

type FilterType = 'all' | 'showroom' | 'weekend';

interface BranchesSectionProps {
  branches: PobockaPost[];
  title?: string;
  filterType?: FilterType;
  className?: string;
}

const FILTER_MAP = {
  all: filterAllBranches,
  showroom: filterShowroomBranches,
  weekend: filterWeekendBranches,
} as const;

const BranchesSection = ({ branches, title, filterType = 'all', className }: Readonly<BranchesSectionProps>) => {
  const filterFunction = FILTER_MAP[filterType];
  const filteredBranches = sortBranches(branches.filter((branch) => filterFunction(branch)));

  if (filteredBranches.length === 0) return null;

  return (
    <section className={cn('section-container', className)}>
      <div className='max-w-container mx-auto'>
        {title && (
          <FormattedText
            text={title}
            as='h2'
            className='mb-12.5'
          />
        )}

        <div className='grid grid-cols-[repeat(auto-fill,minmax(15.75rem,15.75rem))] gap-x-7.5 gap-y-12.5 max-lg:justify-center lg:gap-7.5'>
          {filteredBranches.map((branch, index) => (
            <BranchCardClient
              key={branch.id}
              branch={branch}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchesSection;
