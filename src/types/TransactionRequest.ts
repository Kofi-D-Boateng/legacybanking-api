type TransactionRequest = {
  token: string;
  accountNumber: string;
  cardNumber: string;
  emailOfTransferee: string;
  dateOfTransaction: string;
  email: string;
  amount: number;
  bankAccountType: string;
  phoneNumberOfTransferee: number;
  transactionType: string;
  cardHolderName: string;
  cardVerificationCode: number;
  cardType: string;
  expirationDate: string;
  merchantName: string;
  merchantDescription: string;
};

export default TransactionRequest;
