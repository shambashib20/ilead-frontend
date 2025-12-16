import { useState } from "react";

export function usePagination<T>(data: T[], itemsPerPage = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return {
    page,
    setPage,
    totalPages,
    paginatedData,
  };
}
