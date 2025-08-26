import React from "react";
import "../style/Pagination.css";
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageRange = 5;

    if (totalPages <= 1) {
        return null;
    }

    let startPage = Math.max(0, currentPage - Math.floor(pageRange / 2));
    let endPage = Math.min(totalPages - 1, startPage + pageRange - 1);

    if (endPage - startPage < pageRange - 1) {
        startPage = Math.max(0, endPage - pageRange + 1);
    }
    
    const pages = [...Array(endPage - startPage + 1).keys()].map(i => i + startPage);

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
                {/* Tlačítko na úplně první stránku */}
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(0)}
                        disabled={currentPage === 0}
                    >
                        &laquo;
                    </button>
                </li>
                {/* Tlačítko na předchozí stránku */}
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        Předchozí
                    </button>
                </li>
                {/* Dynamicky generované tlačítka s čísly stránek */}
                {pages.map(page => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(page)}
                        >
                            {page + 1}
                        </button>
                    </li>
                ))}
                {/* Tlačítko na další stránku */}
                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        Další
                    </button>
                </li>
                {/* Tlačítko na úplně poslední stránku */}
                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(totalPages - 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
