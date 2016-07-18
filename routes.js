/**
 * Created by Surya on 7/12/2016.
 */
var state,district,subDistrict;
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoose = require('mongoose'), Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/apiTask');
var Promise = require('promise');
var schema = new mongoose.Schema({
    name: {type: String},
    id: Number,
    state_id: Number,
    district_id: Number,
    subdistrict_id: Number
});
// console.log(schema,"schema");
var State = mongoose.model("State", schema);

var insertStates = function(){
    console.log("insidefunction");
    var stateList = require("./states");
    stateList.map(state => new State(state).save());
};

var insertDistricts = function () {
    var districtList = require("./districts");
    districtList.map(district => new State(district).save());
};

var insertSubDistricts = function () {
    var subDistrictList = require("./subdistricts");
    subDistrictList.map(subDistrict => new State(subDistrict).save());
}

var removeData = function(){
   var s = State.remove({});
    console.log("removed succesfully");
    return Promise.all([s]);
}

console.log("state",State,"state");

module.exports = {
    loadData: function(req, res) {
        // removeData().then(() => {insertStates()},() => {insertDistricts()});
        removeData().then(() => {insertStates()}).then(() => {insertDistricts()}).then(() => {insertSubDistricts()});
        res.json("data loaded");
    },

    findStates: function(req, res) {
        var stateName = null;
        var stateName = req.param('name');
        if(stateName == undefined)
        {
            State.find({state_id:null,district_id:null}, function(err, states) {
                if (err) throw err;
                res.json(states);
            });
        }
        else
        {
            State.find({name:stateName,state_id:null,district_id:null}, function(err, states) {
                if (err) throw err;
                res.json(states);
            });
        }
    },

    findStatesById: function(req, res) {
        var id = req.params.state_id;
        State.find({id: id,state_id:null}, function(err, state) {
            if (err) throw err;
            res.json(state);
        });
    },

    findDistricts : function(req, res) {
        var districtName = null;
        var districtName = req.param('name');
        if(districtName == undefined)
        {
            State.find({state_id:{ $ne: null }}, function(err, states) {
                if (err) throw err;
                res.json(states);
            });
        }
        else
        {
            State.find({name:districtName,state_id:{ $ne: null }}, function(err, states) {
                if (err) throw err;
                res.json(states);
            });
        }

    },

    findDistrictsInState: function(req, res) {
        var id = req.params.state_id;
        State.find({state_id:id}, function(err, states) {
            if (err) throw err;
            res.json(states);
        });
    },

    findDistrictWithInState: function(req, res) {
        var stateId = req.params.state_id;
        var districtId = req.params.district_id;
        console.log(stateId,districtId);
        State.find({state_id:stateId,id:districtId}, function(err, states) {
            if (err) throw err;
            res.json(states);
        });
    },

    findSubDistricts:  function(req, res) {
        var subDistrictName = null;
        var subDistrictName = req.param('name');
        if(subDistrictName == undefined)
        {
            State.find({district_id:{ $ne: null }}, function(err, states) {
                if (err) throw err;
                res.json(states);
            });
        }
        else
        {
            State.find({name:subDistrictName,district_id:{ $ne: null }}, function(err, states) {
                if (err) throw err;
                res.json(states);
            });
        }
    },

    findSubDistrictsWithInDistrict: function(req, res) {
        var stateId = req.params.state_id;
        var districtId = req.params.district_id;
        State.find({state_id:stateId,id:districtId}, function(err, state) {
            if (err) throw err;
            var stateDistrictId = state[0].id;
            State.find({district_id:stateDistrictId}, function(err, states) {
                if (err) throw err;
                res.json(states);
            });
        });
    },

    findSubDistrictWithInDistrict: function(req, res) {
        var stateId = req.params.state_id;
        var districtId = req.params.district_id;
        var subDistrictId = req.params.subdistrict_id;
        var subDistrictWithStateIdDistrictId = [];
        State.find({state_id:stateId,id:districtId}, function(err, state) {
            if (err) throw err;
            var stateDistrictId = state[0].id;
            State.find({district_id:stateDistrictId,id:subDistrictId}, function(err, states) {
                if (err) throw err;
                res.json(states);
            });
        });
    },

};

