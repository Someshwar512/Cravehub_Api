import express from "express";
 import {AdminUserController} from "../controller/admin/usermanagement";
 import {authenticateToken} from "../utils/functions";
 import { AdminDashboardController } from "../controller/admin/dashboard";
 import { AdminZipCodeController } from "../controller/admin/zipcodemanagement";
 import { AdminChefController } from "../controller/admin/chefmanagement";
 import { Bannermanagementcontroller } from "../controller/admin/bannermanagement";
 import { Managedishcontroller } from "../controller/admin/ManageDish";
 import { OfferManagementController } from "../controller/admin/offermanagement";
 import { EmailTemplatecontroller } from "../controller/admin/emailtemplate";
 import { Ordermanagementcontroller } from "../controller/admin/ordermanagement";
const router = express.Router();


// *********************** API :-User management **************************
// addUser Api
 const adminUserController =new AdminUserController();
//  router.post('/adduser',authenticateToken,adminUserController.adduser);
router.post('/adduser',authenticateToken,adminUserController.adduser);


router.get('/getuserbyid/:id/', authenticateToken, adminUserController.getUserDetails);

// update specific user Byid
router.put('/user/:id',authenticateToken, adminUserController.updateUserById);


// delete specific user Byid Api
router.delete('/user/:id',authenticateToken, adminUserController.deleteUserById);

// Status Active And Inactive Api
router.post('/user/:id',authenticateToken,adminUserController.userStatus);
 
//  router.post('/adduser',adminUserController.addUser);
router.get('/usermanagement',authenticateToken,adminUserController.getAllUser);

const adminDashboardController=new AdminDashboardController();
router.get('/dashboard',authenticateToken,adminDashboardController.getDashboardData);

// getAllDeletedUsers Api
router.get('/getDeleteUsers', authenticateToken, adminUserController.getAllDeletedUsers);


// **********************Zipcode Management Api ***********************
const adminZipCodeController=new AdminZipCodeController();
router.get('/getzipcode',authenticateToken,adminZipCodeController.getZipcodes);

// delete specific user Byid Api
router.delete('/zipcode/:id',authenticateToken, adminZipCodeController.deleteZipcodeById);

router.post('/addzipcode',authenticateToken,adminZipCodeController.addZipcode)

// **************** Chef Managements APi ********************
const adminChefController=new AdminChefController();

// add dish api
router.post('/adddish',authenticateToken,adminChefController.addDish);


// viewdish using chefid wise
router.get('/viewlistdish/:chefid', authenticateToken,adminChefController.viewAllDishes);

// getuserByid dishapi
router.get('/getdishByid/:id', authenticateToken,adminChefController.viewDish);


// deletedish api specific dishid
router.delete('/dish/:id',authenticateToken, adminChefController.deleteDishById);


// Update a dish by ID
router.put('/dish/update/:id', authenticateToken, adminChefController.updateDish);




// **************** Banner Managements APi ********************

const bannermanagementcontroller =new Bannermanagementcontroller()
// getall banner
router.get('/getallbanner',authenticateToken,bannermanagementcontroller.getBanner)

// Add banner
router.post('/addbanner',authenticateToken,bannermanagementcontroller.addBanner)

// getbannerByid api
router.get('/getbannerByid/:id', authenticateToken,bannermanagementcontroller.Viewbanner);

// deletebanner api 
router.delete('/banner/:id',authenticateToken, bannermanagementcontroller.deleteBannerById);

//  Update a banner by ID
router.put('/banner/:id', authenticateToken, bannermanagementcontroller.updateBanner);

// **************** Manage Dishes APi ********************
const managedishcontroller = new Managedishcontroller()

// get all dishes
router.get('/getalldishes',authenticateToken,managedishcontroller.viewAllDishes)
// get all foodtype
router.get('/getallfoodtype',authenticateToken,managedishcontroller.getFoodType)

// add foodtype
router.post('/addfoodtype',authenticateToken,managedishcontroller.addfoodtype)
// add ingredients
router.post('/addingredients',authenticateToken,managedishcontroller.addingredients)

// add cuisine
router.post('/addcuisine',authenticateToken,managedishcontroller.addcuisine)

// get all ingredients
router.get('/getallingredients',authenticateToken,managedishcontroller.getIngredients)

// get all cuisine
router.get('/getallcuisine',authenticateToken,managedishcontroller.getCuisine)

// get all tags
router.get('/getalltags',authenticateToken,managedishcontroller.getTags)

// get all portionsize
router.get('/getallportionsize',authenticateToken,managedishcontroller.getPortionsize)

// get all portionsize
router.get('/getalldietary',authenticateToken,managedishcontroller.getDietary)

// Dish Status Api
router.post('/dishstatus',authenticateToken,managedishcontroller.DishStatus);

// **************** Offer management APi ********************
const offerManagementController = new OfferManagementController()

// add offer
router.post('/addoffer',authenticateToken,offerManagementController.addOffer)

// get all offers
router.get('/gettalloffer',authenticateToken,offerManagementController.getalloffer)

// deleteoffer api
router.delete('/offer/:id',authenticateToken, offerManagementController.deleteofferById);

// getofferByid api
router.get('/offer/:id', authenticateToken,offerManagementController.Viewoffer);

//  Update a Emailtemplate by ID
router.put('/offer/:id', authenticateToken, offerManagementController.updateOffer)

// get all offer types
router.get('/offertypes', authenticateToken,offerManagementController.getOfferType);

// get all offer channel
router.get('/offerchannel', authenticateToken,offerManagementController.getOfferChannel);

// get all offer ZIPCODE types
router.get('/offerzipcodetypes', authenticateToken,offerManagementController.getOfferZipcodeType);

// **************** Email Template API ********************
const emailTemplatecontroller = new EmailTemplatecontroller()

// get all offers
router.get('/gettallemailtemplate',authenticateToken,emailTemplatecontroller.viewAllEmailTemplates)

// add offer
router.post('/addemailtemplate',authenticateToken,emailTemplatecontroller.addemailtemplate)

// get Email Template By id api
router.get('/getemailtemplate/:id', authenticateToken,emailTemplatecontroller.ViewemailTemplate);

// delete Email Template By id api
router.delete('/emailtemplate/:id',authenticateToken, emailTemplatecontroller.deleteEmailTemplate);

//  Update a Emailtemplate by ID
router.put('/emailtemplate/:id', authenticateToken, emailTemplatecontroller.updateEmailTemplate);

// **************** Offer management APi ********************
const ordermanagementcontroller = new Ordermanagementcontroller()


// get all offers
router.get('/gettallorders',authenticateToken,ordermanagementcontroller.getOrders)

// Order Status  Api
router.post('/orderstatus',authenticateToken,ordermanagementcontroller.orderStatus);


// View Order Api
router.get('/order/:id',authenticateToken,ordermanagementcontroller.Vieworder);
export default router;


// COMMON Status  Api
router.post('/changestatus',authenticateToken,ordermanagementcontroller.orderStatustest);





