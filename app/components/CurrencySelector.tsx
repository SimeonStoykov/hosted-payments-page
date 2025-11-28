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
        className="block text-sm font-medium mb-1"
      >
        Pay with
      </label>
      <select
        id="currency-select"
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
        className="w-full bg-white font-medium border border-[#E3E8EE] rounded-sm p-4 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
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
