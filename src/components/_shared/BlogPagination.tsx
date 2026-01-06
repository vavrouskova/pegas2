import Pagination from '@/components/_shared/Pagination';
import { BLOG_QUERY_PARAMS } from '@/constants/blog';

interface BlogPaginationProps {
  totalPages: number;
  currentPage: number;
}

const BlogPagination = ({ totalPages, currentPage }: BlogPaginationProps) => {
  return (
    <Pagination
      totalPages={totalPages}
      currentPage={currentPage}
      pageParam={BLOG_QUERY_PARAMS.PAGE}
    />
  );
};

export default BlogPagination;
