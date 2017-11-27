var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var ObjectId = require('mongoose').Types.ObjectId;

//For testing, create connection
//mongoose.connect('mongodb://localhost/TeGoEsports');

//new schema
var Containers = new mongoose.Schema({
    dateCreated: Date,
    Name: String,
    ID: String,
    User:{type:Schema.Types.ObjectId, ref: 'user'},
    exposedPort: {type:Schema.Types.ObjectId, ref: 'port'},
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
    containers: [{type:Schema.Types.ObjectId, ref: 'container'}]
});
var Port = new mongoose.Schema({
    available: {type: Boolean, required: true},
    portNumber: {type: Number, required: true},
    container: {type: Schema.Types.ObjectId, ref: 'user.containers'}
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
Containers.statics.createContainer = function(containerObject, cb){
    this.create(containerObject, function(error, container){
        if(error){
            return cb(error);
        }else{
            user.findById(container.User, function(error, user){
                user.containers.push(container._id);
                user.save(function(error, updatedUser){
                    if(error){
                        console.log("error while saving");
                        return cb(error);
                    }
                });
            });
            port.findByIdAndUpdate(container.exposedPort,{$set : {'available': false, 
            'container': container._id}}, function(error, updatedPort){
                if(error){console.log("There was an while updating port")}
            });
        }
    });
}
Containers.statics.deleteContainer = function(containerID, cb){
    this.findOne({'ID': containerID},function(error, foundContainer){
        if(error){
            return cb(error);
        }
        foundContainer.remove();
        user.update({_id:foundContainer.User}, {$pull : {containers: new ObjectId(foundContainer._id)}}, function(error, updatedUser){
            if(!error){
            }else{
                console.log("there was an error");
                return cb(error);
            }
        })

        port.findById(foundContainer.exposedPort,function(error, foundPort){
                if (error){
                    return cb(error);
                }else{
                    foundPort.available=true;
                    foundPort.container=null;
                    foundPort.save();
                    
                }
            });
        return cb()
    });
}
Containers.statics.getContainers = function(userId,cb){
    this.find({'User': userId}, function(error, containers){
        if(error){
            var error = new Error("Error while finding container");
            error.status = 703;
            return cb(error);
        }else if(containers){
            return cb(null, containers);
        }else{
            var error = new Error("No matches found");
            error.startStatus = 705;
            return cb(error);
        }
    });              
}

UserSchema.statics.test = function(cb){
    return cb();
}


//Schema to model
var user = mongoose.model('user', UserSchema);
var port = mongoose.model('port', Port);
var container = mongoose.model('container', Containers);
module.exports = {user,port,container};

