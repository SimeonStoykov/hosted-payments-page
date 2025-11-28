import { PaymentErrorCode } from '../lib/constants';

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

export interface ApiError extends Error {
  message: string;
}

export function isAcceptQuoteExpiredError(error: ApiError): boolean {
  try {
    const message = error?.message || '';
    const jsonMatch = message.match(/\{.*\}/);
    if (jsonMatch) {
      const errorData: AcceptQuoteErrorResponse = JSON.parse(jsonMatch[0]);
      // Check for MER-PAY-2004 in errorList
      return errorData.errorList.some(
        (err) => err.code === PaymentErrorCode.QUOTE_EXPIRED_ACCEPT,
      );
    }
  } catch {
    // Ignore parsing errors
  }
  return false;
}
