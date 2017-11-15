var appVariables={
    imageRequest:'http://35.190.142.192:2375/images/json'  
}
var inspectContainerURI = function(id){
    return `http://35.190.142.192:2375/containers/${id}/json`
}
module.exports.appVariables = appVariables;
module.exports.inspectContainerURI;

