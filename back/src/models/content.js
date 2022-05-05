const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    titulo: String,
    descricao: String,
    url: String,
    key: String,
    tipo: String,
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("content", ContentSchema);