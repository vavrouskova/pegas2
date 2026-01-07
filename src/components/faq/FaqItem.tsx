import Link from 'next/link';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import type { PostupPost } from '@/utils/wordpress-types';

interface FaqItemProps {
  postup: PostupPost;
  buttonText: string;
}

export const FaqItem = ({ postup, buttonText }: FaqItemProps) => {
  return (
    <Link
      href={`/${postup.slug}`}
      className='bg-primary relative flex min-h-50 flex-col p-6 md:p-8'
    >
      <FormattedText
        text={postup.title}
        as='h2'
        className='font-heading pr-4 text-xl text-white md:text-2xl'
      />
      <div className='absolute right-0 bottom-3.5'>
        <Button buttonText={buttonText} />
      </div>
    </Link>
  );
};
