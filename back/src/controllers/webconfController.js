const express = require('express');

const Webconf = require('../models/webconf');
const router = express.Router();

router.post('/register', async(req, res) => {
    
    try{
        const webconf = await Webconf.create(req.body);//await é pra ele aguardar a criação
        

        return res.json(webconf);
    } catch (err) {
        return res.status(400).send({ error: 'Falha de Registro!'});
    }
});

//atualizar
router.put('/update/:id', async(req, res) => {
    Webconf.findByIdAndUpdate(req.params.id, {$set: req.body},
        (erro, webconf) => {
            if(erro) return res.status(400).send({error: 'Falha ao Atualizar!' });
            res.status(200).send({resp: 'Webconferência Atualizada!'});
        });
});

//pegar por id
router.get('/:id', async(req, res) => {
    Webconf.findById(req.params.id, (erro, webconf) => {
        if(erro) return res.status(400).send({error: 'Falha ao buscar webconferência!' });
        res.json(webconf);
    });
});

//listar todos
router.post('/list', async(req, res) => {
    Webconf.find({}, (erro, webconf) => {
        if(erro) return res.status(400).send({error: 'Falha ao buscar webconferências!' });
        res.json(webconf);
    });
});

//listar por mês
router.post('/listMes', async(req, res) => {
   
    Webconf.find({data: {$gte: req.body.dataI, $lte: req.body.dataF}}, (erro, webconf) => {
        if(erro) return res.send(erro);
        res.json(webconf);
    });
});

//apagar
router.delete('/delete/:id', async(req, res) => {
    Webconf.deleteOne({_id: req.params.id}, (erro) => {
        if(erro) return res.send(erro);
        res.status(200).send({resp: 'Webconferência apagada com sucesso!'});
    });
});

module.exports = app => app.use('/webconf', router);