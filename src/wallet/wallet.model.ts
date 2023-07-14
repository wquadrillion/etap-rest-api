export interface Wallet {
  id: number;
  currency: Currency;
  balance: number;
}

export enum Currency {
  Naira = 'Naira',
  Dollar = 'Dollar',
  Pound = 'Pound',
}

export enum TransactionStatus {
  pending = 'pending',
  successful = 'successful',
  declined = 'declined',
}
