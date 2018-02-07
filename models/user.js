var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var ObjectId = require('mongoose').Types.ObjectId;

//For testing, create connection
//mongoose.connect('mongodb://localhost/TeGoEsports');

var UserSchema = new mongoose.Schema({
    email: {
        //Type of field
        type: String,
        //value must be present
        required: false,
        //removes white space before or after the value
        trim: true,
        //value cannot already exist in the database
        unique: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    alias: {
        type: String,
        require: false,
        trim: true
    },
    password: {
        type: String,
        required: false
    },
    updated: {
        type: Date,
        default: Date.now
    },
    containers: [{type:Schema.Types.ObjectId, ref: 'container'}],
    discord_id:String,
    avatar:String
});

//Check passwords
UserSchema.statics.authenticate = function(username, password, cb){
    //first find the user, if there is one
    this.findOne({username:username}, function(error, user){
        if(error){
            return cb(error); 
        }else if(!user){
            var error = new Error("Username Doesn't exist");
            error.status = 701;
            return cb(error);
        //then compare, password with hash
        }else{
            bcrypt.compare(password, user.password, function(error, result){
                if(result === true){
                    return cb(null, user);
                }else{
                    var error = new Error("Password don't match");
                    error.status = 702;
                    return cb(error);
                }
            });
        }
    });
}
UserSchema.statics.new_discord_user = function(new_discord_user, done){
    this.create(new_discord_user, (error, user)=>{
        return done(error, user);
    })
}

UserSchema.statics.discord_authorize = function(discord_id, done){
    this.findOne({id:discord_id}, function(error, user){
        done(error, user);    
    })
}

var user = mongoose.model('user', UserSchema);
module.exports = user;

