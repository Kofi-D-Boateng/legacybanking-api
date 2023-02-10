export type Account = {
  id: number;
  accountNumber: string;
  routingNumber: string;
  bankAccountType: string;
  capital: number;
  creditType: string;
  isEnable: boolean;
  minimumBalance: number;
  minimumPayment: number;
  usedCredit: number;
  annualPercentageRate: number;
};

export type Card = {
  id: number;
  cardNumber: string;
  cardVerificationCode: string;
  expirationDate: string;
  isLocked: boolean;
  type: string;
  creditType: string;
};

export type Notification = {
  _id: string;
  sender: string;
  receiver: string;
  amount: number;
  date: string;
  read: boolean;
};

export type Transaction = {
  id: number;
  amount: number;
  accountNumber: string;
  location: string;
  cardType: string;
  dateOfTransaction: string;
  dateTransactionPosted: string;
  transactionType: string;
  merchantDescription: string;
  merchantName: string;
  recipient: string;
};

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  country: string | undefined;
  area: string | undefined;
  zipcode: string | undefined;
  isActivated: boolean;
  transactions: Transaction[];
  accounts: Account[];
  cards: Card[];
  notifications: Notification[];
};
