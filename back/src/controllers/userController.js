const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//recebe o hash MD5 que é unico dessa aplicação, para gerar o token a partir dele
const authConfig = require('../config/auth');

const User = require('../models/user');
const router = express.Router();

//para gerar o token
function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async(req, res) => {
    //pega o valor do email que foi recebido como parametro pela chamada
    const { usuario } = req.body;
    
    try{

        //Caso já tenha o usuário cadastrado
        if(await User.findOne({ usuario }))
            return res.status(400).send({ error: 'Usuário já existe' });

        //apaga o campo de password
        const user = await User.create(req.body);//await é pra ele aguardar a criação
        user.senha = undefined;

        return res.json(user);
    } catch (err) {
        return res.status(400).send({ error: 'Falha de Registro'});
    }
});

//atualizar
router.put('/:id/update', async(req, res) => {
    User.findByIdAndUpdate(req.params.id, {$set: req.body},
        (erro, user) => {
            if(erro) return res.status(400).send({error: 'Falha ao Atualizar!' });
            res.status(200).send({resp: 'Usuário Atualizado!'});
        });
});

//pegar por id
router.get('/:id', async(req, res) => {
    User.findById(req.params.id, (erro, user) => {
        if(erro) return res.status(400).send({error: 'Falha ao buscar usuário!' });
        res.json(user);
    });
});

//listar todos
router.post('/list', async(req, res) => {
    User.find({}, (erro, user) => {
        if(erro) return res.status(400).send({error: 'Falha ao buscar usuário!' });
        res.json(user);
    });
});

//listar por nome
router.post('/listName', async(req, res) => {

    User.find({nome: new RegExp('.*'+req.body.nome+'.*', "i")}, (erro, user) => {
        if(erro) return res.send(erro);
        res.json(user);
    });
});

//apagar
router.delete('/delete/:id', async(req, res) => {
    User.deleteOne({_id: req.params.id}, (erro) => {
        if(erro) return res.send(erro);
        res.status(200).send({resp: 'Usuário apagaddo com sucesso!'});
    });
});

//autenticar
router.post('/authenticate', async (req, res) => {
    const { usuario, senha } = req.body;

    const user = await User.findOne({ usuario }).select('+senha');

    //caso n tenha o usuário no bd
    if(!user)
        return res.send({ success: false, error: 'Usuário não encontrado!' });
   
    //utiliza o compare do bcrypt pq a senha vai estar encriptada
    if(!await bcrypt.compare(senha, user.senha))
        return res.send({ success: false, error: 'Senha incorreta!' });
    
    user.senha = undefined;
    
    res.send({
        success: true,
        user, 
        token: generateToken({ id: user.id }),
     });
});

module.exports = app => app.use('/user', router);