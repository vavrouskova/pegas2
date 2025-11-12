import { BLOG_QUERY_PARAMS, UNCATEGORIZED_CATEGORY_ID } from '@/constants/blog';
import { BlogCategory } from '@/utils/wordpress-types';

import Filter from './Filter';

interface BlogFilterProps {
  categories: BlogCategory[];
}

const BlogFilter = ({ categories }: BlogFilterProps) => {
  return (
    <Filter
      categories={categories}
      config={{
        categoryParam: BLOG_QUERY_PARAMS.CATEGORY,
        searchParam: BLOG_QUERY_PARAMS.SEARCH,
        pageParam: BLOG_QUERY_PARAMS.PAGE,
        excludeCategoryIds: [UNCATEGORIZED_CATEGORY_ID],
      }}
    />
  );
};

export default BlogFilter;
