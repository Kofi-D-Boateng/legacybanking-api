export enum BrokerQueue {
  AUTHENTICATE = "authentication",
  AUTHENTICATIONRESULT = "authentication-result",
  BILLINGUPDATE = "billing-update",
  FRAUD = "fraud-check",
  JOINMAILLIST = "join-maillist",
  PROCESSTRANSACTION = "transaction-processing",
  VENDORTRANSACTION = "vendor-transaction",
  ATMTRANSACTION = "atm-transaction",
  ACCOUNTTRANSFER = "account-transfer",
  UPDATENOTIFICATION = "update-notifications",
  UPDATECUSTOMERSECURITY = "update-customer-security",
}

export enum BrokerExchange{
  AUTH = "auth",
  NOTIF = "notifications",
  BANKING = "bank"
}

export enum RoutingKey{
  MAILLIST_RK = "maillist",
  CS_RK = "cust-serv",
  UPDATE_RK = "update",
  ATM_RK = "atm",
  VENDOR_RK = "vendor",
  ACCOUNT_RK = "account",
  SECURITY_RK = "security",
  BILLING_RK = "billing"
}

export enum Type {
  DIRECT = "direct",
  TOPIC = "topic",
  FANOUT = "fanout"
}
