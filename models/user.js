var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

//For testing, create connection
//mongoose.connect('mongodb://localhost/TeGoEsports');

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
    console.log("authenticate");
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

UserSchema.statics.createContainer = function(userId, containerObject, cb){
    console.log("model, setContainer method");
    this.findById(userId, function(error, user){
        if(error){
            return cb(error);
        }else if(!user){
            var error = new Error("No results for that userId");
            error.status = 705;     
        }else{
            user.containers.push(containerObject);
            user.save(function(error, updatedUser){
                if(error){
                    var error = new error("failed User update");
                    error.status = 704;
                    return cb(error);
                }else{
                    return cb(null, updatedUser);
                }
            });

        }
    });
}
UserSchema.statics.getContainers = function(userId,cb){
    this.findOne({_id: userId},{containers: true}).lean().exec(function(error, containers){
        if(error){
            var error = new Error("Error while finding container");
            error.status = 703;
            return cb(error);
        }else{
            
            return cb(null, containers.containers);
        }
    })
    
              
}

UserSchema.statics.test = function(cb){
    console.log("callback");
    return cb();
}


//Schema to model
var user = mongoose.model('user', UserSchema);
module.exports = user;
