import Pagination from '@/components/_shared/Pagination';
import { REFERENCES_QUERY_PARAMS } from '@/constants/references';

interface ReferencesPaginationProps {
  totalPages: number;
  currentPage: number;
}

const ReferencesPagination = ({ totalPages, currentPage }: ReferencesPaginationProps) => {
  return (
    <Pagination
      totalPages={totalPages}
      currentPage={currentPage}
      pageParam={REFERENCES_QUERY_PARAMS.PAGE}
    />
  );
};

export default ReferencesPagination;
