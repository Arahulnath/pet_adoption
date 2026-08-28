import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

function buildPageList(current, total) {
  const pages = [];
  const windowSize = 1;
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - current) <= windowSize) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return pages;
}

export default function Pagination({ page, totalPages, onPageChange, totalItems, pageSize }) {
  const pages = useMemo(() => buildPageList(page, Math.max(totalPages, 1)), [page, totalPages]);

  if (totalPages <= 1) return null;

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <nav className="pagination" aria-label="Pagination">
      {totalItems != null && (
        <span className="pagination__summary">
          Showing {rangeStart}–{rangeEnd} of {totalItems}
        </span>
      )}
      <div className="pagination__controls">
        <button
          className="pagination__btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`ellipsis-${idx}`} className="pagination__ellipsis">
              …
            </span>
          ) : (
            <button
              key={p}
              className={`pagination__btn ${p === page ? "pagination__btn--active" : ""}`}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
        <button
          className="pagination__btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
