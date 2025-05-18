import Link from "next/link";
import { JSX } from "react";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
}

const PaginationBar = ({ currentPage, totalPages }: PaginationBarProps) => {
  const maxPage = Math.min(totalPages, Math.max(currentPage + 4, 6));
  const minPage = Math.max(1, Math.min(currentPage - 5, maxPage - 9));

  const numberedPageItems: JSX.Element[] = [];

  for (let page = minPage; page <= maxPage; page++) {
    numberedPageItems.push(
      <Link
        href={`?page=${page}`}
        key={page}
        className={`join-item btn ${currentPage === page ? "btn-active pointer-events-none" : ""}`}
      >
        {page}
      </Link>
    );
  }
  return (
    <>
      <div className="join hidden sm:block">{numberedPageItems}</div>
      <div className="join block sm:hidden">
        {currentPage > 1 && (
          <Link
            href={`?page=${currentPage - 1}`}
            className="btn join-item"
            aria-label="Previous page"
          >
            <span aria-hidden="true">{"<"}</span>
          </Link>
        )}
        <button className="btn join-item pointer-events-none">
          page {currentPage}
        </button>
        {currentPage < totalPages && (
          <Link
            href={`?page=${currentPage + 1}`}
            className="btn join-item"
            aria-label="Next page"
          >
            <span aria-hidden="true">{">"}</span>
          </Link>
        )}
      </div>
    </>
  );
};

export default PaginationBar;
