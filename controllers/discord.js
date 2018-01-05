const express = require('express');
var crypto=require('crypto');
var request = require('request');
const router = express.Router();

var client_id = '398568007108132882';
var client_secret= 'wflxepql2UM01L-GPGuhO9eVdeIqsgcg';
module.exports.callback_get = function(req, response, next){
    console.log(req.state);
    var code =req.query.code;
    var state = req.query.state;
    console.log(state);
    request({
        url: 'https://discordapp.com/api/v6/oauth2/token',
        method: 'POST',
        auth: {
          user: client_id,
          pass: client_secret
        },
        form: {
          'grant_type': 'authorization_code',
          'code': code,
          'redirect_uri': 'http://localhost:3000/discord/callback'
        }
      }, function(error, res) {
            console.log("made it back");
            if(error){
                console.log("error");
                console.log(error);
            }
            var json = JSON.parse(res.body);
            console.log("Access Token:", json);
            console.log(`response is: ${res}`);
            response.redirect('/');
      });   
}
module.exports.authroize = function(req, res, next){
  console.log("here");
  var state = (crypto.createHash('md5').update(Math.random().toString(36).slice(2)).digest("hex"));
  req.state = state;
  console.log(req.state);
  return res.redirect(`https://discordapp.com/api/oauth2/authorize?response_type=code&client_id=398568007108132882&scope=identify%20guilds&state=${state}&redirect_uri=http://localhost:3000/discord/callback`);
}