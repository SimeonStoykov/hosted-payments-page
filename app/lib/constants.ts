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
