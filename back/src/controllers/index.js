//Esse arquivo é para repassar o app para todos os controllers que forem criados
//Isso evitar adicionar de um por um no index principal
const fs = require('fs');
const path = require('path');

module.exports = app => {
    fs.readdirSync(__dirname)
      .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js")))
      .forEach(file => require(path.resolve(__dirname, file))(app));
}