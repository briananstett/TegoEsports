const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var middle = require('../middleware');
var userModel = require('../models/user').user;
var portModel = require('../models/user').port;
var containerModel = require('../models/user').container;
var createContainerJSON = require('../containers').create;
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
            req.session.userId = user._id;
            return res.redirect('/servers');
        }
    });
});

/*      Routes for Logout             */
router.get('/logout', function(req, res, next){
    if(req.session.userId){
        req.session.destroy(function(error){
            if(error){
                next(error);
            }else{
                res.redirect("/");
            }
        })
    }
});

/*      Routes for Team Members       */
router.get('/team-members', function(req, res, next){
    return res.render('teamMembers', {title: 'Team-Members'});
});

router.get('/servers-as-a-service', function(req, res, next){
        return res.render('servers', {title: 'Servers as a Service'});    
})

/*      Routes for docker      */
router.get('/docker', middle.requireLogin, middle.getDockerImages, middle.getUserContainers, function(req, res, next){
    return res.render('docker');

});
router.get('/servers', middle.requireLogin, middle.getDockerImages, middle.getUserContainers, function(req, res, next){
    return res.render('saas');

});
router.get('/docker/:action', middle.requireLogin, function(req, res, next){
    const action = req.params.action;
    const id = req.query.id;
    const imageID = req.query.imageID;
    const containerName = req.query.containerName;
    switch(action) {
        case "stop":
            request.post(
                {
                uri: appVariables.stopContainerURI(id),
                }, function(error, response, body){
                    if (!error && response.statusCode == 204){
                        console.log("no errors, should redirct")
                        return res.redirect('/servers');
                    }
            });
            break;
        case "start":
            request.post(
                {
                uri: appVariables.startContainerURI(id)
                }, function(error, response, body){
                    if (!error && response.statusCode == 204){
                        return res.redirect('/servers');
                    }else{
                        var parsedBody = JSON.parse(body);
                        var error = new Error("There was a problem while starting your container.\n" + parsedBody.message);
                        next(error);
                    }
            });
            break;
        case "remove":
            request.delete({
                uri:appVariables.removeContainerURI(id)
            },function(error, response, body){
                if(!error && response.statusCode == 204){
                    containerModel.deleteContainer(id, function(error){
                        if(error){
                            next(error)
                        }else{
                            return res.redirect('/servers');   
                        }
                    }) 
                }else{
                }
            });
            break;
        case "restart":
        request.post(
            {
            uri: appVariables.restartContainerURI(id)
            }, function(error, response, body){
                if (!error && response.statusCode == 204){
                    return res.redirect('/servers');
                }else{
                    var parsedBody = JSON.parse(body);
                    var error = new Error("There was a problem while starting your container.\n" + parsedBody.message);
                    next(error);
                }
        });
            break;
        case "create":
            portModel.getAvailablePort(function(error, port){
                if(error){
                    return next(error);
                };
                request.post(
                    {
                    uri: appVariables.createContainerURI(containerName),
                    headers: {
                        "Content-Type": "application/json"
                     },
                     body: createContainerJSON(imageID, port.portNumber)
                    }, function(error, response, body){
                        if (!error && response.statusCode == 201){
                            var parsedJson = JSON.parse(body);
                            containerModel.createContainer({
                                dateCreated: new Date,
                                Name: null,
                                ID: parsedJson.Id,
                                User: req.session.userId,
                                exposedPort: port._id,
                                image: imageID    
                            }, function(error, updatedUser){
                                if(error){
                                    return next(error);
                                }
                            });
                            //start Container
                            request.post(
                                {
                                uri: appVariables.startContainerURI(parsedJson.Id)
                                }, function(error, response, body){
                                    if (!error && response.statusCode == 204){
                                        return res.redirect('/servers');
                                    }
                            });
                            
                        }else{
                            return next(error);
                        }
                });

            });
            break
        default:
            var error = new Error("Unknown action was passed to docker");
            error.status = 706;
            return next(error);
    }
});
module.exports =router;

