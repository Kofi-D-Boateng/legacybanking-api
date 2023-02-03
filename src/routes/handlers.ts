
import {  Router,RouterOptions } from "express";
import config from "../config/config";
import { getRefreshToken, loginCustomer,confirmCustomerRegistration,logoutCustomer, getNewVerificationLink, registerCustomer } from "../controllers/auth";
import { s3Bucket } from "../controllers/aws";
import { getProfile } from "../controllers/customer";
import { updateNotifications } from "../controllers/notification";
import { updateCustomerSecurity } from "../controllers/security";
import { getBankInfo, processTransaction } from "../controllers/transaction";

const options:RouterOptions = {
    strict:false,
    caseSensitive:false,
}

const router:Router = Router(options);

router.get(config.Routes.AWS.retrieveVideo,s3Bucket)

router.get(config.Routes.BankingService.getBankInfo,getBankInfo)

router.get(config.Routes.Customer.getProfile,getProfile);

router.get(config.Routes.AuthService.getRefreshToken,getRefreshToken)

router.get(config.Routes.AuthService.getNewVerificationLink,getNewVerificationLink)

router.post(config.Routes.AuthService.loginUser,loginCustomer)

router.post(config.Routes.AuthService.confirmCustomerRegistration,confirmCustomerRegistration)

router.put(config.Routes.NotificationService.updateNotification,updateNotifications)

router.put(config.Routes.BankingService.processTransaction,processTransaction)

router.put(config.Routes.AuthService.registerCustomer,registerCustomer)

router.put(config.Routes.Security.updateSecurity,updateCustomerSecurity)

router.delete(config.Routes.AuthService.logoutUser,logoutCustomer)

export default router;
