const mongoose = require('mongoose');


let Schema = mongoose.Schema;


let SuscriptionSchema = new Schema({
suscription: {
type: String,
enum: ['BASIC', 'MEDIUM', 'PLUS']   
},
price: {
type: Number,
required: false    
},
description: {
type: String,
required: false    
}   
});



module.exports = mongoose.model('Suscriptions', SuscriptionSchema);