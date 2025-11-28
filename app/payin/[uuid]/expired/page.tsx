'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from '../../../components/ui/Card';
import { useQuoteSummary } from '../../../hooks/useQuote';
import { useCountdown } from '../../../hooks/useCountdown';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

export default function ExpiredPage() {
  const params = useParams();
  const router = useRouter();
  const uuid = params.uuid as string;

  const { data: quote, isLoading } = useQuoteSummary(uuid);
  const { isExpired } = useCountdown(quote?.expiryDate);

  useEffect(() => {
    if (!isLoading && quote && quote.status !== 'EXPIRED' && !isExpired) {
      // If quote is accepted, go to pay, otherwise go to accept page
      if (quote.quoteStatus === 'ACCEPTED') {
        router.replace(`/payin/${uuid}/pay`);
      } else {
        router.replace(`/payin/${uuid}`);
      }
    }
  }, [quote, isLoading, router, uuid, isExpired]);

  if (isLoading || (quote?.status !== 'EXPIRED' && !isExpired)) {
    return <LoadingSpinner />;
  }
  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
      style={{ backgroundColor: '#EBEDF3' }}
    >
      <Card className="w-full max-w-md text-center py-12">
        <Image
          src="/icons/error.svg"
          alt="Payment details expired error"
          width={48}
          height={48}
          className="mx-auto mb-5"
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment details expired
        </h1>
        <p className="text-gray-600 mb-8">
          The payment details for your transaction have expired.
        </p>
      </Card>
    </div>
  );
}
