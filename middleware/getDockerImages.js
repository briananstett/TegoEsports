var userModel = require('../models/user');
var containerModel = require('../models/container');
var containerUtil = require('../controllers/saas/containerUtil');
var fs = require('fs');
var path =require('path');
var request = require('request');

/* Function that retrieves all available images and assigns them to res variables*/
module.exports = function(req, res, next){
    var filteredImages =[];
    var options = {
        url: containerUtil.imageRequest,
    	cert:fs.readFileSync(path.join(__dirname,'../controllers/saas/keys/cert.pem')),
        key: fs.readFileSync(path.join(__dirname,'../controllers/saas/keys/key.pem')),
        ca: fs.readFileSync(path.join(__dirname,'../controllers/saas/keys/ca.pem'))
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
            next();
        }
        if(error){
            return next(error);
        } 
    });
}