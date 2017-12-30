const express = require('express');
const router = express.Router();

//Require Controller Modules
var homeController = require('../controllers/home');

//HomePage Routes

/* GET tego homePage */
router.get('/', homeController.index);

/* POST request to login */
router.post('/login', homeController.login_post);

/* GET request to logout */
router.get('/logout',homeController.logout_get);

/* GET request for saas info */
router.get('/servers-as-a-service', homeController.servers_as_a_service_get);



module.exports = router;