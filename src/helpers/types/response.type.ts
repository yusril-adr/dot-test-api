import { PaginationMeta } from './pagination-meta.type';

export type Response<Data = any> = {
  statusCode: number;
  data?: Data | undefined | null;
  error?: Error;
  message: string;
};

export type ResponsePagination<T> = Response<T> & PaginationMeta;
