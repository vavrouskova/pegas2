import Filter from '@/components/_shared/Filter';
import { BLOG_QUERY_PARAMS, UNCATEGORIZED_CATEGORY_ID } from '@/constants/blog';
import { BlogCategory } from '@/utils/wordpress-types';

interface BlogFilterProps {
  categories: BlogCategory[];
  activeCategorySlug?: string;
}

const BlogFilter = ({ categories, activeCategorySlug }: BlogFilterProps) => {
  return (
    <Filter
      categories={categories}
      config={{
        categoryParam: BLOG_QUERY_PARAMS.CATEGORY,
        searchParam: BLOG_QUERY_PARAMS.SEARCH,
        pageParam: BLOG_QUERY_PARAMS.PAGE,
        excludeCategoryIds: [UNCATEGORIZED_CATEGORY_ID],
        useUrlRouting: true,
        basePath: '/blog',
        activeCategorySlug,
      }}
    />
  );
};

export default BlogFilter;
