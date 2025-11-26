import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchQuoteSummary,
  updateQuoteCurrency,
  acceptQuote,
} from '../lib/api';

export const QUOTE_QUERY_KEY = (uuid: string) => ['quote', uuid];

/**
 * Hook to fetch quote summary data
 */
export function useQuoteSummary(uuid: string) {
  return useQuery({
    queryKey: QUOTE_QUERY_KEY(uuid),
    queryFn: () => fetchQuoteSummary(uuid),
    enabled: Boolean(uuid),
  });
}

/**
 * Hook to update quote currency
 */
export function useUpdateQuoteCurrency(uuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (currency: string) => updateQuoteCurrency(uuid, currency),
    onSuccess: (data) => {
      // Update the cache with the new quote data
      queryClient.setQueryData(QUOTE_QUERY_KEY(uuid), data);
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
