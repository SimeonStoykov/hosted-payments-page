'use client';

import { Card } from '../../components/ui/Card';

export default function AcceptQuotePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="w-full max-w-md" title="">
        <div className="flex flex-col items-center text-center space-y-6 pt-4">
          {/* Merchant Name */}
          <h2 className="text-xl font-semibold text-gray-900">Test</h2>

          {/* Amount */}
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-gray-900">200</span>
            <span className="text-xl font-medium text-gray-500">EUR</span>
          </div>

          {/* Reference */}
          <p className="text-sm text-gray-500">
            For reference number:{' '}
            <span className="font-mono text-gray-700">REF</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
