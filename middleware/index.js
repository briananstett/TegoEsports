var request = require('request');
var appVariables = require('../AppVariables').appVariables;
var userModel = require('../models/user').user;
var containerModel = require('../models/user').container;
var parseInspectJSON = require('../containers').parseInspectJSON;
var imageToPicture = require('../containers').imageToPicture;
function requireLogin(req, res, next){
    if(req.session.userId){
        console.log("You have been Authenticated");
        return next();
    }else{
        var error = new Error("You Must Be Logged In");
        error.status = 701;
        next(error);
    }
}

function getDockerImages(req, res, next){
    var filteredImages =[];
    var options = {
        url: appVariables.imageRequest
    };
    request(options, function(error, response,body){
        if (!error && response.statusCode == 200) {
            JSON.parse(body).forEach(function(image) {
                filteredImages.push({
                    ID: image.Id,
                    imageTag : image.RepoTags[0]
                });
            });
            res.locals.dockerImages= filteredImages;
            return next();
        }
        if(error){
            return next(error);
        } 
    });
}


function getUserContainers(req, res, next){
    //array to hold the users container information after parsing through the JSON
    var userContainersDocker = [];
    //Get the container ID's for all the user's containers
    containerModel.getContainers(req.session.userId,function(error, userContainers){
        if(error){
            //catch any errors from the model static function
            next(error);
        }
        //MY stupid way to deal with asynchronus programming
        var noContainers = userContainers.length;
        var noCallbacks = 0;
        function wait(){
            noCallbacks +=1;
            if (noCallbacks == noContainers){
                res.locals.userContainersDocker = userContainersDocker;
                res.locals.whaleIP=appVariables.whaleIP;
                //only move onto the next middleware function after all requests return
                next();
            }
        }
        if(userContainers.length >0){
        //loop through all the users containers that were returned from the database
            userContainers.forEach(function(container){
                var options = {
                    url: appVariables.inspectContainerURI(container.ID)
                }
                request(options, function(error, response, body){
                    if (!error && response.statusCode == 200){
                        var parsedJson = JSON.parse(body);
                        userContainersDocker.push({
                            Id: parsedJson.Id,
                            image: imageToPicture(parsedJson.Config.Image),
                            name: parsedJson.Name,
                            status : parsedJson.State.Status,
                            ports : parseInspectJSON(parsedJson.Config.Image,parsedJson.HostConfig.PortBindings)

                        });
                    }else{
                        var error = new Error("Error while making docker API call: /v1.32/containers/id/json");
                        error.statusCode = 706;
                        next(error);
                    }
                    wait();
                });
            });
        }else{
            next();
        }
    });
}


module.exports.requireLogin = requireLogin;
module.exports.getDockerImages = getDockerImages;
module.exports.getUserContainers = getUserContainers;