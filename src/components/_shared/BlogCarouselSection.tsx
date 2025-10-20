'use client';

import Link from 'next/link';

import Button from '@/components/_shared/Button';
import GenericCarouselSection from '@/components/_shared/GenericCarouselSection';

interface BlogCarouselItemData {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

/**
 * NOTE: This data should be fetched from WordPress API or passed as props
 * Currently using hardcoded data as placeholder
 */
const BLOG_CAROUSEL_DATA: BlogCarouselItemData[] = [
  {
    id: 1,
    title: 'Rozloučení s A. Švehlíkem',
    description:
      'Připomeňte si smuteční obřad věnovaný herci a umělci národního divadla, který se uskutečnil na prknech, která znamenají svět.',
    image: '/images/blog.webp',
    link: '#',
  },
  {
    id: 2,
    title: 'Rozloučení s Jurajem Jakubiskem',
    description:
      'Připomeňte si smuteční obřad věnovaný herci a umělci národního divadla, který se uskutečnil na prknech, která znamenají svět.',
    image: '/images/room.webp',
    link: '#',
  },
  {
    id: 3,
    title: 'Rozloučení s Jurajem Jakubiskem',
    description:
      'Připomeňte si smuteční obřad věnovaný herci a umělci národního divadla, který se uskutečnil na prknech, která znamenají svět.',
    image: '/images/rose.webp',
    link: '#',
  },
];

const BlogCarouselSection = () => {
  return (
    <GenericCarouselSection
      data={BLOG_CAROUSEL_DATA}
      sectionClassName='pb-14'
      carouselMaxWidth='section-container max-lg:max-w-[28.375rem]'
      articleClassName='flex flex-col-reverse items-center lg:grid lg:grid-cols-2'
      renderContent={(item, t) => (
        <div className='mx-auto flex flex-1 flex-col space-y-2 px-4 py-8 max-md:h-full max-md:justify-between lg:max-w-[28.375rem] lg:px-10'>
          <div className='flex flex-col space-y-2'>
            <h3 className='text-white-smoke mb-6 text-2xl'>{item.title}</h3>
            <p className='text-tertiary text-lg'>{item.description}</p>
          </div>
          <Link href={item.link}>
            <Button
              buttonText={t('find-out-more')}
              className='-ml-8'
            />
          </Link>
        </div>
      )}
    />
  );
};

export default BlogCarouselSection;
