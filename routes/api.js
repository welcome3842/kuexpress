const express = require('express');
const router = express.Router(); 
const authorize    =  require('../middleware/authorize'); 
const AuthController    =  require('../controllers/auth.controller'); 

router.post('/auth/login', AuthController.login);
router.post('/auth/signup',  AuthController.register); 

module.exports = router;    