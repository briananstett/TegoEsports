var user = require('./models/user');

var newAdd = {
    email :" baanstet.oakland.edu",
    username: "shamshock",
    alias: "Brian Anstett",
    password: "password",
}

user.create(newAdd, function(error, user){
    if(error){
        console.log("ERROR");
        console.error(error);
        return 0
    }else{
        console.log("else");
        console.dir(user);
        return 0
    }
});