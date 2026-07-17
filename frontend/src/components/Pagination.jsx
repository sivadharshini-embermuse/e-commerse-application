import {
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
    } from "lucide-react";

    const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    }) => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
    const visiblePages = [];

    if (currentPage > 1) {
        visiblePages.push(currentPage - 1);
    }

    visiblePages.push(currentPage);

    if (currentPage < totalPages) {
        visiblePages.push(currentPage + 1);
    }

    return visiblePages;
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-10">

        <div className="flex items-center gap-2 flex-wrap">

            {/* First */}
            <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-3xl border disabled:opacity-40 hover:bg-slate-100"
            >
            <ChevronsLeft size={20} />
            </button>

            {/* Prev */}
            <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-3xl border disabled:opacity-40 hover:bg-slate-100"
            >
            <ChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            {getVisiblePages().map((page) => (
            <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-3xl border transition
                ${
                    currentPage === page
                    ? "w-10 h-10 rounded-full bg-blue-600 text-white border-[3px] border-blue-300 shadow"
                    : "hover:bg-slate-100"
                }`}
            >
                {page}
            </button>
            ))}

            {/* Next */}
            <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-3xl border disabled:opacity-40 hover:bg-slate-100"
            >
            <ChevronRight size={20} />
            </button>

            {/* Last */}
            <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-3xl border disabled:opacity-40 hover:bg-slate-100"
            >
            <ChevronsRight size={20} />
            </button>

        </div>

        <p className="text-sm text-gray-600">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
        </p>

        </div>
    );
};

export default Pagination;