const moongose = require('mongoose');


let Schema = moongose.Schema;


let JobsSchema = new Schema({
client_id: {
type: Schema.Types.ObjectId, ref: 'Clients',
required: true   
},
employe_id: {
type: Schema.Types.ObjectId, ref: 'Employees',
required: true       
},
title: {
type: String,
required: [true, 'Specific your service']    
},
description: {
type: String,
required: [true, 'Specific your service']    
},
location: {
type: String, 
required: [true, 'Specific your location']
},
date_of_solicited: {
type: Date,
default: new Date()
},
status:{
type: String,
enum: ['PENDING', 'CANCELLED', 'COMPLETED']       
}
});


module.exports = moongose.model('Jobs', JobsSchema);