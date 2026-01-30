'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

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
  const firstDisabled = currentPage === 1 || totalPages === 0;
  const previousDisabled = currentPage === 1 || totalPages === 0;
  const nextDisabled = currentPage === totalPages || totalPages === 0;
  const lastDisabled = currentPage === totalPages || totalPages === 0;

  const [inputPage, setInputPage] = useState<number>(currentPage);

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

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  // Info: (20260130 - Julian) 限制輸入範圍
  const disabledGo = inputPage < 1 || inputPage > totalPages;
  const handleInputPageChange = () => {
    if (inputPage >= 1 && inputPage <= totalPages) {
      onPageChange(inputPage);
    }
  };

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const inputPart = (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={inputPage}
        onChange={(e) => setInputPage(Number(e.target.value))}
        min={1}
        max={totalPages}
        className="w-24 rounded-lg border border-gray-200 bg-transparent px-2 py-1.5 text-center text-sm font-medium text-gray-700 outline-none"
      />
      <button
        type="button"
        onClick={handleInputPageChange}
        disabled={disabledGo}
        className="rounded-lg bg-purple-100 px-3 py-1.5 text-sm font-medium text-gray-700 enabled:hover:bg-purple-200 disabled:bg-gray-200"
      >
        Go
      </button>
    </div>
  );

  const numberStyle = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleFirstPage}
        disabled={firstDisabled}
        className="rounded p-1 text-gray-600 enabled:hover:text-[#5841D8] disabled:text-gray-300"
      >
        <ChevronsLeft size={18} />
      </button>
      <button
        type="button"
        onClick={handlePreviousPage}
        disabled={previousDisabled}
        className="rounded p-1 text-gray-600 enabled:hover:text-[#5841D8] disabled:text-gray-300"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="font-medium text-gray-900">
        {currentPage} / {totalPages}
      </span>
      <button
        type="button"
        onClick={handleNextPage}
        disabled={nextDisabled}
        className="rounded p-1 text-gray-600 enabled:hover:text-[#5841D8] disabled:text-gray-300"
      >
        <ChevronRight size={18} />
      </button>
      <button
        type="button"
        onClick={handleLastPage}
        disabled={lastDisabled}
        className="rounded p-1 text-gray-600 enabled:hover:text-[#5841D8] disabled:text-gray-300"
      >
        <ChevronsRight size={18} />
      </button>
    </div>
  );

  const textStyle = (
    <div className="flex items-center gap-2">
      {inputPart}
      <button
        type="button"
        onClick={handlePreviousPage}
        disabled={previousDisabled}
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
        disabled={nextDisabled}
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 enabled:hover:bg-gray-50 disabled:opacity-50"
      >
        下一頁
      </button>
    </div>
  );

  return type === PaginationType.NUMBER_WITH_SLASH ? numberStyle : textStyle;
};

export default Pagination;
