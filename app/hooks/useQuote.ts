import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  fetchQuoteSummary,
  updateQuoteCurrency,
  acceptQuote,
} from '../lib/api';

import { ApiErrorResponse, isAcceptQuoteExpiredError } from '../utils/errors';
import { PaymentErrorCode, QUOTE_STALE_TIME } from '../lib/constants';
import { ApiError } from '../utils/api-error';

export const QUOTE_QUERY_KEY = (uuid: string) => ['quote', uuid];

/**
 * Hook to fetch quote summary data
 */
export function useQuoteSummary(uuid: string) {
  return useQuery({
    queryKey: QUOTE_QUERY_KEY(uuid),
    queryFn: () => fetchQuoteSummary(uuid),
    enabled: Boolean(uuid),
    staleTime: QUOTE_STALE_TIME,
  });
}

/**
 * Hook to update quote currency
 */
export function useUpdateQuoteCurrency(uuid: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (currency: string) => updateQuoteCurrency(uuid, currency),
    onSuccess: (data) => {
      // Update the cache with the new quote data
      queryClient.setQueryData(QUOTE_QUERY_KEY(uuid), data);
    },
    onError: (error: ApiError) => {
      try {
        const errorData = error.data as ApiErrorResponse;
        if (errorData?.code === PaymentErrorCode.QUOTE_EXPIRED_UPDATE) {
          router.replace(`/payin/${uuid}/expired`);
        }
      } catch {
        // Ignore errors
      }
    },
  });
}

/**
 * Hook to accept quote
 */
export function useAcceptQuote(uuid: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => acceptQuote(uuid),
    onSuccess: (data) => {
      // Update the cache with the accepted quote data
      queryClient.setQueryData(QUOTE_QUERY_KEY(uuid), data);
    },
    onError: (error: ApiError) => {
      // Check if the error is due to expired payment
      if (isAcceptQuoteExpiredError(error)) {
        router.replace(`/payin/${uuid}/expired`);
      }
    },
  });
}
