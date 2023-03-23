import { randomBytes } from "crypto";

const config = {
  ApiVersion: process.env.API_VERSION,
  BankKeyHash: process.env.BANK_KH,
  Port: process.env.PORT,
  MessageBrokerUri: process.env.RABBITMQ_URI,
  LogginType: process.env.LOGGING_TYPE,
  LbSecret: process.env.LB_SECRET || randomBytes(12).toString("hex"),
  AWS: {
    S3: {
      bucketName: process.env.AWS_BUCKETNAME,
      region: process.env.AWS_REGION,
      accessKey: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
    Lambda: {
      functionNames: process.env.FUNCTION_NAMES?.split(","),
      region: process.env.REGIONS?.split(","),
      accessKey: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  },
  Routes: {
    AuthService: {
      authenticateUser: "auth/authenticate-customer",
      confirmCustomerRegistration: "auth/confirm-customer-registration",
      getNewVerificationLink: "auth/get-new-link",
      getRefreshToken: "auth/get-refresh-token",
      loginUser: "auth/login-customer",
      logoutUser: "auth/logout",
      registerCustomer: "auth/admin/register-customer",
    },
    BankingService: {
      getBankInfo: "bank/info",
      getFullCustomerInfo: "customer/profile",
      processTransaction: "transactions/process-transaction",
      generateNewVerificationLink: "generate-new-verification-link",
      registerCustomer: "register-customer",
    },
    Customer: {
      getProfile: "customer/profile",
    },
    Security: {
      updateSecurity: "security/update-customer-security",
    },
    NotificationService: {
      getNotifications: "notifications",
      updateNotification: "notifications/update-notification",
      updateBilling: "notifications/billing",
    },
    Mailist: {
      joinMailList: "mail-list/add-to-maillist",
    },
    Frontend: {
      AWS: "/s3/get-video",
      Bank: "/bank/info",
      Billing: "/customer/billing",
      CustomerService: "/contact/customer-service",
      Login: "/customer/login",
      Logout: "/customer/logout",
      Maillist: "/maillist/join",
      Profile: "/customer/profile",
      ProfileSecurity: "/customer/security",
      RefreshToken: "/refresh-token",
      Registration: "/admin/customer/registration",
      Transaction: "/transactions/process-transaction",
      VerifyAccount: "/verify/account",
      VerificationLink: "/link/new-link",
      UpdateNotification: "/notifications/update",
    },
  },

  Microservices: {
    Auth: `http://${process.env.AUTH_SERVICE_DOMAIN}:${process.env.AUTH_SERVICE_PORT}/${process.env.AUTH_API_VERSION}`,
    Notifications: `http://${process.env.NOTIF_SERVICE_DOMAIN}:${process.env.NOTIF_SERVICE_PORT}/${process.env.NOTIF_API_VERSION}`,
    Redis: {
      RedisHostname: process.env.REDIS_HOSTNAME,
      RedisPort: process.env.REDIS_PORT,
    },
    Bank: `http://${process.env.BANK_SERVICE_DOMAIN}:${process.env.BANK_SERVICE_PORT}/${process.env.BANK_API_VERSION}`,
  },
};

export default config;
