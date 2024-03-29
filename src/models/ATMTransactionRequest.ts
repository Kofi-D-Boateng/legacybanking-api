import { CardType } from "../enums/CardType";
import { TransactionRequest, TransactionType } from "../types/TransactionRequest";



export class ATMTransactionRequest{
    cardNumber:string;
    cardVerificationCode:number;
    expirationDate:string;
    type:CardType;
    accountPin:number
    amount:number
    transactionType:TransactionType;
    dateOfTransaction:string;
    location:string;

    constructor(request:TransactionRequest) {
        this.cardNumber = request.cardNumber;
        this.cardVerificationCode = request.cardVerificationCode;
        this.expirationDate = request.expirationDate ? request.expirationDate : new Date().toISOString();
        this.type = request.cardType
        this.accountPin = request.accountPin;
        this.amount = request.amount;
        this.transactionType = request.transactionType;
        this.dateOfTransaction = request.dateOfTransaction ? request.dateOfTransaction : new Date().toISOString();
        this.location = request.location;
    }
}