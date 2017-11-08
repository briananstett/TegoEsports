const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');

/*      Routes for index        */
router.get('/', function(req, res, next){
    return res.render('index');
});

/*      Routes for login       */
router.get('/login', function(req, res, next){
    return res.render('login', {title: 'Login'});
});

/*      Routes for Team Members       */
router.get('/team-members', function(req, res, next){
    return res.render('teamMembers', {title: 'Team-Members'});
});

/*      Routes for register       */
router.get('/register', function(req, res, next){
    return res.render('teamMembers', {title: 'Team-Members'});
});




module.exports =router;

