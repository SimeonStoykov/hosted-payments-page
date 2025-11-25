'use client';

import { useParams } from 'next/navigation';
import { useQuoteSummary } from '../../hooks/useQuote';
import { Card } from '../../components/ui/Card';

export default function AcceptQuotePage() {
  const params = useParams();
  const uuid = params.uuid as string;

  // TanStack Query hooks
  const { data: quote, isLoading, error } = useQuoteSummary(uuid);

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
        </div>
      </Card>
    </div>
  );
}
