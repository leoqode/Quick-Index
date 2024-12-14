import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    
    pages.push(1);
    
    if (totalPages > 2) {
      const startPage = Math.max(2, Math.min(currentPage - 1, totalPages - 3));
      const endPage = Math.min(totalPages - 1, Math.max(currentPage + 1, 3));
      
      if (startPage > 2) pages.push('...');
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) pages.push('...');
    }
    
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="
          p-2 
          rounded-lg 
          bg-gray-800/50 
          hover:bg-gray-700/50 
          disabled:opacity-50 
          disabled:cursor-not-allowed 
          transition-all 
          group
        "
      >
        <ChevronLeft 
          className="
            w-5 h-5 
            text-cyan-400 
            group-disabled:text-gray-500 
            transition-colors
          " 
        />
        <span className="sr-only">Previous Page</span>
      </button>

      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span 
              key={`ellipsis-${index}`} 
              className="text-gray-400 px-2"
              aria-hidden="true"
            >
              ...
            </span>
          );
        }
        
        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`
              w-10 h-10 
              rounded-lg 
              transition-all 
              ${currentPage === page 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'}
            `}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="
          p-2 
          rounded-lg 
          bg-gray-800/50 
          hover:bg-gray-700/50 
          disabled:opacity-50 
          disabled:cursor-not-allowed 
          transition-all 
          group
        "
      >
        <ChevronRight 
          className="
            w-5 h-5 
            text-cyan-400 
            group-disabled:text-gray-500 
            transition-colors
          " 
        />
        <span className="sr-only">Next Page</span>
      </button>
    </div>
  );
};

export default Pagination;
