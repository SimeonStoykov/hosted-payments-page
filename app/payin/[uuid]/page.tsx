'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useQuoteSummary,
  useUpdateQuoteCurrency,
  useAcceptQuote,
} from '../../hooks/useQuote';
import { isAcceptQuoteExpiredError } from '../../utils/errors';
import { useCountdown } from '../../hooks/useCountdown';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import {
  CurrencySelector,
  CurrencyCode,
} from '../../components/CurrencySelector';

export default function AcceptQuotePage() {
  const params = useParams();
  const uuid = params.uuid as string;
  const router = useRouter();

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode | ''>(
    '',
  );
  // TanStack Query hooks
  const { data: quote, isLoading, error } = useQuoteSummary(uuid);
  const updateCurrencyMutation = useUpdateQuoteCurrency(uuid);
  const acceptQuoteMutation = useAcceptQuote(uuid);

  const { timeLeft, isExpired } = useCountdown(quote?.acceptanceExpiryDate);

  // Handle expiration redirect
  useEffect(() => {
    if (quote?.status === 'EXPIRED') {
      router.replace(`/payin/${uuid}/expired`);
    } else if (quote?.quoteStatus === 'ACCEPTED') {
      router.replace(`/payin/${uuid}/pay`);
    }
  }, [quote?.status, quote?.quoteStatus, router, uuid]);

  // Auto-refresh when timer expires by calling update currency mutation
  useEffect(() => {
    if (isExpired && selectedCurrency) {
      updateCurrencyMutation.mutate(selectedCurrency);
    }
    // Only depend on isExpired and selectedCurrency to avoid double requests
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpired, selectedCurrency]);

  const handleCurrencyChange = (currency: CurrencyCode) => {
    setSelectedCurrency(currency);
    updateCurrencyMutation.mutate(currency);
  };

  const [isAcceptingQuote, setIsAcceptingQuote] = useState(false);

  const handleConfirm = () => {
    setIsAcceptingQuote(true);
    acceptQuoteMutation.mutate(undefined, {
      onSuccess: () => {
        router.replace(`/payin/${uuid}/pay`);
      },
      onError: (error) => {
        // If error is NOT expired, stop processing state (button re-enables)
        // If it IS expired, keep processing state true (button stays disabled while hook redirects)
        if (!isAcceptQuoteExpiredError(error)) {
          setIsAcceptingQuote(false);
        }
      },
    });
  };

  if (
    isLoading ||
    quote?.status === 'EXPIRED' ||
    quote?.quoteStatus === 'ACCEPTED'
  ) {
    return <LoadingSpinner />;
  }

  if (error || !quote) {
    return <ErrorMessage message="Failed to load quote details." />;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="w-full max-w-md px-[22px]">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Merchant Name */}
          <h2 className="text-xl font-medium mb-1">
            {quote.merchantDisplayName}
          </h2>

          {/* Amount */}
          <div className="flex items-baseline justify-center gap-1 mb-[25px]">
            <span className="text-[32px] leading-[40px] font-semibold">
              {quote.displayCurrency.amount.toFixed(2)}
            </span>
            <span className="text-xl leading-[40px] font-semibold">
              {quote.displayCurrency.currency}
            </span>
          </div>

          {/* Reference */}
          <p className="text-sm leading-[22px] text-bvnk-gray mb-[25px]">
            For reference number:
            <span className="ml-1 font-medium leading-[22px] text-foreground">
              {quote.reference}
            </span>
          </p>

          <CurrencySelector
            selectedCurrency={selectedCurrency}
            onCurrencyChange={handleCurrencyChange}
          />

          {/* Payment Details - Show only when currency is selected */}
          {selectedCurrency && (
            <div className="w-full space-y-4 border-t border-gray-200">
              {/* Amount Due */}
              <div className="text-left py-3 border-b border-gray-200 mb-0">
                <p className="text-sm font-medium min-h-8 flex items-center justify-between leading-[22px]">
                  <span className="text-bvnk-gray">Amount due</span>
                  {updateCurrencyMutation.isPending ? (
                    <span className="inline-block animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                  ) : (
                    <span className="font-medium">
                      {quote.paidCurrency.amount} {quote.paidCurrency.currency}
                    </span>
                  )}
                </p>
              </div>

              {/* Quote Expiration Timer */}
              <div className="text-left py-3 border-b border-gray-200 mb-[25px]">
                <p className="text-sm font-medium min-h-8 flex items-center justify-between leading-[22px]">
                  <span className="text-bvnk-gray">
                    Quoted price expires in
                  </span>
                  {updateCurrencyMutation.isPending ? (
                    <span className="inline-block animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                  ) : quote.acceptanceExpiryDate && !isExpired ? (
                    <span className="font-medium tabular-nums">{timeLeft}</span>
                  ) : null}
                </p>
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={updateCurrencyMutation.isPending || isAcceptingQuote}
                className="w-full bg-blue-600 hover:bg-blue-700 leading-[24px] text-white text-sm font-medium py-2 px-4 rounded-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              >
                {isAcceptingQuote ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
