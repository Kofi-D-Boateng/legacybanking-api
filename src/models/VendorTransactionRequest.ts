import { CardType } from "../enums/CardType";
import { TransactionRequest, TransactionType } from "../types/TransactionRequest";


export class VendorTransactionRequest{
    cardNumber:string;
    cardVerificationCode:number;
    cardHolderName:string;
    expirationDate:string;
    type:CardType;
    merchantName:string;
    merchantDescription:string;
    amount:number;
    transactionType:TransactionType;
    dateOfTransaction:string;
    location:string;

    constructor(request:TransactionRequest) {
        this.cardNumber = request.cardNumber;
        this.cardVerificationCode = request.cardVerificationCode;
        this.cardHolderName = request.cardHolderName;
        this.expirationDate = request.expirationDate;
        this.merchantName = request.merchantName;
        this.merchantDescription = request.merchantDescription;
        this.type = request.cardType
        this.amount = request.amount;
        this.transactionType = request.transactionType;
        this.dateOfTransaction = request.dateOfTransaction;
        this.location = request.location;
    }
}