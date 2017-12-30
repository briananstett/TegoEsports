// Require Models
var userModel = require('../models/user');
// Controller Functions

/* Render HomePage */
module.exports.index= function(req, res, next){
    return res.render('index');
}

/* Login to tego site */
module.exports.login_post = function(req, res, next){
    userModel.authenticate(req.body.username, req.body.password, function(error, user){
        if(error){
            return next(error);
        }else{
            req.session.userId = user._id;
            return res.redirect('/saas');
            // return res.redirect('/saas');
        }
    });
}

/* Logout of the site */
module.exports.logout_get = function(req, res, next){
    if(req.session.userId){
        req.session.destroy(function(error){
            if(error){
                next(error);
            }else{
                return res.redirect('/');
            }
        })
    }else{
        return res.redirect('/');
    }    
}

/* Render page with more information about servers as a service */
module.exports.servers_as_a_service_get = function(req, res, next){
    return res.render('servers', {title: 'Servers as a Service'});
}