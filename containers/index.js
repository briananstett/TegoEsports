const create = {
    minecraft : function(exposedPort){
        return `{
        "Image": "itzg/minecraft-server",
        "Env": [
            "EULA=TRUE"
        ],
        "ExposedPorts": {
        "25565/tcp": { }
        },
        "HostConfig": {
            "PortBindings": {
                "25565/tcp": [
                    {
                    "HostPort": "${exposedPort}"
                    }
                ]
            }
        
        }}`
        
    }
}

module.exports.create = create;

