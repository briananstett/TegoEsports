var port = require('./models/user').port;

var newAdd = {
    available: false,
    portNumber: 35566,
    container: null
}


port.create(newAdd, function(error, user){
    if(error){
        console.error(error);
        return 0
    }else{
        console.dir(user);
        return 0
    }
});