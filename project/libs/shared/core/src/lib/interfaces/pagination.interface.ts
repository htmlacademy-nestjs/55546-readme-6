
export interface PaginationResult<T> {
  entities: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemPerPage: number;
}
