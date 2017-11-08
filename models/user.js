var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

//For testing, create connection
mongoose.connect('mongodb://localhost/TeGoEsports');

//new schema
var Containers = new mongoose.Schema({
    dateCreated: Date,
    createdStatus: Boolean,
    startStatus: Boolean,
    Name: String,
    ID: String,
    exposedPorts: String,
    image: String
});
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
        required: true
    },
    updated: {
        type: Date,
        default: Date.now
    },
    containers: [Containers]
});
//Check passwords
UserSchema.statics.authenticate = function(username, password, cb){
    this.findOne({username:username}, function(error, user){
        if(error){
            return cb(error); 
        }else if(!user){
            var error = new Error("Username Doesn't exist");
            error.status = 701;
            return cb(error);
        }else{
            bcrypt.compare(password, user.password, function(error, result){
                if(result === true){
                    return callback(null, user);
                }else{
                    var error = new Error("Password don't match");
                    error.status = 702;
                    return cb(error);
                }
            });
        }
    });
} 

//Pre method, changes plain text password to hash
UserSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password, 10, function(error, hash){
        if(error){
            return next(error);
        }else{
            user.password = hash;
            next()
        }
    });
});

//Schema to model
var user = mongoose.model('user', UserSchema);
module.exports = user;
