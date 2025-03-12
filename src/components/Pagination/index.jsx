import React from "react";
import "./styles.scss";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>
                ◀ Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    className={currentPage === index + 1 ? "active" : ""}
                    onClick={() => onPageChange(index + 1)}
                >
                    {index + 1}
                </button>
            ))}
            <button onClick={handleNext} disabled={currentPage === totalPages}>
                Next ▶
            </button>
        </div>
    );
};

export default Pagination;
