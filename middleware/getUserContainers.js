var userModel = require('../models/user');
var containerModel = require('../models/container');
var containerUtil = require('../controllers/saas/containerUtil');
var fs = require('fs');
var path =require('path');
var request = require('request');

module.exports = function(req, res, next){
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
                res.locals.whaleIP=containerUtil.whaleIP;
                //only move onto the next middleware function after all requests return
                next();
            }
        }
        if(userContainers.length >0){
        //loop through all the users containers that were returned from the database
            userContainers.forEach(function(container){
                var options = {
                    url: containerUtil.inspectContainerURI(container.ID),
		    cert:fs.readFileSync(path.join(__dirname,'../controllers/saas/keys/cert.pem')),
        	    key: fs.readFileSync(path.join(__dirname,'../controllers/saas/keys/key.pem')),
            	    ca: fs.readFileSync(path.join(__dirname,'../controllers/saas/keys/ca.pem'))
		}
                request(options, function(error, response, body){
                    if (!error && response.statusCode == 200){
                        var parsedJson = JSON.parse(body);
                        userContainersDocker.push({
                            Id: parsedJson.Id,
                            image: containerUtil.imageToPicture(parsedJson.Config.Image),
                            name: parsedJson.Name,
                            status : parsedJson.State.Status,
                            ports : containerUtil.parseInspectJSON(parsedJson.Config.Image,parsedJson.HostConfig.PortBindings)

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