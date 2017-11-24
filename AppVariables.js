var appVariables={
    imageRequest:'http://35.190.142.192:2375/v1.32/images/json',
    whaleIP:"servers.tegoesports.com",
    stopContainerURI: function(id){
        return `http://35.190.142.192:2375/v1.32/containers/${id}/stop`;
    },
    startContainerURI: function(id){
        return `http://35.190.142.192:2375/v1.32/containers/${id}/start`;
    },
    inspectContainerURI : function(id){
        return `http://35.190.142.192:2375/v1.32/containers/${id}/json`
    },
    createContainerURI : 'http://35.190.142.192:2375/v1.32/containers/create' 
}
module.exports.appVariables = appVariables;


