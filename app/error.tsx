'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EBEDF3] px-4">
      <div className="w-full max-w-md bg-white p-[25px] rounded-[10px] text-center">
        <div className="mb-5">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold mb-3">Something went wrong</h1>
          <p className="text-sm text-bvnk-gray leading-[22px] mb-5">
            An unexpected error occurred. Please try again.
          </p>
        </div>
        <button
          onClick={reset}
          className="w-full bg-bvnk-blue hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-sm transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
