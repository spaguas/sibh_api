const { parse } = require('json2csv');

const JSONtoCSV = json =>{
    let data
    try {
        data = parse(json)
    } catch (e){
        return 'Erro no parse do JSON'
    }

    return data
}

module.exports = {
    JSONtoCSV
}