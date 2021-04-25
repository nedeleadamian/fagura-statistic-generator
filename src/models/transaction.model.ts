export interface TransferModel {
  id: number;
  type: string;
  extra: any;
  loanApplication: any;
}

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
}

export interface TransactionModel {
  account: { id: number; iban: string };
  accountBalance: number;
  amount: number;
  amountDue: number;
  createdAt: string | Date;
  dateDue: string;
  extra: any;
  id: number;
  investmentFraction: any;
  investmentPayment: any;
  loanPayment: any;
  status: string;
  transfer: TransferModel;
  type: TransactionType;
  updatedAt: string | Date;
}
