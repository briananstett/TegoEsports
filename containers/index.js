
//creates the JSON object used to the container
//Dynamically generated based on the differnet images
function createContainerJSON(image, exposedPort){
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


}
function imageToPicture(containerImage){
    switch(containerImage) {
        //create JSON for minecraft
        case "itzg/minecraft-server:latest":
        case "itzg/minecraft-server":
            return 'static/images/minecraft.png'
    }    
}
function parseInspectJSON(image, inspectJSON){
    switch(image) {
        //create JSON for minecraft
        case "itzg/minecraft-server:latest":
        case "itzg/minecraft-server":
            return inspectJSON['25565/tcp'][0]['HostPort'];
    }    
}

module.exports.create = createContainerJSON;
module.exports.parseInspectJSON = parseInspectJSON;
module.exports.imageToPicture = imageToPicture;
