var user = require('../models/user').user;
var bcrypt = require('bcrypt');

var newAdd = {
    email :"fredericks@gmail.com",
    username: "fredericks",
    alias: "Dr. Eric Frederick",
    password: "password",
}

//hash and salt password
bcrypt.hash(newAdd.password, 10, function(error, hash){
        if(error){
            console.error(error);
        }else{
            newAdd.password=hash;
            user.create(newAdd, function(error, user){
            if(error){
                console.error(error);
                return 0
            }else{
                console.dir(user);
                return 0
            }
});
        }
    });
