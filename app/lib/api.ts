export interface CurrencyOption {
  code: string;
  protocols: string[];
}

export interface Quote {
  uuid: string;
  merchantDisplayName: string;
  merchantId: string;
  dateCreated: number;
  expiryDate: number;
  quoteExpiryDate: number | null;
  acceptanceExpiryDate: number | null;
  quoteStatus: string;
  reference: string;
  type: string;
  subType: string;
  status: string;
  displayCurrency: CurrencyAmount;
  walletCurrency: CurrencyAmount;
  paidCurrency: CurrencyAmount;
  feeCurrency: CurrencyAmount;
  networkFeeCurrency: CurrencyAmount;
  displayRate: ExchangeRate | null;
  exchangeRate: ExchangeRate | null;
  address: CryptoAddress | null;
  returnUrl: string;
  redirectUrl: string;
  transactions: unknown[];
  refund: unknown | null;
  refunds: unknown[];
  currencyOptions: CurrencyOption[] | null;
  flow: string | null;
  twoStep: boolean;
  pegged: boolean;
  customerId: string;
  networkFeeBilledTo: string;
  processingFeeBilledTo: string;
  networkFeeRates: unknown[];
  walletId: string;
}

export interface CurrencyAmount {
  currency: string | null;
  amount: number;
  actual: number;
}

export interface ExchangeRate {
  base: string;
  counter: string;
  rate: number;
}

export interface CryptoAddress {
  address: string;
  tag: unknown | null;
  protocol: string;
  uri: string;
  alternatives: unknown[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn('NEXT_PUBLIC_API_URL is not defined');
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${error}`,
    );
  }
  return response.json();
}

export async function fetchQuoteSummary(uuid: string): Promise<Quote> {
  const res = await fetch(`${API_URL}/pay/${uuid}/summary`);
  return handleResponse<Quote>(res);
}

export async function updateQuoteCurrency(
  uuid: string,
  currency: string,
): Promise<Quote> {
  const res = await fetch(`${API_URL}/pay/${uuid}/update/summary`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currency,
      payInMethod: 'crypto',
    }),
  });
  return handleResponse<Quote>(res);
}

export async function acceptQuote(uuid: string): Promise<Quote> {
  const res = await fetch(`${API_URL}/pay/${uuid}/accept/summary`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      successUrl: 'no_url',
    }),
  });
  return handleResponse<Quote>(res);
}
