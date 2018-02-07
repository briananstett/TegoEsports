var request = require('request');
var crypto=require('crypto');
// Require Models
// Controller Functions

/* Render HomePage */
var client_id='215712698920-u9s91jupvpol0pqt68mjk2n5q7slguqa.apps.googleusercontent.com';
var client_secret = '76Ayzfhy0LmjkHbPJ9Dr4xEi';
module.exports.authorize_get= function(req, res, next){
    console.log('redirect to auth');
    var state = (crypto.createHash('md5').update(req.cookies['connect.sid']).digest("hex"));
    return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=215712698920-u9s91jupvpol0pqt68mjk2n5q7slguqa.apps.googleusercontent.com&redirect_uri=http://tegoesports.com/google/callback&scope=https://www.googleapis.com/auth/admin.directory.customer.readonly&response_type=code&state=${state}`);
}

module.exports.callback_get= function(req, response, next){
    console.log("oauth callback, exchange code for tocken");
    if(crypto.createHash('md5').update(req.cookies['connect.sid']).digest("hex") === req.query.state){
        var code = req.query.code;
        request({
            url: 'https://www.googleapis.com/oauth2/v4/token',
            method: 'POST',
            form: {
                'code': code,
                'client_id': client_id,
                'client_secret': client_secret,
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': 'http://tegoesports.com/google/callback'
            }
          }, function(error, res) {
                if(error){
                  response.redirect('/');
                }
                var responseJSON = JSON.parse(res.body);
                req.session.userId= responseJSON.access_token;
                req.session.access_token= responseJSON.access_token;
                req.session.oauth = {
                    'provider': 'google',
                    'expires_in': responseJSON.expires_in
                }
                response.redirect('/');
                
          });
    }else{
        //Request has been tampered with
        res.redirect('/');
    }
}
