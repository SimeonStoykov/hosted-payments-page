'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useQuoteSummary,
  useUpdateQuoteCurrency,
  useAcceptQuote,
} from '../../hooks/useQuote';
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
  }, [quote, router, uuid]);

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

  const handleConfirm = () => {
    acceptQuoteMutation.mutate(undefined, {
      onSuccess: () => {
        router.replace(`/payin/${uuid}/pay`);
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
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
      style={{ backgroundColor: '#EBEDF3' }}
    >
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center text-center space-y-6 pt-4">
          {/* Merchant Name */}
          <h2 className="text-xl font-semibold text-gray-900">
            {quote.merchantDisplayName}
          </h2>

          {/* Amount */}
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-gray-900">
              {quote.displayCurrency.amount.toFixed(2)}
            </span>
            <span className="text-xl font-medium text-gray-500">
              {quote.displayCurrency.currency}
            </span>
          </div>

          {/* Reference */}
          <p className="text-sm text-gray-500">
            For reference number:
            <span className="ml-1 font-mono text-gray-700">
              {quote.reference}
            </span>
          </p>

          <CurrencySelector
            selectedCurrency={selectedCurrency}
            onCurrencyChange={handleCurrencyChange}
          />

          {/* Payment Details - Show only when currency is selected */}
          {selectedCurrency && (
            <div className="w-full space-y-4 pt-2 border-t border-gray-200">
              {/* Amount Due */}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 min-h-8 flex items-center justify-between">
                  <span>Amount due</span>
                  {updateCurrencyMutation.isPending ? (
                    <span className="inline-block animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">
                      {quote.paidCurrency.amount}{' '}
                      <span className="text-lg font-medium text-gray-500">
                        {quote.paidCurrency.currency}
                      </span>
                    </span>
                  )}
                </p>
              </div>

              {/* Quote Expiration Timer */}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 min-h-8 flex items-center justify-between">
                  <span>Quoted price expires in</span>
                  {updateCurrencyMutation.isPending ? (
                    <span className="inline-block animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                  ) : quote.acceptanceExpiryDate && !isExpired ? (
                    <span className="text-2xl font-bold text-red-600 font-mono">
                      {timeLeft}
                    </span>
                  ) : null}
                </p>
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={
                  updateCurrencyMutation.isPending ||
                  acceptQuoteMutation.isPending
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              >
                {acceptQuoteMutation.isPending ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
