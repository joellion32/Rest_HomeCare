const moongose = require('mongoose');


let Schema = moongose.Schema;


let JobsSchema = new Schema({
client_id: {
type: String,
required: true    
},
employe_id: {
type: String,
required: true       
},
title: {
type: String,
required: [true, 'Specific your service']    
},
description: {
type: Text,
required: [true, 'Specific your service']    
},
date_of_solicited: {
type: Date,
default: new Date().getDate()
},
status:{
type: Boolean,
default: false    
}
});


module.exports = moongose.model('Jobs', JobsSchema);