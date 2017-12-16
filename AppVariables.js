var appVariables={
    imageRequest:'https://35.190.142.192:51423/v1.32/images/json',
    whaleIP:"servers.tegoesports.com",
    stopContainerURI: function(id){
        return `https://35.190.142.192:51423/v1.32/containers/${id}/stop`;
    },
    startContainerURI: function(id){
        return `https://35.190.142.192:51423/v1.32/containers/${id}/start`;
    },
    restartContainerURI: function(id){
        return `https://35.190.142.192:51423/v1.32/containers/${id}/restart?t=3`;
    },
    removeContainerURI: function(id){
        return `https://35.190.142.192:51423/v1.32/containers/${id}?v=true&force=true`;
    },
    inspectContainerURI : function(id){
        return `https://35.190.142.192:51423/v1.32/containers/${id}/json`
    },
    createContainerURI : function(containerName){
        if(containerName){
            return `https://35.190.142.192:51423/v1.32/containers/create?name=${containerName.trim()}`;
        }else{
            return 'https://35.190.142.192:51423/v1.32/containers/create';
        }

    }
}
module.exports.appVariables = appVariables;


