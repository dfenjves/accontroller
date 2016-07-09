var express = require('express');
var router = express.Router();
var request = require('request');
require('dotenv').config();

var baseUrl = 'https://api.particle.io/v1/devices/'+ process.env.PARTICLE_API_KEY;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nerd' });
});

router.get('/hello', function(req, res, next) {
  res.render('hello', { title: 'Hello World' });
});

router.get('/air', function(req, res, next) {
  request(baseUrl +'/acState?access_token='+ process.env.PARTICLE_API_TOKEN, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var responseBody = JSON.parse(body);
        var onOrOff = responseBody["result"];
        var currStatus;
        if (onOrOff == 1){
          currStatus = "On";
        } else if (onOrOff == 0){
          currStatus = "Off";
        }
        res.render('air', { title: "Air", status: currStatus});
    }
  });
});

//sending post request to turn air on or off.
router.post('/ac-on-off', function(req, res){
  var choice = req.body.choice;
  request.post(baseUrl + '/ac-on-off?access_token=' + process.env.PARTICLE_API_TOKEN).form({args:choice});

  request(baseUrl +'/acState?access_token='+ process.env.PARTICLE_API_TOKEN, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var responseBody = JSON.parse(body);
        var onOrOff = responseBody["result"];
        var currStatus;
        if (onOrOff == 1){
          currStatus = "On";
        } else if (onOrOff == 0){
          currStatus = "Off";
        }
        res.render('air', { title: "Air", status: currStatus});
    }
  });
})

// function getAcStatus(template, args){
//     request('https://api.particle.io/v1/devices/53ff72066667574820382167/acState?access_token=80ba7ae3019e121e78914209e83942bcc3491e6d', function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//         var responseBody = JSON.parse(body);
//         var onOrOff = responseBody["result"];
//         var currStatus;
//         if (onOrOff == 1){
//           currStatus = "On";
//         } else if (onOrOff == 0){
//           currStatus = "Off";
//         }
//         res.render(template, args);
//     }
// }

module.exports = router;
