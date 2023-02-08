export enum TransactionType{
  ONLINE = "ONLINE-TRANSFER",
  ATM = "ATM-TRANSFER",
  MOBILE = "MOBILE-TRANSFER",
  VENDOR = "VENDOR-TRANSACTION"
}

type TransactionRequest = {
  apiKey: string;
  accountNumber: string;
  cardNumber: string;
  emailOfTransferee: string;
  dateOfTransaction: string;
  email: string;
  amount: number;
  bankAccountType: string;
  phoneNumberOfTransferee: number;
  transactionType: TransactionType;
  cardHolderName: string;
  cardVerificationCode: number;
  cardType: string;
  expirationDate: string;
  merchantName: string;
  merchantDescription: string;
};

export default TransactionRequest;
