var request = require('request');

module.exports.getUser = function(accessToken, callback){
    request({
        url: 'https://discordapp.com/api/users/@me',
        auth: {
            'bearer': accessToken
        }
    }, function(error, res){
        if(error){
            callback(error);
        }else{
            callback(null, res);
        }
    })
}