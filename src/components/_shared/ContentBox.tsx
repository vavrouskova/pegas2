import Link from 'next/link';
import React from 'react';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import { cn } from '@/lib/utils';

interface ContentBoxProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
  className?: string;
}

const ContentBox = ({ title, description, buttonText, link, className }: ContentBoxProps) => {
  return (
    <div className={cn('flex w-full flex-col gap-2.5', className)}>
      <FormattedText
        text={title}
        as='h2'
      />
      <FormattedText
        text={description}
        as='p'
        className='mb-10 text-lg'
      />
      <Link href={`/${link}`}>
        <Button buttonText={buttonText} />
      </Link>
    </div>
  );
};

export default ContentBox;
