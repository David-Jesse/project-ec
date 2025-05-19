import Link from "next/link";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  searchParams?: Record<string, string>

}

export default function PaginationBar({
  currentPage,
  totalPages,
  searchParams = {},
}: PaginationBarProps) {
  const renderPageLink = (pageNumber: number, label?: string) => {
    const newParams = {...searchParams, page: pageNumber.toString()};
    

    const queryString = Object.entries(newParams).map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`).join('&');

    const isCurrentPage = pageNumber === currentPage;

    return (
      <Link
        href={`?${queryString}`}
        className={`join-item btn ${
          isCurrentPage ? "btn-active pointer-events-none" : ""
        }`}
      >
        {label || pageNumber}
      </Link>
    )
  }

  return (
    <div className="join">
      {currentPage > 1 && renderPageLink(1, "«")}
      {currentPage > 1 && renderPageLink(currentPage - 1, "‹")}

      {/* Shows the current page and neigbors */}

      {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
        let pageNumber;
        
        if (totalPages <= 5) {
          pageNumber = 1 + i;
        } else if (currentPage >= totalPages - 2) {
          pageNumber = totalPages - 4 + i;
        } else {
          pageNumber = currentPage - 2 + i;
        }

        if (pageNumber > 0 && pageNumber <= totalPages) {
          return (
            <div key={pageNumber}>
              {renderPageLink(pageNumber)}
            </div>
          )
          
        }
        return null;
      })}

      {currentPage < totalPages && renderPageLink(currentPage + 1, "›")}
      {currentPage < totalPages && renderPageLink(totalPages, "»")}
    </div>
  )
}