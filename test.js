/**
 * Created by Surya on 7/12/2016.
 */
var state,district,subDistrict;
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoose = require('mongoose'), Schema = mongoose.Schema;
var Server = mongo.Server,Db = mongo.Db,
    BSON = mongo.BSONPure;
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('test', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'winedb' database");
    }
});
var populateState = function() {
    var data = require('./states');
    db.collection('state', function(err, collection) {
        collection.insert(data, {safe:true}, function(err, result) {});
    });
};

var populateDistrict = function() {
    var data = require('./districts');
    db.collection('district', function(err, collection) {
        collection.insert(data, {safe:true}, function(err, result) {});
    });
};

var populateSubDistrict = function() {
    var data = require('./subdistricts');
    db.collection('subDistrict', function(err, collection) {
        collection.insert(data, {safe:true}, function(err, result) {});
    });
};

module.exports = {
    loadData: function(req, res) {
        db.collection('state', function(err, collection) {
            collection.remove({}, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred - ' + err});
                } else {
                    console.log('' + result + ' document(s) deleted');
                }
            });
        });
        db.collection('district', function(err, collection) {
            collection.remove({}, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred - ' + err});
                } else {
                    console.log('' + result + ' document(s) deleted');
                }
            });
        });
        db.collection('subDistrict', function(err, collection) {
            collection.remove({}, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred - ' + err});
                } else {
                    console.log('' + result + ' document(s) deleted');
                }
            });
        });
        db.collection('state', function(err, collection) {
            if (err) {
                console.log("The 'wines' collection doesn't exist. Creating it with sample data...",err);
            }
            else{
                populateState();
            }
        });
        db.collection('district', function(err, collection) {
            if (err) {
                console.log("The 'states' collection doesn't exist. Creating it with sample data...",err);
            }
            else{
                populateDistrict();
            }
        });
        db.collection('subDistrict', function(err, collection) {
            if (err) {
                console.log("The 'states' collection doesn't exist. Creating it with sample data...",err);
            }
            else{
                populateSubDistrict();
            }
        });
    },

    findStates: function(req, res) {
        var stateName = null;
        var stateName = req.param('name');
        if(stateName == undefined)
        {
            db.collection('state', function(err, collection) {
                collection.find().toArray(function(err, items) {
                    res.json(items);
                });
            });
        }
        else
        {   console.log("insideelse");
            db.collection('state', function(err, collection) {
                collection.findOne({'name':stateName}, function(err, item) {
                    res.json(item);
                });
            });
        }
    },

    findStatesById: function(req, res) {
        var id = req.params.state_id;
        db.collection('state', function(err, collection) {
            collection.findOne({'id':id}, function(err, item) {
                res.json(item);
            });
        });
    },

    findDistricts : function(req, res) {
        var districtName = null;
        var districtName = req.param('name');
        if(districtName == undefined)
        {
            db.collection('district', function(err, collection) {
                collection.find().toArray(function(err, items) {
                    res.json(items);
                });
            });
        }
        else
        {
            db.collection('district', function(err, collection) {
                collection.findOne({'name':districtName}, function(err, item) {
                    res.json(item);
                });
            });
        }
    },

    findDistrictsInState: function(req, res) {
        var id = req.params.state_id;
        db.collection('district', function(err, collection) {
            collection.find({'state_id':id}).toArray(function(err, items) {
                res.json(items);
            });
        });
    },

    findDistrictWithInState: function(req, res) {
        var stateId = req.params.state_id;
        var districtId = req.params.district_id;
        db.collection('district', function(err, collection) {
            collection.find({'state_id':stateId,'id':districtId}).toArray(function(err, items) {
                res.json(items);
            });
        });
    },

    findSubDistrcts:  function(req, res) {
        var subDistrictName = null;
        var subDistrictName = req.param('name');
        if(subDistrictName == undefined)
        {
            db.collection('subDistrict', function(err, collection) {
                collection.find().toArray(function(err, items) {
                    res.json(items);
                });
            });
        }
        else
        {
            db.collection('subDistrict', function(err, collection) {
                collection.findOne({'name':subDistrictName}, function(err, item) {
                    res.json(item);
                });
            });
        }
    },

    findSubDistrictsWithInDistrict: function(req, res) {
        var stateId = req.params.state_id;
        var districtId = req.params.district_id;
        db.collection('district', function(err, collection) {
            collection.find({'state_id':stateId,'id':districtId}).toArray(function(err, item) {
                var stateDistrictId = item[0].id;
                db.collection('subDistrict', function(err, collection) {
                    collection.find({'district_id':stateDistrictId}).toArray(function(err, items) {
                        res.json(items);
                    });
                });
            });
        });
    },

    findSubDistrictWithInDistrict: function(req, res) {
        var stateId = req.params.state_id;
        var districtId = req.params.district_id;
        var subDistrictId = req.params.subdistrict_id;
        var subDistrictWithStateIdDistrictId = [];
        db.collection('district', function(err, collection) {
            collection.find({'state_id':stateId,'id':districtId}).toArray(function(err, item) {
                var stateDistrictId = item[0].id;
                db.collection('subDistrict', function(err, collection) {
                    collection.find({'district_id':stateDistrictId,'id':subDistrictId}).toArray(function(err, items) {
                        res.json(items);
                    });
                });
            });
        });
    },

};


