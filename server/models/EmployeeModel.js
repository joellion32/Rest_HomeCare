const moongose = require('mongoose');


let Schema = moongose.Schema;


let EmployeeSchema = new Schema({
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
telephone: {
type: String,
required: [true, 'your telephone is required']        
},
description: {
type: String,
required: false,    
},
profession: {
type: Array,
required: ['true', 'professions are required at least 3 professions']
}, 
country:{
type: String,
required: [true, 'your country is required']    
},
city: {
type: String,
required: [true, 'your city is required']   
},
zip_code: {
type: Number,
required: false
},
location: {
type: String,
required: false
},
image: {
type: String,
required: [false, 'Your profile photo']
},
stars: {
type: Number,
default: 0    
},
status: {
type: Boolean,
default: false
},
role: {
type: String,
default: 'USER_ROLE'    
},
id_suscription: {
type: Schema.Types.ObjectId, ref: 'Suscription',
required: [true, 'the suscription is required']    
},
date_of_register: {
type: Date,
default: new Date()
},
});

// not seed password
EmployeeSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

module.exports = moongose.model('Employees', EmployeeSchema);