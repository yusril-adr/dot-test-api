import { PaginationMeta } from '@helpers/types/pagination-meta.type';
import { Response, ResponsePagination } from '@helpers/types/response.type';

export type WrapperData<T> = {
  data: T | null;
  error: null | Error;
};
export const data = <T>(data: T): WrapperData<T> => ({
  error: null,
  data,
});

export type WrapperPaginationData<T> = WrapperData<T> & PaginationMeta;
export const paginationData = <T>(data: T, meta: PaginationMeta) => ({
  error: null,
  data,
  meta,
});

export type WrapperError = {
  data: null;
  error: Error;
};
export const error = (error: Error): WrapperError => ({
  error,
  data: null,
});

export type WrapperResponseParams<T> = Omit<Response<T>, 'statusCode'> & {
  statusCode?: number;
};
export const response = <T>(params: WrapperResponseParams<T>): Response<T> => {
  const { statusCode = 200, data = undefined, message } = params;
  return {
    statusCode,
    data,
    message,
  };
};

export type WrapperPaginationResponseParams<T> = Omit<
  ResponsePagination<T>,
  'statusCode'
> & {
  statusCode?: number;
};
export const paginationResponse = <T>(
  params: WrapperPaginationResponseParams<T>,
): ResponsePagination<T> => {
  const { statusCode = 200, data = null, meta, message } = params;
  return {
    statusCode,
    data,
    meta,
    message,
  };
};
