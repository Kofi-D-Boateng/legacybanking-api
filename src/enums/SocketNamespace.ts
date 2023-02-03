enum SocketNamespace {
  Auth = "authenticate-user",
  AccountSecurity = "set-security",
  BillingType = "set-billing-type",
  BankInfo = "get-bank-info",
  Connect = "connection",
  CustomerInfo = "get-customer",
  Disconnect = "disconnect",
  Fraud = "check-for-fraud",
  Logout = "logout-user",
  Login = "login-user",
  ProcessTransaction = "process-transaction",
  SetBank = "set-bank",
  Token = "get-token",
  Update = "update-user",
  Error = "error",
  YourInfo = "your-info",
}

export default SocketNamespace;
