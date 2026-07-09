export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
};

export type SortDirection = 'asc' | 'desc';

export type SortParams = {
  field: string;
  direction: SortDirection;
};

export type FilterParams = Record<string, string | number | boolean | string[] | undefined>;

export type DateRange = {
  from: string;
  to: string;
};

export type Status = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'ARCHIVED';

export type Visibility = 'PUBLIC' | 'PRIVATE' | 'ADMIN_ONLY';
