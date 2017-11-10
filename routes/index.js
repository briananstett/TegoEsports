const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var middle = require('../middleware');
var userModel = require('../models/user');

/*      Routes for index        */
router.get('/', function(req, res, next){
    return res.render('index');
});

/*      Routes for login       */
router.get('/login', function(req, res, next){
    return res.render('login', {title: 'Login'});
});
router.post('/login', function(req, res, next){
    userModel.authenticate(req.body.username, req.body.password, function(error, user){
        if(error){
            return next(error);
        }else{
            req.session.brian ="Brian";
            req.session.userId = user._id;
            return res.redirect('/docker');
        }
    });
});

/*      Routes for Team Members       */
router.get('/team-members', function(req, res, next){
    req.session.david="David1";
    userModel.test(function(req,res,next){
        
    })
    return res.render('teamMembers', {title: 'Team-Members'});
});

/*      Routes for register       */
// router.get('/register', function(req, res, next){
//     return res.render('teamMembers', {title: 'Team-Members'});
// });

/*      Routes for docker      */
router.get('/docker', function(req, res, next){
    userModel.getContainers(req.session.userId,function(error, userContainers){
        if(error){
            return next(error)
        }else{
            console.log(userContainers);
            //req.session.containers=userContainers.containers[0];
            return res.render('docker',{containers: userContainers});
            
        }
    });

});

router.get('/test', function(req, res, next){
    var newContainer = {
        dateCreated: new Date,
        createdStatus: false,
        startStatus: false,
        Name: "Test Container",
        ID: "000000",
        exposedPorts: "",
        image: "test"
    };    
    userModel.createContainer(req.session.userId,newContainer, function(error, updatedUser){
        if(error){
            return next(error)
        }else{
            return res.redirect('/docker');
        }
    });

});



module.exports =router;

