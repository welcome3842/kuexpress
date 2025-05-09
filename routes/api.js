const express = require('express');
const router = express.Router();
const authorize    =  require('../middleware/authorize');
const AuthController    =  require('../controllers/auth.controller');
const OrderController    =  require('../controllers/order.controller');
const ShipmentController    =  require('../controllers/shipment.controller');
const UserController    =  require('../controllers/user.controller');
const WalletController    =  require('../controllers/wallet.controller');
const ProductController    =  require('../controllers/product.controller');
const TaskController    =  require('../controllers/task.controller');
const CompanyController    =  require('../controllers/company.controller');
const UploadController    =  require('../controllers/upload.controller');


router.post('/auth/login', AuthController.login);
router.post('/auth/signup',  AuthController.register);
router.post('/auth/vendor/signup',  AuthController.vendorRregister);
router.post('/auth/forgotPassword',  AuthController.forgotPassword);
router.post('/auth/otpVerify',  AuthController.otpVerify);
router.post('/auth/passwordUpdate', AuthController.passwordUpdate);
router.post('/auth/changePassword', authorize, AuthController.changePassword);
router.put('/auth/updateProfile', authorize, AuthController.updateProfile);
router.post('/useraddress/create',  UserController.createAddress);
router.get('/useraddress/list', authorize,  UserController.getUserAddressList);
router.put('/useraddress/update/:id',  UserController.updateUserAddress);
router.delete('/useraddress/delete/:id',  UserController.delUserAddress);
router.post('/useraddress/generateotp',  UserController.generateAddressOtp);
router.post('/verifyaddress',  UserController.verifyAddress);
router.post('/user/kyc',  UserController.createKyc);
router.get('/user/kyc/list',  UserController.getUserKycList);
router.get('/vendors',  UserController.vendorList);
router.get('/users',  UserController.userList);
router.delete('/user/delete/:id',  UserController.deleteUser);
router.post('/user/bankDetails',  UserController.createAndUpdateBankDetails);
router.get('/user/bank/list', authorize, UserController.getUserBankList);
router.post('/settings/billingAddress', authorize,  UserController.createAndUpdateBillingAddress);
router.get('/settings/billingAddress/list', authorize, UserController.getSettingBillingList);
router.post('/settings/invoice', authorize,  UserController.createAndUpdateSettingsInvoice);
router.get('/settings/invoice/list', authorize, UserController.getSettingInvoiceList);

router.get('/order/list', authorize, OrderController.getOrderList);
router.get('/location/:pincode',  OrderController.getLocationBypinCode);
router.get('/states',  OrderController.getAllStates);
router.get('/countries',  OrderController.getAllCountries);
router.post('/order/create',  OrderController.createOrder);
router.post('/order/cancel',  OrderController.cancelOrder);
router.post('/ship/price-list', authorize, ShipmentController.priceList);
router.post('/ship/courier-list', authorize, ShipmentController.courierList);
router.post('/ship/create-shipment',  ShipmentController.createShipment);
router.get("/wallet/balance/:userId", WalletController.getWalletBalance);
router.post('/ship/cancel-shipment',  ShipmentController.cancelShipment);
router.post('/ship/track-shipment',  ShipmentController.trackShipment);
router.post('/ship/calculator',  ShipmentController.shipmentCalculator);

router.post('/order/return',  OrderController.returnOrder);
router.get('/order/return/list',  OrderController.getReturnOrderList);
router.post('/company/create',  CompanyController.createAndUpdateCompany);
router.get('/company/list', authorize,  CompanyController.getCompanyList);
router.post('/labels/configuration', authorize,  CompanyController.createAndUpdateLabels);
router.get('/labels/list', authorize,  CompanyController.getLabelsList);
router.post('/settings', authorize,  CompanyController.createAndUpdateSettings);
router.get('/settings/list', authorize, CompanyController.getSettingsList);


router.get('/products/list',  ProductController.getProductList);

router.post("/task", TaskController.createTask);
router.get("/tasks", TaskController.getAllTasks);
router.get("/task/:id", TaskController.getTaskById);
router.put("/task/:id", TaskController.updateTask);
router.delete("/task/:id", TaskController.deleteTask);
router.post("/upload", UploadController.uploadImage);

module.exports = router;