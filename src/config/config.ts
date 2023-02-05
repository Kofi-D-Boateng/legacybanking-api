import { randomBytes } from "crypto";

const config = {
  ApiVersion: process.env.API_VERSION || "v1",
  BankKeyHash: process.env.BANK_KH,
  Port: process.env.PORT,
  MessageBrokerUri: process.env.RABBITMQ_URI,
  LogginType: process.env.LOGGING_TYPE,
  LbSecret: process.env.LB_SECRET || randomBytes(12).toString("hex"),
  AWS:{
    S3:{    
      bucketName:process.env.AWS_BUCKETNAME,
      region:process.env.AWS_REGION,
      accessKey:process.env.AWS_ACCESS_KEY,
      secretAccessKey:process.env.AWS_SECRET_KEY}
  },
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
  },

  Microservices:{
    Auth:`http://${process.env.AUTH_SERVICE_DOMAIN}:${process.env.AUTH_SERVICE_PORT}/${process.env.API_VERSION}`,
    Notifications:`http://${process.env.NOTIF_SERVICE_DOMAIN}:${process.env.NOTIF_SERVICE_PORT}/${process.env.API_VERSION}`,
    Redis:{
      RedisHostname: process.env.REDIS_HOSTNAME,
      RedisPort: process.env.REDIS_PORT,
    }
  }
};

export default config;
