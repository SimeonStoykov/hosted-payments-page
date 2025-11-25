'use client';

const CURRENCIES = [
  { code: 'BTC', name: 'Bitcoin' },
  { code: 'ETH', name: 'Ethereum' },
  { code: 'LTC', name: 'Litecoin' },
] as const;

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
        className="block text-sm font-medium text-gray-700 ml-1"
      >
        Pay with
      </label>
      <select
        id="currency-select"
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
        className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-4 pr-10 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}
