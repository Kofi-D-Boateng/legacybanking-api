enum BrokerQueue {
  Authentication = "authentication",
  AccountSecurityUpdate = "account-security",
  BillingUpdate = "billing-update",
  Fraud = "fraud-check",
  ProcessTransaction = "transaction-processing",
  AuthenticationResult = "authentication-result",
  UpdateNotification = "update-notifications",
  UpdateCustomerSecurity = "update-customer-security"
}

export default BrokerQueue;
