const moongose = require('mongoose');


let Schema = moongose.Schema;


let CountrySchema = new Schema({
country: {
type: String,
required: false     
},
provinces:{
type: Array,
required: false   
},
img: {
type: String,
required: false    
}
});



module.exports = moongose.model('Countries', CountrySchema);