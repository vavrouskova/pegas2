import GridCard from '@/components/_shared/GridCard';
import { formatFarewellDate } from '@/utils/helper';
import { ReferencePost } from '@/utils/wordpress-types';

interface ReferencesGridSectionProps {
  referencePosts: ReferencePost[];
}

const ReferencesGridSection = ({ referencePosts }: ReferencesGridSectionProps) => {
  if (!referencePosts || referencePosts.length === 0) {
    return null;
  }

  return (
    <div className='grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3'>
      {referencePosts.map((reference) => {
        const imageUrl = reference.referenceACF?.introImage?.node?.sourceUrl || '/images/placeholder.webp';
        const imageAlt = reference.referenceACF?.introImage?.node?.altText || reference.title;
        const farewellDate = formatFarewellDate(reference.referenceACF?.farewellDate);

        return (
          <GridCard
            key={reference.id}
            href={`/${reference.slug}`}
            imageUrl={imageUrl}
            imageAlt={imageAlt}
            title={reference.title}
          >
            {farewellDate && <p className='font-text text-sm'>{farewellDate}</p>}
          </GridCard>
        );
      })}
    </div>
  );
};

export default ReferencesGridSection;
