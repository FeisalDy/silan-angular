export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
}

interface ApiMeta {
  current_page: number;
  limit: number;
  total: number;
  total_pages: number;
}
