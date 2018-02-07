const express = require('express');
var crypto=require('crypto');
var request = require('request');
const router = express.Router();
var cookieParser = require('cookie-parser');

var discord = require('./discord/discordUtils');
var client_id = '398568007108132882';
var client_secret= 'wflxepql2UM01L-GPGuhO9eVdeIqsgcg';
module.exports.callback_get = function(req, response, next){
    //Varrify state issued is the state recieved
    // console.log(req.session.state);
    if(crypto.createHash('md5').update(req.cookies['connect.sid']).digest("hex") === req.query.state){
      var code =req.query.code;
      var state = req.query.state;
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
          'redirect_uri': 'http://tegoesports.com/discord/callback'
        }
      }, function(error, res) {
            if(error){
              response.redirect('/');
            }
            var json = JSON.parse(res.body);
            req.session.userId= json.access_token;
            req.session.oauth = {
              'provider': 'discord',
              'expires_in': json.expires_in
          }
            discord.getUser(json.access_token, function(error, response){
              if(error){
                console.log(error);
              }
              if(response){
                console.log(response);
              }
            })
            response.redirect('/');
      }); 
    }else{
      response.redirect('/');
    }
}
module.exports.authroize = function(req, res, next){
  var state = (crypto.createHash('md5').update(req.cookies['connect.sid']).digest("hex"));
  return res.redirect(`https://discordapp.com/api/oauth2/authorize?response_type=code&client_id=398568007108132882&scope=identify%20guilds&state=${state}&redirect_uri=http://localhost:3000/discord/callback`);
}
