'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { useQuoteSummary } from '../../../hooks/useQuote';
import { useCountdown } from '../../../hooks/useCountdown';
import { PaymentPageLayout } from '../../../components/PaymentPageLayout';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ErrorMessage } from '../../../components/ErrorMessage';

export default function PayQuotePage() {
  const params = useParams();
  const router = useRouter();
  const uuid = params.uuid as string;

  const { data: quote, isLoading, error } = useQuoteSummary(uuid);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { timeLeft, isExpired } = useCountdown(quote?.expiryDate);

  // Handle expiration redirect
  useEffect(() => {
    if (quote?.status === 'EXPIRED' || isExpired) {
      router.replace(`/payin/${uuid}/expired`);
    }
  }, [isExpired, router, uuid, quote?.status]);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isLoading || quote?.status === 'EXPIRED' || isExpired) {
    return <LoadingSpinner />;
  }

  if (error || !quote || !quote.address) {
    return <ErrorMessage message="Invalid payment details." />;
  }

  return (
    <PaymentPageLayout>
      <div className="space-y-6">
        {/* Pay with Currency */}
        <h1 className="text-xl text-center font-medium mb-[25px]">
          Pay with {quote.paidCurrency.currency}
        </h1>

        {/* Instruction Text */}
        <p className="text-sm leading-[22px] text-bvnk-gray text-center mb-[25px]">
          To complete this payment send the amount due to the{' '}
          {quote.paidCurrency.currency} address provided below.
        </p>

        {/* Amount Due */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Amount due</span>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900 font-mono">
                {quote.paidCurrency.amount} {quote.paidCurrency.currency}
              </span>
              <button
                onClick={() =>
                  handleCopy(quote.paidCurrency.amount.toString(), 'amount')
                }
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                {copiedField === 'amount' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {quote.paidCurrency.currency} Address
            </span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-gray-900">
                {quote.address.address.slice(0, 7)}...
                {quote.address.address.slice(-5)}
              </span>
              <button
                onClick={() => handleCopy(quote.address!.address, 'address')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                {copiedField === 'address' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center space-y-3">
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <QRCode
              value={quote.address.uri || quote.address.address}
              size={180}
              level="M"
            />
          </div>
          {/* Full Address below QR */}
          <div className="text-center">
            <p className="font-mono text-xs text-gray-500 break-all px-4">
              {quote.address.address}
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className="text-center pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Time left to pay</div>
          <div className="text-3xl font-bold text-gray-900 tracking-wider tabular-nums">
            {timeLeft}
          </div>
        </div>
      </div>
    </PaymentPageLayout>
  );
}
