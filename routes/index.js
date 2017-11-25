const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var middle = require('../middleware');
var userModel = require('../models/user').user;
var portModel = require('../models/user').port;
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
            return res.redirect('/docker');
        }
    });
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
    console.log("in docker route");
    console.log(res.locals.dockerImages);
    console.log(res.locals.userContainersDocker);
    return res.render('docker');

});
router.get('/docker/:action', middle.requireLogin, function(req, res, next){
    const action = req.params.action;
    const id = req.query.id;
    const imageID = req.query.imageID;
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
                uri: appVariables.startContainerURI(id)
                }, function(error, response, body){
                    console.log(response.statusCode);
                    if (!error && response.statusCode == 204){
                        console.log("no errors, should redirct")
                        return res.redirect('/docker');
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
                    //remove container from user's subdocuments
                    return res.redirect('/docker');    
                }else{
                    console.log("error while deleting");
                }
            });
            break;
        case "restart":
        request.post(
            {
            uri: appVariables.restartContainerURI(id)
            }, function(error, response, body){
                console.log(response.statusCode);
                if (!error && response.statusCode == 204){
                    console.log("no errors, should redirct")
                    return res.redirect('/docker');
                }else{
                    var parsedBody = JSON.parse(body);
                    var error = new Error("There was a problem while starting your container.\n" + parsedBody.message);
                    next(error);
                }
        });
            break;
        case "create":
            console.log(imageID);
            portModel.getAvailablePort(function(error, port){
                if(error){
                    return next(error);
                };
                console.log(createContainerJSON(imageID, port.portNumber));
                request.post(
                    {
                    uri: appVariables.createContainerURI,
                    headers: {
                        "Content-Type": "application/json"
                     },
                     body: createContainerJSON(imageID, port.portNumber)
                    }, function(error, response, body){
                        console.log(response.statusCode);
                        if (!error && response.statusCode == 201){
                            console.log("Container created, next step, start container");
                            var parsedJson = JSON.parse(body);
                            port.available = false;
                            port.save();
                            userModel.createContainer(req.session.userId,{
                                dateCreated: new Date,
                                Name: null,
                                ID: parsedJson.Id,
                                exposedPorts: port._id,
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
                                        return res.redirect('/docker');
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



router.get('/create-container', function(req, res, next){
    portModel.getAvailablePort(function(error, port){
        if(error){console.error(error);}
        var containerSubdocumnet = {
            dateCreated: new Date,
            Name: "/mc",
            ID: "7a0f380ec3081b036f22da65b6cb7e5bbfb5635b8878ed3d7cb5ddd792385757",
            exposedPorts: port._id,
            image: "itzg/minecraft-server"
        };
        console.log(containerSubdocumnet);  
        userModel.createContainer(req.session.userId,containerSubdocumnet, function(error, updatedUser){
            if(error){
                return next(error)
            }else{
                return res.redirect('/docker');
            }
        });  
    })
    
    // var containerSubdocumnet = {
    //     dateCreated: new Date,
    //     Name: "test",
    //     ID: "5c5a8a4bd95a605b90de92bced64795983bd30dd791a84139be8db8f10a0fc48",
    //     exposedPorts: '5a186980b3abaa005065a69e',
    //     image: "itzg/minecraft-server"
    // };    
    // userModel.createContainer(req.session.userId,containerSubdocumnet, function(error, updatedUser){
    //     if(error){
    //         return next(error)
    //     }else{
    //         return res.redirect('/docker');
    //     }
    // });

});



module.exports =router;

