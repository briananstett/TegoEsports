const express = require('express');
const router = express.Router();

router.use('/', require('./home'));
router.use('/saas', require('./saas'));
router.use('/team-members', require('./teamMembers'));
router.use('/discord', require('./discordCallback'));


module.exports = router;