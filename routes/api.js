const express = require('express');
const router = express.Router();
const authorize    =  require('../middleware/authorize');
const AuthController    =  require('../controllers/auth.controller');
const OrderController    =  require('../controllers/order.controller');
const ShipmentController    =  require('../controllers/shipment.controller');
const UserController    =  require('../controllers/user.controller');

router.post('/auth/login', AuthController.login);
router.post('/auth/signup',  AuthController.register);
router.post('/auth/forgotPassword',  AuthController.forgotPassword);
router.post('/auth/otpVerify',  AuthController.otpVerify);
router.post('/auth/passwordUpdate',  AuthController.passwordUpdate);
router.post('/auth/updateProfile/:id',  AuthController.updateProfile);
router.post('/useraddress/create',  UserController.createAddress);
router.get('/useraddress/list',  UserController.getUserAddressList);
router.put('/useraddress/update/:id',  UserController.updateUserAddress);
router.delete('/useraddress/delete/:id',  UserController.delUserAddress);

router.get('/order/list',  OrderController.getOrderList);
router.post('/order/create',  OrderController.createOrder);
router.post('/ship/price-list',  ShipmentController.priceList);

module.exports = router;