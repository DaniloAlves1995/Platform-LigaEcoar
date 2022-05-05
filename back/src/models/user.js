const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    nome: String,
    telefone: String,
    endereco: String,
    cpf: String,
    dataN: Date,
    email: String,
    usuario: String,
    senha: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//antes de salvar
UserSchema.pre('save', async function(next){
    //o this aqui se refere ao objeto que está sendo salvado
    //esse numero é a qtd de vezes que o hash é gerado
    const hash = await bcrypt.hash(this.senha, 10); 
    this.senha = hash;

    next();
});



module.exports = mongoose.model("user", UserSchema);