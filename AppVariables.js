var appVariables={
    imageRequest:'http://35.190.142.192:2375/images/json',
    whaleIP:"35.190.142.192" 
}
var inspectContainerURI = function(id){
    return `http://35.190.142.192:2375/containers/${id}/json`
}
module.exports.appVariables = appVariables;
module.exports.inspectContainerURI;

