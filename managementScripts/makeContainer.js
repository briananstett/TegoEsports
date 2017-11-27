var Container = require('./models/user').container;
var User = require('./models/user').user;
var Port = require('./models/user').port;

var newAdd = {
    dateCreated: new Date,
    Name: "",
    ID: '0d149a674ddda25cfe4c1634137c475dc088f20fcd98db6ffbbf2dd30d1ac877',
    User: '5a1aeb7f34bb61058415cabc',
    exposedPort: '5a1af11985c6c205c298c16a',
    image: 'itzg/minecraft-server:latest'    
}


Container.create(newAdd, function(error, container){
    if(error){
        console.error(error);
        return 0
    }else{
        User.findById(container.User, function(error, user){
            user.containers.push(container._id);
            user.save(function(error, updatedUser){
                if(error){console.log("error while saving");}
            })
        });
        Port.findByIdAndUpdate(container.exposedPort,{$set : {'available': false, 
        'container': container._id}}, function(error, updatedPort){
            if(error){console.log("There was an while updating port")}
        });
    }
});