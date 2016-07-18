/**
 * Created by Surya on 7/11/2016.
 */
// calling  the packages we need
var express    = require('express');
var app        = express();
var mongoose   = require('mongoose');
var state,district,subDistrict;
var port = process.env.PORT || 8080;
var http = require('http');
var router = express.Router();
var routes = require('./routes');
// console.log('routes',routes);
app.get('/config/init', routes.loadData);
app.get('/config/states', routes.findStates);
app.get('/config/states/:state_id', routes.findStatesById);
app.get('/config/districts', routes.findDistricts);
app.get('/config/states/:state_id/districts', routes.findDistrictsInState);
app.get('/config/states/:state_id/districts/:district_id', routes.findDistrictWithInState);
app.get('/config/subdistricts', routes.findSubDistricts);
app.get('/config/states/:state_id/districts/:district_id/subdistricts', routes.findSubDistrictsWithInDistrict);
app.get('/config/states/:state_id/districts/:district_id/subdistricts/:subdistrict_id', routes.findSubDistrictWithInDistrict);

// all of our routes will be prefixed with /config
app.use('/config', router);

var conn = mongoose.connection;

conn.once("open", function () {
    console.log("Mongodb connected");
    var httpServer = http.createServer(app);
    httpServer.listen('8080', function () {
        console.log('Listening for getting data on: 8080');
    });
});

conn.on('error', function(error) {
    console.log(error);
});
// // START THE SERVER
// app.listen(port);
// console.log('Server on port ' + port);0