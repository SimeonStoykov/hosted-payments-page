import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  fetchQuoteSummary,
  updateQuoteCurrency,
  acceptQuote,
} from '../lib/api';

import { ApiErrorResponse, isAcceptQuoteExpiredError } from '../utils/errors';
import { PaymentErrorCode, QUOTE_STALE_TIME } from '../lib/constants';
import { getExpiredPageUrl, getPayPageUrl } from '../utils/routes';
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
      const errorData = error.data as ApiErrorResponse;

      if (errorData?.code === PaymentErrorCode.QUOTE_EXPIRED_UPDATE) {
        router.replace(getExpiredPageUrl(uuid));
      } else if (errorData?.code === PaymentErrorCode.QUOTE_ALREADY_ACCEPTED) {
        queryClient.resetQueries({ queryKey: QUOTE_QUERY_KEY(uuid) });
        toast.info('Quote already accepted. Redirecting to payment...');
        router.replace(getPayPageUrl(uuid));
      } else {
        // Show toast for non-expired errors
        toast.error(
          errorData?.message || 'Failed to update currency. Please try again.',
        );
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
      const errorData = error.data as ApiErrorResponse;

      if (isAcceptQuoteExpiredError(error)) {
        router.replace(getExpiredPageUrl(uuid));
      } else if (errorData.code === PaymentErrorCode.QUOTE_ALREADY_ACCEPTED) {
        queryClient.resetQueries({ queryKey: QUOTE_QUERY_KEY(uuid) });
        toast.info('Quote already accepted. Redirecting to payment...');
        router.replace(getPayPageUrl(uuid));
      } else {
        toast.error(
          errorData.message || 'Failed to accept quote. Please try again.',
        );
      }
    },
  });
}
