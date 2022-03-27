// IMPORTS EXTERNALL PACKAGES
import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import * as fs from 'fs/promises';
import path from 'path';
const __dirname = path.resolve();

// IMPORTS INTERNALL PACKAGES
import upload from './middleware/storage';
import { ADMIN, PASS } from './configs/config';
import auth from './middleware/auth';

// SERVER SETUP
let app = express();
app.use(bodyParser.json())
app.use('/public', express.static(__dirname + "/public"));
// test kotka

// SERVER METHODS
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/admin', (req, res, next) => {
    if (req.body.login === ADMIN && req.body.password === PASS) {
        let token = jwt.sign({ login: 'admin' }, 'secretkey')
        res.json({token: token})
    }
    else {
        res.json({msg: 'incorrect credentials'})
    }
})

app.post('/add/pizza', auth, upload.single('image'), async (req, res) => {
    let name = req.body.name;
    let price = req.body.price;
    let info = req.body.info;
    let file = req.file.filename;

    if(!(name && price && info && file)) {
        res.json({msg: 'all parameter required'})
        return 0
    }

    let data = await fs.readFile('./pizza.json');
    let data2 = JSON.parse(data.toString());

    data2.data.push({
        id: Date.now(),
        name,
        price,
        info,
        file,
    })
    await fs.writeFile('./pizza.json', JSON.stringify(data2))
    res.json({msg: 'ok'})
})

app.get('/getall/pizza', async (req, res) => {
    let data = await fs.readFile('./pizza.json');
    let data2 = JSON.parse(data.toString());

    res.json({data: data2})
})

app.post('/delete/pizza/:id', auth, async (req, res) => {
    let id = req.params.id;

    let data = await fs.readFile('./pizza.json');
    let data2 = JSON.parse(data.toString());
    let data3 = {
        data: []
    }

    data2.data.forEach(item => {
        
        if(String(item.id) !== String(id)) {
            data3.data.push(item)
        }
    });

    await fs.writeFile('./pizza.json', JSON.stringify(data3))

    res.json({msg: "item deleted"})
})

app.post('/add/drink', auth, upload.single('image'), async (req, res) => {
    let name = req.body.name;
    let price = req.body.price;
    let info = req.body.info;
    let file = req.file.filename;

    if(!(name && price && info && file)) {
        res.json({msg: 'all parameter required'})
        return 0
    }

    let data = await fs.readFile('./drink.json');
    let data2 = JSON.parse(data.toString());

    data2.data.push({
        id: Date.now(),
        name,
        price,
        info,
        file,
    })
    await fs.writeFile('./drink.json', JSON.stringify(data2))
    res.json({msg: 'ok'})
})

app.get('/getall/drink', async (req, res) => {
    let data = await fs.readFile('./drink.json');
    let data2 = JSON.parse(data.toString());

    res.json({data: data2})
})

app.post('/delete/drink/:id', auth, async (req, res) => {
    let id = req.params.id;

    let data = await fs.readFile('./drink.json');
    let data2 = JSON.parse(data.toString());
    let data3 = {
        data: []
    }

    data2.data.forEach(item => {
        
        if(String(item.id) !== String(id)) {
            data3.data.push(item)
        }
    });

    await fs.writeFile('./drink.json', JSON.stringify(data3))

    res.json({msg: "item deleted"})
})


app.listen(process.env.PORT || 80, () => {
  console.log(`Example app listening at http://localhost:${3000}`)
})