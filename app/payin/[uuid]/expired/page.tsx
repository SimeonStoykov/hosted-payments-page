'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { PaymentPageLayout } from '../../../components/PaymentPageLayout';
import { useQuoteSummary } from '../../../hooks/useQuote';
import { useCountdown } from '../../../hooks/useCountdown';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { PaymentStatus, QuoteStatus } from '../../../lib/constants';

export default function ExpiredPage() {
  const params = useParams();
  const router = useRouter();
  const uuid = params.uuid as string;

  const { data: quote, isLoading } = useQuoteSummary(uuid);
  const { isExpired } = useCountdown(quote?.expiryDate);

  useEffect(() => {
    if (
      !isLoading &&
      quote &&
      quote.status !== PaymentStatus.EXPIRED &&
      !isExpired
    ) {
      // If quote is accepted, go to pay, otherwise go to accept page
      if (quote.quoteStatus === QuoteStatus.ACCEPTED) {
        router.replace(`/payin/${uuid}/pay`);
      } else {
        router.replace(`/payin/${uuid}`);
      }
    }
  }, [quote, isLoading, router, uuid, isExpired]);

  if (isLoading || (quote?.status !== PaymentStatus.EXPIRED && !isExpired)) {
    return <LoadingSpinner />;
  }
  return (
    <PaymentPageLayout contentClassName="text-center px-[66px] pt-[77px] pb-[67px]">
      <Image
        src="/icons/error.svg"
        alt="Payment details expired error"
        width={48}
        height={48}
        className="mx-auto mb-5"
      />
      <h1 className="text-xl font-semibold mb-5">Payment details expired</h1>
      <p className="text-[15px] leading-[24px] text-bvnk-gray">
        The payment details for your transaction have expired.
      </p>
    </PaymentPageLayout>
  );
}
