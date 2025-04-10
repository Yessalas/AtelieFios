const { model, Schema } = require('mongoose')

const fiosSchema = new Schema({
  CodigoFios: { type: String, required: true },
  MarcaFios: { type: String, required: true },
  CorFios: { type: String },
  QtdFios: { type: Number }
}, { versionKey: false })

// índice único baseado na combinação de Código + Marca
fiosSchema.index({ CodigoFios: 1, MarcaFios: 1 }, { unique: true })

module.exports = model('fios', fiosSchema)
