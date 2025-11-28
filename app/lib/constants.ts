export enum QuoteStatus {
  TEMPLATE = 'TEMPLATE',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
}

export enum PaymentErrorCode {
  QUOTE_EXPIRED_UPDATE = 'MER-PAY-2017',
  QUOTE_EXPIRED_ACCEPT = 'MER-PAY-2004',
}

export const CURRENCIES = [
  { code: 'BTC', name: 'Bitcoin' },
  { code: 'ETH', name: 'Ethereum' },
  { code: 'LTC', name: 'Litecoin' },
] as const;

export const QUOTE_STALE_TIME = 10000; // 10 seconds
