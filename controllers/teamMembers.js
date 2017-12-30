const express = require('express');
const router = express.Router();

module.exports.teamMembers_get = function(req, res, next){
    return res.render('teamMembers', {title: 'Team-Members'});    
}