import { PaymentErrorCode } from '../lib/constants';
import { ApiError } from './api-error';

export interface ApiErrorResponse {
  requestId: string;
  code: string;
  parameter: string;
  message: string;
}

export interface AcceptQuoteErrorResponse {
  requestId: string;
  errorList: ApiErrorResponse[];
}

export function isAcceptQuoteExpiredError(error: ApiError): boolean {
  try {
    const errorData = error.data as AcceptQuoteErrorResponse;
    return errorData?.errorList?.some(
      (err) => err.code === PaymentErrorCode.QUOTE_EXPIRED_ACCEPT,
    );
  } catch {
    return false;
  }
}
