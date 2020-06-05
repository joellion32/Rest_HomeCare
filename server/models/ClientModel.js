const mongoose = require('mongoose');


let Schema = mongoose.Schema;


let ClientSchema = new Schema({
name: {
type: String,
required: [true, 'the name is required']    
},
email: {
type: String,
unique: true,
required: [true, 'the email is required']    
},
password: {
type: String,
required: [true, 'the password is required']    
},
country: {
type: String,
required: [true, 'your country is required']   
},
city: {
type: String,
required: [true, 'your city is required']    
},
date_of_register: {
type: Date,
}, 
contracts: {
type: Number    
},
status: {
type: Boolean,
default: false   
}
});

// not seed password
ClientSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

module.exports = mongoose.model('Clients', ClientSchema);