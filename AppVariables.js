var appVariables={
    imageRequest:'http://35.190.142.192:2375/images/json',
    whaleIP:"servers.tegoesports.com",
    stopContainerURI: function(id){
        return `http://35.190.142.192:2375/v1.32/containers/${id}/stop`;
    },
    startContainerURI: function(id){
        return `http://35.190.142.192:2375/v1.32/containers/${id}/start`;
    } 
}
var inspectContainerURI = function(id){
    return `http://35.190.142.192:2375/v1.32/containers/${id}/json`
}
module.exports.appVariables = appVariables;
module.exports.inspectContainerURI;

