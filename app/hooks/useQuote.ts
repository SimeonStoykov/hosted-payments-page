import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  fetchQuoteSummary,
  updateQuoteCurrency,
  acceptQuote,
} from '../lib/api';

export const QUOTE_QUERY_KEY = (uuid: string) => ['quote', uuid];

interface ApiErrorResponse {
  requestId: string;
  code: string;
  parameter: string;
  message: string;
}

interface ApiError extends Error {
  message: string;
}

/**
 * Hook to fetch quote summary data
 */
export function useQuoteSummary(uuid: string) {
  return useQuery({
    queryKey: QUOTE_QUERY_KEY(uuid),
    queryFn: () => fetchQuoteSummary(uuid),
    enabled: Boolean(uuid),
    staleTime: 10000, // 10 seconds
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
      // Check if the error is due to expired payment
      try {
        const message = error?.message || '';
        const jsonMatch = message.match(/\{.*\}/);
        if (jsonMatch) {
          const errorData: ApiErrorResponse = JSON.parse(jsonMatch[0]);
          if (errorData.code === 'MER-PAY-2017') {
            router.replace(`/payin/${uuid}/expired`);
          }
        }
      } catch {
        // Ignore parsing errors
      }
    },
  });
}

/**
 * Hook to accept quote
 */
export function useAcceptQuote(uuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => acceptQuote(uuid),
    onSuccess: (data) => {
      // Update the cache with the accepted quote data
      queryClient.setQueryData(QUOTE_QUERY_KEY(uuid), data);
    },
  });
}
