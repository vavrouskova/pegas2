import React from 'react';

import ContentBox from '@/components/_shared/ContentBox';
import FeatherAnimation from '@/components/_shared/FeatherAnimation';
import FeatherStatic from '@/components/_shared/FeatherStatic';
import { cn } from '@/lib/utils';

interface ContentBoxSectionProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
  sectionClassName?: string;
  contentBoxClassName?: string;
  withFeathers?: boolean;
}

const ContentBoxSection = ({
  title,
  description,
  buttonText,
  link,
  sectionClassName,
  contentBoxClassName,
  withFeathers = false,
}: ContentBoxSectionProps) => {
  return (
    <section className={cn(withFeathers ? 'relative' : '', sectionClassName)}>
      <ContentBox
        title={title}
        description={description}
        buttonText={buttonText}
        link={link}
        className={cn('relative z-20 max-w-[42.6875rem] lg:mx-auto', contentBoxClassName)}
      />
      {withFeathers && (
        <>
          <FeatherAnimation />
          <FeatherStatic />
        </>
      )}
    </section>
  );
};

export default ContentBoxSection;
