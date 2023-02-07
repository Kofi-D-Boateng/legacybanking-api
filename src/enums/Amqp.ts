export enum BrokerQueue {
  AUTHENTICATE = "authentication",
  AUTHENTICATIONRESULT = "authentication-result",
  BILLINGUPDATE = "billing-update",
  FRAUD = "fraud-check",
  PROCESSTRANSACTION = "transaction-processing",
  UPDATENOTIFICATION = "update-notifications",
  UPDATECUSTOMERSECURITY = "update-customer-security",
}

export enum BrokerExchange{
  AUTH = "auth",
  NOTIF = "notifications",
  BANKING = "banking"
}

export enum RoutingKey{
  UPDATE = "update",
  PROCESS = "process",
  INSERT = "insert"
}

export enum Type {
  DIRECT = "direct",
  TOPIC = "topic",
  FANOUT = "fanout"
}
