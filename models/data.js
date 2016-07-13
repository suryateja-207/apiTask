/**
 * Created by Surya on 7/12/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var collectionOne = 'states';

var stateSchema = new Schema({
    'name': String,
    'price': Number
});
var stateSchema = new Schema({
    'name': String,
    'price': Number
});
var stateSchema = new Schema({
    'name': String,
    'price': Number
});

module.exports = mongoose.model('State', stateSchema, collectionOne);
