const moongose = require('mongoose');


let Schema = moongose.Schema;


let CategorySchema = new Schema({
name_category:{
type: String,
required: [true, 'category is required'],
unique: true   
}
});



module.exports = moongose.model('Categories', CategorySchema);