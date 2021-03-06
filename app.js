import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import multer from 'multer'
import * as fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
})
  
const upload = multer({ storage: storage })

let app = express();
let ADMIN = 'admin', PASS = 'secret';
app.use(bodyParser.json())
app.use('/public', express.static(__dirname + "/public"));

app.post('/admin', (req, res, next) => {
    if (req.body.login === config.ADMIN && req.body.password === config.PASS) {
        let token = jwt.sign({ login: 'admin' }, 'secretkey')
        res.json({token: token})
    }
    else {
        res.json({msg: 'incorrect credentials'})
    }
})

function admin(req, res, next){
    let token = req.get('token');
    if(!token) {
        res.json({msg: 'token not provided'})
    }
   
    const decoded = jwt.verify(token, 'secretkey');

    if(!decoded.login === ADMIN) {
        res.json({msg: 'not correct token provided'})
    }
    else {
        next()
    }

    
}


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/add/pizza', admin, upload.single('image'), async (req, res) => {
    let name = req.body.name;
    let price = req.body.price;
    let info = req.body.info;
    let file = req.file.filename;

    if(!(name && price && info && file)) {
        res.json({msg: 'all parameter required'})
        return 0
    }

    let data = await fs.readFile('./public/pizza.json');
    let data2 = JSON.parse(data.toString());

    data2.data.push({
        id: Date.now(),
        name,
        price,
        info,
        file,
    })
    await fs.writeFile('./public/pizza.json', JSON.stringify(data2))
    res.json({msg: 'ok'})
})


app.get('/getall/pizza', async (req, res) => {
    let data = await fs.readFile('./public/pizza.json');
    let data2 = JSON.parse(data.toString());

    res.json({data: data2})
})


app.post('/delete/pizza/:id', admin, async (req, res) => {
    let id = req.params.id;

    let data = await fs.readFile('./public/pizza.json');
    let data2 = JSON.parse(data.toString());
    let data3 = {
        data: []
    }

    data2.data.forEach(item => {
        
        if(String(item.id) !== String(id)) {
            data3.data.push(item)
        }
    });

    await fs.writeFile('./public/pizza.json', JSON.stringify(data3))

    res.json({msg: "item deleted"})
})




app.post('/add/drink', admin, upload.single('image'), async (req, res) => {
    let name = req.body.name;
    let price = req.body.price;
    let info = req.body.info;
    let file = req.file.filename;

    if(!(name && price && info && file)) {
        res.json({msg: 'all parameter required'})
        return 0
    }

    let data = await fs.readFile('./public/drink.json');
    let data2 = JSON.parse(data.toString());

    data2.data.push({
        id: Date.now(),
        name,
        price,
        info,
        file,
    })
    await fs.writeFile('./public/drink.json', JSON.stringify(data2))
    res.json({msg: 'ok'})
})


app.get('/getall/drink', async (req, res) => {
    let data = await fs.readFile('./public/drink.json');
    let data2 = JSON.parse(data.toString());

    res.json({data: data2})
})


app.post('/delete/drink/:id', admin, async (req, res) => {
    let id = req.params.id;

    let data = await fs.readFile('./public/drink.json');
    let data2 = JSON.parse(data.toString());
    let data3 = {
        data: []
    }

    data2.data.forEach(item => {
        
        if(String(item.id) !== String(id)) {
            data3.data.push(item)
        }
    });

    await fs.writeFile('./public/drink.json', JSON.stringify(data3))

    res.json({msg: "item deleted"})
})





app.listen(process.env.PORT || 80, () => {
  console.log(`Example app listening at http://localhost:${3000}`)
})