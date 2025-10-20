import Link from 'next/link';

import Facebook from '@/components/icons/Facebook';
import Instagram from '@/components/icons/Instagram';
import { FacebookUrl, InstagramUrl } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SocialsProps {
  className?: string;
}

const Socials = ({ className }: SocialsProps) => {
  return (
    <div className={cn('2lg:flex-col 2lg:top-16 absolute top-8 flex gap-2 lg:left-44', className)}>
      <Link
        href={FacebookUrl}
        target='_blank'
        className='transition-all duration-300 hover:opacity-70'
      >
        <Facebook className='text-white-smoke bg-primary size-8 p-2' />
      </Link>
      <Link
        href={InstagramUrl}
        target='_blank'
        className='transition-all duration-300 hover:opacity-70'
      >
        <Instagram className='text-white-smoke bg-primary size-8 p-2' />
      </Link>
    </div>
  );
};

export default Socials;
