import { getTranslations } from 'next-intl/server';

import Filter from '@/components/_shared/Filter';
import { REFERENCES_QUERY_PARAMS } from '@/constants/references';
import { ReferenceCategory } from '@/utils/wordpress-types';

interface ReferencesFilterProps {
  categories: ReferenceCategory[];
  activeCategorySlug?: string;
}

const ReferencesFilter = async ({ categories, activeCategorySlug }: ReferencesFilterProps) => {
  const t = await getTranslations('routes');
  return (
    <Filter
      categories={categories}
      config={{
        categoryParam: REFERENCES_QUERY_PARAMS.CATEGORY,
        searchParam: REFERENCES_QUERY_PARAMS.SEARCH,
        pageParam: REFERENCES_QUERY_PARAMS.PAGE,
        useUrlRouting: true,
        basePath: `/${t('references')}`,
        activeCategorySlug,
      }}
    />
  );
};

export default ReferencesFilter;
