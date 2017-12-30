const express = require('express');
const router = express.Router();

//Require Controller Modules
var saasController = require('../controllers/saas');

//Require middleware
var requireLogin = require('../middleware/requireLogin');
var getDockerImages = require('../middleware/getDockerImages');
var getUserContainers = require('../middleware/getUserContainers');

//HomePage Routes

/* GET tego homePage */
router.get('/', requireLogin, getDockerImages, getUserContainers, saasController.saas_get);

/* GET create a container*/
router.get('/create', requireLogin, saasController.saas_create_get);

/* GET stop a container*/
router.get('/stop', requireLogin, saasController.saas_stop_get);

/* GET start a container*/
router.get('/start', requireLogin, saasController.saas_start_get);

/* GET remove a container*/
router.get('/remove', requireLogin, saasController.saas_remove_get);

/* Get restart a container*/
router.get('/restart', requireLogin, saasController.saas_restart_get);

module.exports = router;