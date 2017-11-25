var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

//For testing, create connection
//mongoose.connect('mongodb://localhost/TeGoEsports');

//new schema
var Containers = new mongoose.Schema({
    dateCreated: Date,
    Name: String,
    ID: String,
    exposedPorts: [{type:Schema.Types.ObjectId, ref: 'port'}],
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
var Port = new mongoose.Schema({
    available: {type: Boolean, required: true},
    portNumber: {type: Number, required: true},
    container: {type: Schema.Types.ObjectId, ref: 'user.containers'}
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
Port.statics.getAvailablePort = function(cb){
    this.findOne({"available":true}, function(error, port){
        if(error){
            cb(error);
        }else if(!port){
            var error = new Error("No available ports on The Whale");
            error.status= 707;
            cb(error);
        }
        else
        cb(null, port);
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
                    var error = new Error("failed User update");
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
        }else if(containers){
            return cb(null, containers.containers);
        }else{
            var error = new Error("No matches found");
            error.startStatus = 705;
            return cb(error);
        }
    })
    
              
}

UserSchema.statics.test = function(cb){
    console.log("callback");
    return cb();
}


//Schema to model
var user = mongoose.model('user', UserSchema);
var port = mongoose.model('port', Port);
module.exports = {user,port};

