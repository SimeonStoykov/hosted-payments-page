'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { useQuoteSummary } from '../../../hooks/useQuote';
import { useCountdown } from '../../../hooks/useCountdown';
import { PaymentPageLayout } from '../../../components/PaymentPageLayout';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { PaymentStatus } from '../../../lib/constants';
import { CopyButton } from '../../../components/CopyButton';

export default function PayQuotePage() {
  const params = useParams();
  const router = useRouter();
  const uuid = params.uuid as string;

  const { data: quote, isLoading, error } = useQuoteSummary(uuid);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { timeLeft, isExpired } = useCountdown(quote?.expiryDate);

  // Handle expiration redirect
  useEffect(() => {
    if (quote?.status === PaymentStatus.EXPIRED || isExpired) {
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

  if (isLoading || quote?.status === PaymentStatus.EXPIRED || isExpired) {
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
        {/* Amount Due */}
        <div className="flex justify-between items-center py-3 mb-0 border-y border-bvnk-line-gray">
          <span className="text-sm text-bvnk-gray leading-[22px]">
            Amount due
          </span>
          <div className="flex items-center space-x-4">
            <span className="font-medium text-sm leading-[22px]">
              {quote.paidCurrency.amount} {quote.paidCurrency.currency}
            </span>
            <CopyButton
              onClick={() =>
                handleCopy(quote.paidCurrency.amount.toString(), 'amount')
              }
              isCopied={copiedField === 'amount'}
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex justify-between items-center py-3 mb-0">
          <span className="text-sm leading-[22px] text-bvnk-gray">
            {quote.paidCurrency.currency} address
          </span>
          <div className="flex items-center space-x-4">
            <span className="text-sm leading-[22px] font-medium">
              {quote.address.address.slice(0, 7)}...
              {quote.address.address.slice(-5)}
            </span>
            <CopyButton
              onClick={() => handleCopy(quote.address!.address, 'address')}
              isCopied={copiedField === 'address'}
            />
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center space-y-3 mb-3">
          <div className="bg-white p-3 mb-0">
            <QRCode
              value={quote.address.uri || quote.address.address}
              size={140}
              level="M"
            />
          </div>
          {/* Full Address below QR */}
          <p className="text-xs break-all px-3 text-center text-bvnk-gray">
            {quote.address.address}
          </p>
        </div>

        {/* Timer */}
        <div className="flex justify-between items-center py-3 border-y border-bvnk-line-gray">
          <span className="text-sm text-bvnk-gray leading-[22px]">
            Time left to pay
          </span>
          <span className="font-medium text-sm leading-[22px] tabular-nums">
            {timeLeft}
          </span>
        </div>
      </div>
    </PaymentPageLayout>
  );
}
