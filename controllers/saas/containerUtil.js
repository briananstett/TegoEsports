var userModel = require('../../models/user');
var containerModel = require('../../models/container');
var fs = require('fs');
var path = require('path');
//creates the JSON object used to the container
//Dynamically generated based on the differnet images
module.exports.createContainerJSON = function (image, exposedPort){
    var createJSON = {
        Image: image,
    };
    switch(image) {
        //create JSON for minecraft
        case "itzg/minecraft-server:latest":
        case "itzg/minecraft-server":
            createJSON.Env = ["EULA=TRUE"];
            createJSON.ExposedPorts = {
                "25565/tcp" : {}
            };
            createJSON.HostConfig = {
                PortBindings :{
                    "25565/tcp" :[
                        {HostPort : `${exposedPort}`}
                    ]
                }
            }
        return JSON.stringify(createJSON);
        break;
    }

/* Finds the correct image for the container image */
}
module.exports.imageToPicture = function (containerImage){
    switch(containerImage) {
        case "itzg/minecraft-server:latest":
        case "itzg/minecraft-server":
            return 'static/images/minecraft.png'
    }    
}

module.exports.parseInspectJSON = function (image, inspectJSON){
    switch(image) {
        case "itzg/minecraft-server:latest":
        case "itzg/minecraft-server":
            return inspectJSON['25565/tcp'][0]['HostPort'];
    }    
}

/* REST URL for requesting all images */
module.exports.imageRequest = 'https://35.231.63.38:51423/v1.32/images/json';

/* IP address of Docker server*/
module.exports.whaleIP = "servers.tegoesports.com";

/* returns REST URL for stopping a container */
module.exports.stopContainerURI = function(id){
    return `https://35.231.63.38:51423/v1.32/containers/${id}/stop`;
}

/* returns REST URL for starting a container */
module.exports.startContainerURI = function(id){
    return `https://35.231.63.38:51423/v1.32/containers/${id}/start`;
};

/* returns REST URL for restarting a container */
module.exports.restartContainerURI = function(id){
    return `https://35.231.63.38:51423/v1.32/containers/${id}/restart?t=3`;
};

/* returns REST URL for removing a container */
module.exports.removeContainerURI = function(id){
    return `https://35.231.63.38:51423/v1.32/containers/${id}?v=true&force=true`;
};

/* returns REST URL for inspecting a single container */
module.exports.inspectContainerURI = function (id){
    return `https://35.231.63.38:51423/v1.32/containers/${id}/json`
};

/* returns REST URL for creating a single container */
module.exports.createContainerURI = function(containerName){
    if(containerName){
        return `https://35.231.63.38:51423/v1.32/containers/create?name=${containerName.trim()}`;
    }else{
        return 'https://35.231.63.38:51423/v1.32/containers/create';
    }

};



