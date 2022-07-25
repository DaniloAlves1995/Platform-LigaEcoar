const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 3000;


mongoose.connect('mongodb+srv://ligaecoar:***********@cluster0.bwidn.mongodb.net/PlataformaLiga?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
  { extended: false }
));

require('./controllers/index')(app);

app.listen(port);
console.log("Executando na porta = "+port);
