import Link from 'next/link';
import React from 'react';

import { PobockaPost } from '@/utils/wordpress-types';

interface BranchLinksProps {
  title: string;
  branches: PobockaPost[];
  filterNonstop?: boolean;
  maxWidth?: string;
}

export const BranchLinks = ({ title, branches, filterNonstop = false, maxWidth }: BranchLinksProps) => {
  const filteredBranches = filterNonstop
    ? branches.filter((pobocka) => pobocka.pobockyACF?.openSwitcher === true)
    : branches;

  return (
    <div className='flex flex-col'>
      <span
        className='font-heading text-white-smoke mb-5.5 text-lg text-balance'
        style={maxWidth ? { maxWidth } : undefined}
      >
        {title}
      </span>
      <div className='flex flex-col gap-4'>
        {filteredBranches.map((pobocka) => (
          <Link
            key={pobocka.id}
            href={`/${pobocka.slug}`}
            className='font-text text-base text-white transition-all duration-300 hover:opacity-70'
          >
            {pobocka.pobockyACF?.city && (
              <span className='font-bold-cta mr-1 text-base text-white'>{pobocka.pobockyACF.city}</span>
            )}
            {pobocka.title}
          </Link>
        ))}
      </div>
    </div>
  );
};
