import express from "express";

const router = express.Router();

// User routs

import { UserVersionController } from "../controller/user/version";
import { UserSignupController } from "../controller/user/signup";
import { UserOtpVerifyController } from "../controller/user/otpverfiy";
import { UserPasswordManagementController } from "../controller/user/passwordmanagement";
import { UserDashboardController } from "../controller/user/userdashboard";
import { authenticateToken } from "../utils/functions";
import { DishManagementController } from "../controller/user/dishmanagement";
import { ChefManagementController } from "../controller/user/chefmanagement";
import { CartController } from "../controller/user/cartmanagement";
import { OfferManagementController } from "../controller/user/offermanagement";
import { OrderManagementController } from "../controller/user/ordermanagement";
import { PaymentManagementController } from "../controller/user/paymentmanagement";
import { GuestUserController } from "../controller/user/guestusermanagement";
import { AdminSettingsController } from "../controller/user/adminsettingsmanagement";
import { UserProfileController } from "../controller/user/userProfile";
import { FavouriteManagenemtController } from "../controller/user/favourite";
// *********************** API AppSite :-vserions **************************
const userVersionsController=new UserVersionController();
router.post('/version',userVersionsController.version);


// *********************** API :-signup user **************************
// signup user api
const userController=new UserSignupController();

// Route for user signup
router.post('/signup', authenticateToken,userController.signup);


// *********************** API :-otpverfiy **************************

const userOtpVerifyController=new UserOtpVerifyController();

// Route for OTP verification
router.post('/otpverify', authenticateToken,userOtpVerifyController.verifyOTP);

router.post('/resendOtp',authenticateToken,userOtpVerifyController.resendOtp);

// *************** API :-userforgotpassword verify and create new password *********************

const userPasswordManagementController=new UserPasswordManagementController();

// router.post('/forgotpassword',userPasswordManagementController.forgotPassword);

// router.post('/verifyforgotpassword',userPasswordManagementController.forgotPasswordVerify);

router.post('/newpassword',authenticateToken,userPasswordManagementController.createNewPassword);



// *********************** API :-user Dashboard  **************************

const userDashboardController=new UserDashboardController();
router.get('/userdashboard',authenticateToken, userDashboardController.getDashboard);



// *********************** API :-Popular Dish Management  **************************

const dishManagementController=new DishManagementController();
// viewall populardish api
router.get('/populardishes',authenticateToken, dishManagementController.viewAllPopularDishes);

// viewdishbyid api
router.get('/getdishdetails',authenticateToken,dishManagementController.getDishDetailsById);

// View all available today dishes
router.get('/availableToday',authenticateToken, dishManagementController.viewDishByDate);


// *********************** API :-Popular Chef Management  **************************
const chefManagementController=new ChefManagementController();

// viewall popularchef api

router.get('/viewAllPopularChefs', authenticateToken,chefManagementController.viewAllPopularChefs);

router.get('/viewChefDetails', authenticateToken,chefManagementController.viewChefDetailsById);


// // *********************** API :-add to cart  **************************
 const cartController=new CartController();


// Define route for adding a dish to the cart
router.post('/addtocart', authenticateToken,cartController.addToCart);


  // // Route for getting cart details
router.get('/getCartDetails', authenticateToken,cartController.getCartDetails);

router.post('/deleteCart',authenticateToken,cartController.deleteCartItem);


// Define the route for the checkout API
router.get('/checkout',authenticateToken,cartController.checkout);


 // *********************** API :-offerManagements api  **************************


const offerManagementController=new OfferManagementController();

router.post('/applycouponcode',authenticateToken,offerManagementController.applyCouponCode)


 // *********************** API :-OrderManagement api  **************************

const orderManagementController=new OrderManagementController();

// order routes
router.post('/create-order',authenticateToken, orderManagementController.createOrder);

// // *********************** API :-Payment_Transactions api  **************************

const paymentManagementController=new PaymentManagementController();
// router.post('/payment',authenticateToken,paymentManagementController.payment);


// Route to confirm payment
router.post('/confirm-payment',authenticateToken, paymentManagementController.confirmPayment);



// GuestUser api

const guestUserController = new GuestUserController();

router.get('/GuestUser/:zipcode', (req, res) => guestUserController.getDashboardByZipcode(req, res));


// AdminSettingsController routes

const adminSettingsController=new AdminSettingsController();
// Route for getting admin settings details
router.get('/admin-settings',adminSettingsController.getAdminSettingsDetails);


const userProfileController=new UserProfileController();
router.get('/UpdateUserProfile',authenticateToken,userProfileController.updateProfile);

router.delete('/user/:userId',authenticateToken, userProfileController.deleteProfile);


const favouriteManagenemtController=new FavouriteManagenemtController();

router.post('/addFavourite',authenticateToken,favouriteManagenemtController.addFavourite);

export default router;