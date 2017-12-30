var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userModel = require('./user');
var portModel = require('./port');
var ObjectId = require('mongoose').Types.ObjectId;

//Container Schema
var Containers = new mongoose.Schema({
    dateCreated: Date,
    Name: String,
    ID: String,
    User:{type:Schema.Types.ObjectId, ref: 'user'},
    exposedPort: {type:Schema.Types.ObjectId, ref: 'port'},
    image: String
});

//Model buisness logic
//Create a new container in the database
Containers.statics.createContainer = function(containerObject, cb){
    //create a new container from the passed containerObject
    this.create(containerObject, function(error, container){
        if(error){
            //error while creating new container object, pass to callback
            return cb(error);
        }else{
            //container created successfully
            //need to update relationships

            //User Model Relationship Update
            userModel.findById(container.User, function(error, user){
                if(error){
                    //There was an error while trying to find a user
                    return cb(error);
                }else{
                    user.containers.push(container._id);
                    user.save(function(error, updatedUser){
                        if(error){
                            //error while saing new container ID
                            console.log("error while saving");
                            return cb(error);
                        }
                    });
                }
            });
            //Port Model Relationships Update
            portModel.findByIdAndUpdate(container.exposedPort,{$set : {'available': false, 
            'container': container._id}}, function(error, updatedPort){
                if(error){
                    //There was an error while updating
                    return cb(error);
                }
            });
        }
    });
}
//Delete container from the database
Containers.statics.deleteContainer = function(containerID, cb){
    this.findOne({'ID': containerID},function(error, foundContainer){
        if(error){
            //Error while trying to find a container
            return cb(error);
        }else{
            //if we find a container by id, remove it
            foundContainer.remove();
            //update relationships
            userModel.update({_id:foundContainer.User}, {$pull : {containers: new ObjectId(foundContainer._id)}}, function(error, updatedUser){
                if(error){
                    console.log("there was an error");
                    return cb(error);
                }
            });
            portModel.findById(foundContainer.exposedPort,function(error, foundPort){
                    if (error){
                        return cb(error);
                    }else{
                        foundPort.available=true;
                        foundPort.container=null;
                        foundPort.save();
                        
                    }
                });
            //All relationships updated, return to callback
            return cb()
        }
    });
}
//Retrieve all containers from database a user owns
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
var container = mongoose.model('container', Containers);
module.exports = container;