import Link from 'next/link';

import Button from '@/components/_shared/Button';
import type { AnnouncementButton } from '@/utils/wordpress-types';

interface BranchClosureAnnouncementProps {
  closeAnnouncement?: string;
  dateCloseFrom?: string;
  dateCloseTo?: string;
  announcementButton?: AnnouncementButton;
}

export const BranchClosureAnnouncement = ({
  closeAnnouncement,
  dateCloseFrom,
  dateCloseTo,
  announcementButton,
}: BranchClosureAnnouncementProps) => {
  if (!closeAnnouncement && !dateCloseFrom && !dateCloseTo) return null;

  return (
    <div className='bg-primary space-y-5 p-4 md:p-8'>
      {closeAnnouncement && (
        <div
          className='inner-text-white dynamic-content space-y-2.5 md:space-y-5'
          dangerouslySetInnerHTML={{ __html: closeAnnouncement }}
        />
      )}

      {announcementButton?.url && announcementButton?.title && (
        <Link
          href={announcementButton.url}
          target={announcementButton.target || '_self'}
        >
          <Button
            buttonText={announcementButton.title}
            variant='white'
          />
        </Link>
      )}
    </div>
  );
};
