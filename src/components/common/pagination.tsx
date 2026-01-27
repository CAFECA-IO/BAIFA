import { ChevronLeft, ChevronRight } from 'lucide-react';

export enum PaginationType {
  NUMBER_WITH_SLASH = 'NUMBER_WITH_SLASH',
  TEXT = 'TEXT',
}

interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  type: PaginationType;
}

const Pagination = ({ currentPage, totalPages, onPageChange, type }: IPaginationProps) => {
  const leftDisabled = currentPage === 1 || totalPages === 0;
  const rightDisabled = currentPage === totalPages || totalPages === 0;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const numberStyle = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handlePreviousPage}
        disabled={leftDisabled}
        className="rounded p-1 text-gray-300 enabled:hover:bg-gray-50 enabled:hover:text-gray-900 disabled:opacity-50"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="font-medium text-gray-900">
        {currentPage} / {totalPages}
      </span>
      <button
        type="button"
        onClick={handleNextPage}
        disabled={rightDisabled}
        className="rounded p-1 text-gray-400 enabled:hover:bg-gray-50 enabled:hover:text-gray-900 disabled:opacity-50"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );

  const textStyle = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handlePreviousPage}
        disabled={leftDisabled}
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 enabled:hover:bg-gray-50 disabled:opacity-50"
      >
        上一頁
      </button>
      <div className="flex items-center gap-1 px-2 text-sm">
        第 <span className="font-bold text-gray-900">{currentPage}</span> 頁，共 {totalPages} 頁
      </div>
      <button
        type="button"
        onClick={handleNextPage}
        disabled={rightDisabled}
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 enabled:hover:bg-gray-50 disabled:opacity-50"
      >
        下一頁
      </button>
    </div>
  );

  return type === PaginationType.NUMBER_WITH_SLASH ? numberStyle : textStyle;
};

export default Pagination;
