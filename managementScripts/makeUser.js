var user = require('../models/user');
var bcrypt = require('bcrypt');

var newAdd = {
    username: "shamshock2",
    password: "password",
    discord_id: "131043548433874946",
}

//hash and salt password
// bcrypt.hash(newAdd.password, 10, function(error, hash){
//         if(error){
//             console.error(error);
//         }else{
//             newAdd.password=hash;
//             user.create(newAdd, function(error, user){
//             if(error){
//                 console.error(error);
//                 return 0
//             }else{
//                 console.dir(user);
//                 return 0
//             }
// });
//         }
//     });



user.create(newAdd, function(error, user){
    if(error){
        console.error(error);
        return 0
    }else{
        console.dir(user);
        return 0
    }
})
