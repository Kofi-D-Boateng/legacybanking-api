import { BankAccountType } from "../enums/BankAccountType";
import { CardType } from "../enums/CardType";

export enum TransactionEnv{
  ONLINE = "ONLINE-TRANSACTION",
  ATM = "ATM-TRANSACTION",
  MOBILE = "MOBILE-TRANSACTION",
  VENDOR = "VENDOR-TRANSACTION"
}

export enum TransactionType{
  REFUND = "REFUND",
  PURCHASE= "PURCHASE",
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  TRANSFER = "TRANSFER"
}

export type TransactionRequest = {
  apiKey: string;
  accountPin:number;
  accountNumber: string;
  amount: number;
  bankAccountType: BankAccountType;
  cardNumber: string;
  cardHolderName: string;
  cardVerificationCode: number;
  cardType: CardType;
  dateOfTransaction: string;
  emailOfTransferee: string;
  email: string;
  expirationDate: string;
  location:string;
  phoneNumberOfTransferee: number;
  transactionType: TransactionType;
  transactionEnv: TransactionEnv
  merchantName: string;
  merchantDescription: string;
};
