import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';
import ArrowRight from '@/components/icons/ArrowRight';
import type { PostupPost } from '@/utils/wordpress-types';

interface FaqItemProps {
  postup: PostupPost;
  buttonText: string;
}

export const FaqItem = ({ postup, buttonText }: FaqItemProps) => {
  return (
    <Link
      href={`/${postup.slug}`}
      className='bg-primary relative flex min-h-50 flex-col p-6 md:px-12 md:py-8'
    >
      <FormattedText
        text={postup.title}
        as='h2'
        className='font-heading pr-4 text-xl text-white md:text-2xl'
      />
      <div className='absolute right-12 bottom-6 text-lg'>
        <div className='text-white-smoke flex items-center gap-3'>
          <span className='text-white-smoke text-lg'>{buttonText}</span>
          <ArrowRight className='size-5 shrink-0' />
        </div>
      </div>
    </Link>
  );
};
