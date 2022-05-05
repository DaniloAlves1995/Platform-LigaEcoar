const express = require('express');
const multer = require('multer');
const aws = require('aws-sdk');

const Content = require('../models/content');
const router = express.Router();
const multerConfig = require('../config/multer');
const STORAGE_TYPE="s3";

const s3 = new aws.S3();

router.post('/register', multer(multerConfig).single('file'), async(req, res) => {

    try{

        //check file type
        if(req.body.tipo == 'foto'){

            //upload the file then send url file to database
            const { originalname: name, size, key, location: url="" } = req.file;

            content = await Content.create({...req.body, "url": url, "key": key});
        }else{
            content = await Content.create(req.body);
        }
        
        return res.json({success: true});
    } catch (err) {
        return res.send({ success: false, error: 'Falha de Registro!' });
    }
});

//atualizar
router.put('/update/:id', multer(multerConfig).single('file'), async(req, res) => {

    //check file type
    if(req.body.tipo == 'foto' && req.file){

        //delete old file from S3 
        Content.findById(req.params.id, (erro, content) => {

            //check key param
            if(content.key){

                //delete file from the S3
                if(STORAGE_TYPE === 's3'){
                    return s3.deleteObject({
                        Bucket: 'hermedicom-uploads',
                        Key: content.key,
                    }).promise()
                }
            }
        });

        //upload the new file then get url and key
        const { originalname: name, size, key, location: url="" } = req.file;

        req.body.url = url;
        req.body.key = key;
    }

    if(req.body.tipo == 'video'){
        req.body.key = "";
    }
        
    Content.findByIdAndUpdate(req.params.id, {$set: req.body},
        (erro, content) => {
            if(erro) return res.status(400).send({success: false, error: 'Falha ao Atualizar!' });
            res.status(200).send({success: true, resp: 'Conteúdo Atualizado!', url: req.body.url ? req.body.url : content.url});
        });
});

//find by id
router.get('/:id', async(req, res) => {
    Content.findById(req.params.id, (erro, content) => {
        if(erro) return res.status(400).send({success: false, error: 'Falha ao buscar conteúdo!' });
        res.json(content);
    });
});

//search by title, posts from general timeline or user timeline
router.post('/search', async(req, res) => {
    var query = null;

    //case of user timeline or general timeline
    if(req.body.id)
        query = {titulo: new RegExp('.*' + req.body.titulo + '.*', "i"), id_user: req.body.id}
    else
        query = {titulo: new RegExp('.*' + req.body.titulo + '.*', "i")}
    
    Content.find(query, (erro, content) => {
        if(erro) return res.status(400).send({error: 'Falha ao buscar conteúdo!' });
        res.json(content);
    })
});

//fetch my timeline
router.post('/timeline/:id', async(req, res) => {
    Content.find({id_user: req.params.id}, (erro, content) => {
        if(erro) return res.status(400).send({success: false, error: 'Falha ao buscar timeline!' });
        if(!content) return res.status(400).send({success: false, error: 'Você não possui postagens!' });

        let lista = content.slice(req.body.posI, req.body.posI+2);
        res.json({success: true, list: lista});
    }).sort({createdAt: -1});
});

//fetch timeline
router.post('/timeline', async(req, res) => {
    Content.find({}, (erro, content) => {
        if(erro) return res.status(400).send({success: false, error: 'Falha ao buscar timeline!' });
        let lista = content.slice(req.body.posI, req.body.posI+2);
        res.json({success: true, list: lista});
    }).sort({createdAt: -1});
});

//delete
router.delete('/delete/:id', async(req, res) => {
    Content.findById(req.params.id, (erro, content) => {
        if(erro) return res.status(400).send({success: false, error: 'Falha ao apagar conteúdo!' });

        if(content.tipo == 'foto'){
            
            //delete file from the S3
            if(STORAGE_TYPE === 's3'){
                return s3.deleteObject({
                    Bucket: 'hermedicom-uploads',
                    Key: content.key,
                }).promise()
            }
        }
    });
    
    //delete register from database
    Content.deleteOne({_id: req.params.id}, (erro) => {
        if(erro) return res.send(erro);
        res.status(200).send({success: true, resp: 'Conteúdo apagado com sucesso!'});
    });
});

module.exports = app => app.use('/content', router);