const mongoose = require('mongoose');


const accessoireSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  categorie: { type: String, required: true },
  prix: { type: Number, required: true },
  code: { type: Number, required: true },
  stockinitial: { type: Number, required: true },
  stocktompon: { type: Number, required: true },
  unitedemesure: { type: Number, required: true },
});

module.exports = mongoose.model('accessoire', accessoireSchema);
