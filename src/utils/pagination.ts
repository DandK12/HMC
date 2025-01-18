export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export function getPaginationParams(params: PaginationParams = {}): Required<PaginationParams> {
  return {
    page: Math.max(1, params.page || 1),
    limit: Math.min(100, Math.max(1, params.limit || 20)),
    sortBy: params.sortBy || 'created_at',
    sortOrder: params.sortOrder || 'desc',
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  params: Required<PaginationParams>
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / params.limit);
  
  return {
    data,
    metadata: {
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
      hasMore: params.page < totalPages,
    },
  };
}