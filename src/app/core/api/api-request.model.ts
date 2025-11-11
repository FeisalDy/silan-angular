export interface BaseApiRequest {}

export type ApiRequest<T> = {
  lang?: string | null | undefined;
  page?: string | number | null | undefined;
  limit?: string | number | null | undefined;
} & T;
