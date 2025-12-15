import Filter from '@/components/_shared/Filter';
import { REFERENCES_QUERY_PARAMS } from '@/constants/references';
import { ReferenceCategory } from '@/utils/wordpress-types';

interface ReferencesFilterProps {
  categories: ReferenceCategory[];
}

const ReferencesFilter = ({ categories }: ReferencesFilterProps) => {
  return (
    <Filter
      categories={categories}
      config={{
        categoryParam: REFERENCES_QUERY_PARAMS.CATEGORY,
        searchParam: REFERENCES_QUERY_PARAMS.SEARCH,
        pageParam: REFERENCES_QUERY_PARAMS.PAGE,
      }}
    />
  );
};

export default ReferencesFilter;
