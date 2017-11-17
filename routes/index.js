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
    return res.render('teamMembers', {title: 'Team-Members'});
});

/*      Routes for docker      */
router.get('/docker', middle.requireLogin, middle.getDockerImages, middle.getUserContainers, function(req, res, next){
    console.log("in docker route");
    console.log(res.locals.dockerImages);
    console.log(res.locals.userContainersDocker);
    return res.render('docker');

});
router.get('/docker/:action', middle.requireLogin, function(req, res, next){
    console.log("action");
    const action = req.params.action;
    console.log(action);
    res.render('/teamMembers');
});



router.get('/create-container:imageID', function(req, res, next){
    
    var newContainer = {
        dateCreated: new Date,
        createdStatus: true,
        startStatus: true,
        Name: "/mc",
        ID: "7a0f380ec3081b036f22da65b6cb7e5bbfb5635b8878ed3d7cb5ddd792385757",
        exposedPorts: "",
        image: "itzg/minecraft-server"
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

