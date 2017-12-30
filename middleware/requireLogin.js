//This middleware function requires a logged in users
module.exports = function (req, res, next){
    if(req.session.userId){
        return next();
    }else{
        var error = new Error("You Must Be Logged In");
        error.status = 701;
        next(error);
    }
}