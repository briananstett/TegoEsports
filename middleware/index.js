function requireLogin(req, res, next){
    if(req.session){
        return next();
    }else{
        var error = new Error("You Must Be Logged In");
        error.status = 701;
        next(error);
    }
}

module.exports.requireLogin = requireLogin;