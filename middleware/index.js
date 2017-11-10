var http = require('http');
var appVariables = require('../AppVariables');
var options = {
    host: appVariables.whaleIP,
    port: appVariables.whalePort,
    path: '/images/json',
    method: 'GET',
    headers: {
        'Content-Type': 'Content-Type:application/json'
      }
}
function requireLogin(req, res, next){
    if(req.session){
        return next();
    }else{
        var error = new Error("You Must Be Logged In");
        error.status = 701;
        next(error);
    }
}
function getDockerImages(req, res, next){
    console.log("Trying regest");
    http.request(options, function(response){
        console.log("made it");
        var body="";
        if(response.statusCode === 200){
            response.on('data', function(data){
                body += data.toString();
            });
            response.on('end', function(){
                try{
                    res.locals.dockerImages= JSON.parse(body);
                }catch(error){next(error)}
            });
        } 
    }).on('error', error => console.error(error))
}

module.exports.requireLogin = requireLogin;
module.exports.getDockerImages = getDockerImages;