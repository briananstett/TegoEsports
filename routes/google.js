const express = require('express');
const router = express.Router();

//Require Controller Modules
var googleController = require('../controllers/google');

//AjAX from google calls this route to store code
router.get('/authorize', googleController.authorize_get);
router.get('/callback', googleController.callback_get);



module.exports = router;