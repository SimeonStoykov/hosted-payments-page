import { ApiErrorResponse, AcceptQuoteErrorResponse } from './errors';

export type ApiErrorData =
  | ApiErrorResponse
  | AcceptQuoteErrorResponse
  | { message: string };

export class ApiError extends Error {
  constructor(public data: ApiErrorData) {
    super('API Error');
    this.name = 'ApiError';
  }
}
