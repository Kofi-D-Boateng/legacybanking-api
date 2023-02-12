import { BankAccountType } from "../enums/BankAccountType";
import { TransactionRequest, TransactionType } from "../types/TransactionRequest";


export class AccountTransferRequest{
    email:string;
    emailOfTransferee:string | null;
    accountNumber:string;
    bankAccountType:BankAccountType;
    phoneNumberOfTransferee:number| null;
    amount:number;
    transactionType:TransactionType;
    dateOfTransaction:string;

    constructor(request:TransactionRequest) {
        this.email = request.email;
        this.emailOfTransferee = request.emailOfTransferee
        this.accountNumber = request.accountNumber;
        this.bankAccountType = request.bankAccountType;
        this.phoneNumberOfTransferee = request.phoneNumberOfTransferee;
        this.amount = request.amount;
        this.transactionType = request.transactionType;
        this.dateOfTransaction = new Date().toISOString();

    }
}