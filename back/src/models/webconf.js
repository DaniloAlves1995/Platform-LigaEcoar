const mongoose = require('mongoose');

const WebconfSchema = new mongoose.Schema({
    titulo: String,
    descricao: String,
    link: String,
    data: Date,
    id_user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("webconf", WebconfSchema);