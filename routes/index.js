const express = require('express');
const router = express.Router();

router.use('/', require('./home'));
router.use('/saas', require('./saas'));
router.use('/team-members', require('./teamMembers'));


module.exports = router;