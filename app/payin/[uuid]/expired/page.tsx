'use client';

import Image from 'next/image';
import { Card } from '../../../components/ui/Card';

export default function ExpiredPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
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
