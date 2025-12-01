'use client';

import { CURRENCIES } from '../lib/constants';

export type CurrencyCode = (typeof CURRENCIES)[number]['code'];

interface CurrencySelectorProps {
  selectedCurrency: CurrencyCode | '';
  onCurrencyChange: (currency: CurrencyCode) => void;
}

export function CurrencySelector({
  selectedCurrency,
  onCurrencyChange,
}: CurrencySelectorProps) {
  return (
    <div className="w-full space-y-2 text-left">
      <label
        htmlFor="currency-select"
        className="block text-sm font-medium mb-1"
      >
        Pay with
      </label>
      <div className="relative">
        <select
          id="currency-select"
          value={selectedCurrency}
          onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
          className="w-full bg-white font-medium border appearance-none border-bvnk-line-gray rounded-sm p-4 pr-9 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
        >
          <option value="" disabled>
            Select Currency
          </option>
          {CURRENCIES.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.name}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 pointer-events-none px-1.5 text-bvnk-black">
          <svg
            width="8"
            height="4"
            viewBox="0 0 8 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 0L8 4L0 4L4 0Z" fill="currentColor" />
          </svg>
          <svg
            width="8"
            height="4"
            viewBox="0 0 8 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 4L0 0L8 0L4 4Z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}
