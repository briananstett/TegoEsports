var request = require('request');
var appVariables = require('../AppVariables').appVariables;
var options = {
    url: appVariables.imageRequest,
};
function requireLogin(req, res, next){
    console.log('here');
    if(req.session.userId){
        return next();
    }else{
        var error = new Error("You Must Be Logged In");
        error.status = 701;
        next(error);
    }
}

function getDockerImages(req, res, next){
    request(options, function(error, response,body){
        if (!error && response.statusCode == 200) {
            res.locals.dockerImages= JSON.parse(body);
            next();
        }
        if(error){
            next(error);
        } 
});
}

module.exports.requireLogin = requireLogin;
module.exports.getDockerImages = getDockerImages;