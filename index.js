const express = require('express')
const app = express()
//Para funcionar no Zeit
const path = require('path')

const port = process.env.PORT || 3000

const convert = require('./lib/convert')
const apiBCB = require('./lib/api.bcb')
//Para o ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))
//Pasta para colocar o CSS
app.use(express.static(path.join(__dirname,'public')))

app.get('/',async (req,res) => {
    const cotacao = await apiBCB.getCotacao()
    res.render('home',{
        cotacao
    })
})

app.get('/cotacao', (req,res) => {
    const {cotacao, quantidade} = req.query
    if(cotacao && quantidade){
    const conversao = convert.convert(cotacao,quantidade)
    res.render('cotacao',{
        error: false,
        cotacao: convert.toMoney(cotacao),
        quantidade: convert.toMoney(quantidade),
        conversao: convert.toMoney(conversao)
    })
    }
    else {
        res.render('cotacao',{
            error: 'Valores Inválidos'
        })
    }
})

app.listen(port, err =>{
    if(err){
        console.log('Não foi possível iniciar o servidor')
    }
    else{
        console.log('ConvertMyMone está online')
    }
})