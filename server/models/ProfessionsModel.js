const moongose = require('mongoose');


let Schema = moongose.Schema;


let ProfessionsSchema = new Schema({
name_profession: {
type: String,
required: [true, 'profession is required']    
},
description: {
type: String,
required: false    
},
category_id: {
type: Schema.Types.ObjectId, ref: 'Categories',
required: [true, 'category is required']
}
});


module.exports = moongose.model('Professions', ProfessionsSchema);