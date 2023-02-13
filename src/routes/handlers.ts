
import {  Router,RouterOptions } from "express";
import config from "../config/config";
import { getRefreshToken, loginCustomer,confirmCustomerRegistration,logoutCustomer, registerCustomer } from "../controllers/auth";
import { s3Bucket } from "../controllers/aws";
import { getProfile } from "../controllers/customer";
import { updateNotifications,getNewVerificationLink } from "../controllers/notification";
import { updateCustomerSecurity } from "../controllers/security";
import { getBankInfo, processTransaction } from "../controllers/banking";
import { joinMailList } from "../controllers/maillist";
import { contactCustomerService } from "../controllers/customerService";

const options:RouterOptions = {
    strict:false,
    caseSensitive:false,
}

const router:Router = Router(options);

router.get(config.Routes.Frontend.AWS,s3Bucket)

router.get(config.Routes.Frontend.Bank,getBankInfo)

router.get(config.Routes.Frontend.Profile,getProfile);

router.get(config.Routes.Frontend.RefreshToken,getRefreshToken)

router.get(config.Routes.Frontend.VerificationLink,getNewVerificationLink)

router.post(config.Routes.Frontend.Login,loginCustomer)

router.post(config.Routes.Frontend.VerifyAccount,confirmCustomerRegistration)

router.put(config.Routes.Frontend.Maillist,joinMailList)

router.put(config.Routes.Frontend.UpdateNotification,updateNotifications)

router.put(config.Routes.Frontend.Transaction,processTransaction)

router.put(config.Routes.Frontend.Registration,registerCustomer)

router.put(config.Routes.Frontend.ProfileSecurity,updateCustomerSecurity)

router.put(config.Routes.Frontend.CustomerService,contactCustomerService)

router.delete(config.Routes.Frontend.Logout,logoutCustomer)

export default router;
