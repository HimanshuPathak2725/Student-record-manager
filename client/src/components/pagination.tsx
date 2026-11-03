import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (endPage - startPage < maxPagesToShow - 3) {
        if (startPage === 2) {
          endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);
        } else if (endPage === totalPages - 1) {
          startPage = Math.max(2, endPage - (maxPagesToShow - 3));
        }
      }
      
      if (startPage > 2) {
        pageNumbers.push("...");
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="bg-zinc-900/60 px-4 py-3 flex items-center justify-between border-t border-zinc-800 text-xs font-sans text-zinc-400 rounded-b-lg">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-zinc-700 bg-zinc-950 text-zinc-300 rounded-md text-xs font-sans"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="border-zinc-700 bg-zinc-950 text-zinc-300 rounded-md text-xs font-sans"
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-zinc-400 font-sans">
            Displaying <span className="text-white font-mono font-bold">{startItem}</span> to{" "}
            <span className="text-white font-mono font-bold">{endItem}</span> of{" "}
            <span className="text-white font-mono font-bold">{totalItems}</span> records
          </p>
        </div>
        {totalPages > 0 && (
          <div>
            <nav className="inline-flex gap-1" aria-label="Pagination">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-white hover:text-black rounded-md"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              
              {getPageNumbers().map((page, index) => (
                typeof page === "number" ? (
                  <Button
                    key={index}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 p-0 text-xs font-mono rounded-md transition-colors ${
                      currentPage === page 
                        ? "bg-white text-zinc-950 font-bold border-white" 
                        : "border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    }`}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </Button>
                ) : (
                  <span
                    key={index}
                    className="inline-flex items-center justify-center h-8 w-8 text-zinc-600 font-mono text-xs"
                  >
                    {page}
                  </span>
                )
              ))}
              
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-white hover:text-black rounded-md"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
