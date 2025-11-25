'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuoteSummary, useUpdateQuoteCurrency } from '../../hooks/useQuote';
import { useCountdown } from '../../hooks/useCountdown';
import { Card } from '../../components/ui/Card';
import {
  CurrencySelector,
  CurrencyCode,
} from '../../components/CurrencySelector';

export default function AcceptQuotePage() {
  const params = useParams();
  const uuid = params.uuid as string;

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode | ''>(
    '',
  );

  // TanStack Query hooks
  const { data: quote, isLoading, error } = useQuoteSummary(uuid);
  const updateCurrencyMutation = useUpdateQuoteCurrency(uuid);

  const { timeLeft, isExpired } = useCountdown(quote?.acceptanceExpiryDate);

  const handleCurrencyChange = (currency: CurrencyCode) => {
    setSelectedCurrency(currency);
    updateCurrencyMutation.mutate(currency);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Error</h1>
          <p className="text-gray-600">Failed to load quote details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="w-full max-w-md" title="">
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
                <p className="text-sm font-medium text-gray-700">
                  Amount due:{' '}
                  {updateCurrencyMutation.isPending ? (
                    <span className="inline-block animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full align-middle ml-2"></span>
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
                <p className="text-sm font-medium text-gray-700">
                  Quoted price expires in:{' '}
                  {updateCurrencyMutation.isPending ? (
                    <span className="inline-block animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full align-middle ml-2"></span>
                  ) : quote.acceptanceExpiryDate && !isExpired ? (
                    <span className="text-2xl font-bold text-red-600 font-mono">
                      {timeLeft}
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
