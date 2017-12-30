var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Port Schema
var Port = new mongoose.Schema({
    available: {type: Boolean, required: true},
    portNumber: {type: Number, required: true},
    container: {type: Schema.Types.ObjectId, ref: 'user.containers'}
});
//Port business logic
Port.statics.getAvailablePort = function(cb){
    this.findOne({"available":true}, function(error, port){
        if(error){
            cb(error);
        }else if(!port){
            var error = new Error("No available ports on The Whale");
            error.status= 707;
            cb(error);
        }
        else
        cb(null, port);
    });
}

var port = mongoose.model('port', Port);
module.exports = port;