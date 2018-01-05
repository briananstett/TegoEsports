const express = require('express');
const router = express.Router();

//Require Controller Modules
var discordController = require('../controllers/discord');

//HomePage Routes

/* GET tego homePage */
router.get('/authorize', discordController.authroize);
router.get('/callback', discordController.callback_get);




module.exports = router;