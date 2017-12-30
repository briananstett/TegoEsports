const express = require('express');
const router = express.Router();

//Require Controller Modules
var teamMemberController = require('../controllers/teamMembers');
//Team members route page

/* GET request to view the team member page */
router.get('/', teamMemberController.teamMembers_get);


module.exports = router;