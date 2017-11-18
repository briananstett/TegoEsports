const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var middle = require('../middleware');
var userModel = require('../models/user');
var request = require('request');
var appVariables = require('../AppVariables').appVariables;
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
    const action = req.params.action;
    const id = req.query.id;
    switch(action) {
        case "stop":
        console.log("stop");
            request.post(
                {
                uri: appVariables.stopContainerURI(id),
                }, function(error, response, body){
                    if (!error && response.statusCode == 204){
                        console.log("no errors, should redirct")
                        return res.redirect('/docker');
                    }
            });
            break;
        case "start":
            console.log("Start");
            request.post(
                {
                uri: appVariables.startContainerURI(id),
                }, function(error, response, body){
                    console.log(response.statusCode);
                    if (!error && response.statusCode == 204){
                        console.log("no errors, should redirct")
                        return res.redirect('/docker');
                    }
            });
            break;
        case "remove":
            break;
        case "restart":
            break;
        case "create":
            break
        default:
            var error = new Error("Unknown action was passed to docker");
            error.status = 706;
            return next(error);
    }
});



router.get('/create-container', function(req, res, next){
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

