var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var traçeSchema = new Schema({
    nomproduit : {type: String , required : true},
    ordreservice : {type: String , required : true},
    adressedetraveaux: { type: String, required: true },
    nomentreprise:{type: String, required: true },
    numerodemarche:{type: Number , required:true},
   augentdesuivie: { type: String, required: true },
})

module.exports = mongoose.model('Traçe', traçeSchema);