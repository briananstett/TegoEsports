var appVariables={
    imageRequest:'http://35.190.142.192:2375/v1.32/images/json',
    whaleIP:"servers.tegoesports.com",
    stopContainerURI: function(id){
        return `http://35.190.142.192:2375/v1.32/containers/${id}/stop`;
    },
    startContainerURI: function(id){
        return `http://35.190.142.192:2375/v1.32/containers/${id}/start`;
    },
    restartContainerURI: function(id){
        return `http://35.190.142.192:2375/v1.32/containers/${id}/restart?t=3`;
    },
    removeContainerURI: function(id){
        return `http://35.190.142.192:2375/v1.32/containers/${id}?v=true&force=true`;
    },
    inspectContainerURI : function(id){
        return `http://35.190.142.192:2375/v1.32/containers/${id}/json`
    },
    createContainerURI : function(containerName){
        if(containerName){
            return `http://35.190.142.192:2375/v1.32/containers/create?name=${containerName.trim()}`;
        }else{
            return 'http://35.190.142.192:2375/v1.32/containers/create';
        }

    }
}
module.exports.appVariables = appVariables;


