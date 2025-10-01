import Link from 'next/link';
import React from 'react';

import Button from '@/components/_shared/Button';
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
    <div className={cn('flex w-full flex-col gap-7', className)}>
      <h2>{title}</h2>
      <p className='mb-3 text-lg whitespace-pre-line'>{description}</p>
      <Link href={`/${link}`}>
        <Button
          size='large'
          buttonText={buttonText}
        />
      </Link>
    </div>
  );
};

export default ContentBox;
