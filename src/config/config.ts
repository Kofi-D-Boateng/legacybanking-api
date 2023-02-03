import { randomBytes } from "crypto";

const config = {
  ApiVersion: process.env.API_VERSION || "v1",
  BankKeyHash: process.env.BANK_KH,
  Port: process.env.PORT,
  MessageBrokerUri: process.env.RABBITMQ_URI,
  LogginType: process.env.LOGGING_TYPE,
  RedisHostname: process.env.REDIS_HOSTNAME,
  RedisPort: process.env.REDIS_PORT,
  JWTSecret: process.env.JWT_SECRET || randomBytes(12).toString("hex"),
  JWTAlogrithm: process.env.JWT_ALGORITHM,
  JWTExpiration: process.env.JWT_EXPIRATION,
  JWTIssuer: process.env.JWT_ISSUER,

  Routes:{
    AWS:{
      retrieveVideo:"/s3/get-video"
    },
    AuthService:{
      authenticateUser:"/auth/authenticate-customer",
      confirmCustomerRegistration:"/auth/confirm-customer-registration",
      getNewVerificationLink:"/auth/get-new-link",
      getRefreshToken:"/auth/get-refresh-token",
      loginUser:"/auth/login",
      logoutUser:"/auth/logout",
      registerCustomer:"/auth/admin/register-customer"
    },
    BankingService:{
      getBankInfo:"/bank/info",
      processTransaction:"/transactions/process-transaction"
    },
    Customer:{
      getProfile:"/customer/get-profile"
    },
    Security:{
      updateSecurity:"/security/update-user-security"
    },
    NotificationService:{
      updateNotification:"/notifications/update-notification"
    },
  }
};

export default config;
