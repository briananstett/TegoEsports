var fs = require('fs');
var path =require('path');
var request = require('request');
var containerUtil = require('../saas/containerUtil');

// Require Models
var portModel = require('../../models/port');
var containerModel = require('../../models/container');
/* Render Saas homge page */
module.exports.saas_get = function(req, res, next){
    return res.render('saas');
}

/* GET Request to create new container */
module.exports.saas_create_get= function(req, res, next){
    console.log("made it");
    var containerName = req.query.containerName;
    var imageID = req.query.imageID;
    portModel.getAvailablePort(function(error, port){
        if(error){
            return next(error);
        };
        request.post(
            {
            uri: containerUtil.createContainerURI(containerName),
            cert:fs.readFileSync(path.join(__dirname,'../saas/keys/cert.pem')),
            key: fs.readFileSync(path.join(__dirname,'../saas/keys/key.pem')),
            ca: fs.readFileSync(path.join(__dirname,'../saas/keys/ca.pem')),
            headers: {
                "Content-Type": "application/json"
             },
             body: containerUtil.createContainerJSON(imageID, port.portNumber)
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
                        uri: containerUtil.startContainerURI(parsedJson.Id),
                        cert:fs.readFileSync(path.join(__dirname,'../saas/keys/cert.pem')),
                        key: fs.readFileSync(path.join(__dirname,'../saas/keys/key.pem')),
                        ca: fs.readFileSync(path.join(__dirname,'../saas/keys/ca.pem'))
                        }, function(error, response, body){
                            if (!error && response.statusCode == 204){
                                return res.redirect('/saas');
                            }
                    });
                }else{
                    return next(error);
                }
        });
    });
}

/* GET Request to stop a container */
module.exports.saas_stop_get = function(req, res, next){
    var id = req.query.id;
    request.post(
        {
        uri: containerUtil.stopContainerURI(id),
        cert:fs.readFileSync(path.join(__dirname,'../saas/keys/cert.pem')),
        key: fs.readFileSync(path.join(__dirname,'../saas/keys/key.pem')),
        ca: fs.readFileSync(path.join(__dirname,'../saas/keys/ca.pem'))
        }, function(error, response, body){
            if (!error && response.statusCode == 204){
                return res.redirect('/saas');
            }
    });
}

/* GET Request to start a containerl*/
module.exports.saas_start_get = function(req, res, next){
    var id = req.query.id;
    request.post(
        {
        uri: containerUtil.startContainerURI(id),
        cert:fs.readFileSync(path.join(__dirname,'../saas/keys/cert.pem')),
        key: fs.readFileSync(path.join(__dirname,'../saas/keys/key.pem')),
        ca: fs.readFileSync(path.join(__dirname,'../saas/keys/ca.pem'))
        }, function(error, response, body){
            if (!error && response.statusCode == 204){
                return res.redirect('/saas');
            }else{
                var parsedBody = JSON.parse(body);
                var error = new Error("There was a problem while starting your container.\n" + parsedBody.message);
                next(error);
            }
        });    
}

/* GET request to remove a container*/
module.exports.saas_remove_get = function(req, res, next){
    var id = req.query.id;
    request.delete({
        uri:containerUtil.removeContainerURI(id),
        cert:fs.readFileSync(path.join(__dirname,'../saas/keys/cert.pem')),
        key: fs.readFileSync(path.join(__dirname,'../saas/keys/key.pem')),
        ca: fs.readFileSync(path.join(__dirname,'../saas/keys/ca.pem'))
    },function(error, response, body){
        if(!error && response.statusCode == 204){
            containerModel.deleteContainer(id, function(error){
                if(error){
                    next(error)
                }else{
                    return res.redirect('/saas');   
                }
            }) 
        }else{
        }
    });
}

/* GET request to restart a container */
module.exports.saas_restart_get = function(req, res, next){
    var id = req.query.id;
    request.post({
        uri: containerUtil.restartContainerURI(id),
        cert:fs.readFileSync(path.join(__dirname,'../saas/keys/cert.pem')),
        key: fs.readFileSync(path.join(__dirname,'../saas/keys/key.pem')),
        ca: fs.readFileSync(path.join(__dirname,'../saas/keys/ca.pem'))
    }, function(error, response, body){
            if (!error && response.statusCode == 204){
                return res.redirect('/saas');
            }else{
                var parsedBody = JSON.parse(body);
                var error = new Error("There was a problem while starting your container.\n" + parsedBody.message);
                next(error);
            }
    });
}
