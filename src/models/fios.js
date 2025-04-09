const { model, Schema } = require('mongoose')

const fiosSchema = new Schema({
  CodigoFios: { 
    type: String, 
    required: true,
    unique: true },
  MarcaFios: { type: String },
  CorFios: { type: String },
  QtdFios: { type: Number }
}, { versionKey: false })

module.exports = model('fios', fiosSchema)