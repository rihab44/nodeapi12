var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var commandeSchema = new Schema({
    nomproduit : {type: String , required : true},
    typeprojet: { type: String, required: true },
    prix:{type: Number, required: true },
    dateestimé:{type: String , required:true},
   nomutilisateur: { type: String, required: true },
})

module.exports = mongoose.model('Commande', commandeSchema);