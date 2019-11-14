
//Install express server
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const app = express();

const whiteList = ['http://localhost:4200', 'https://beeble-assignment.herokuapp.com'];
app.use(cors({
    origin(origin, callback) {
        console.log('the origin ', origin);
      if (whiteList.indexOf(origin) !== -1 || !origin) callback(null, true);
      else callback(new Error('Origin not allowed by CORS policy'));
    },
    credentials: true,
    optionsSuccessStatus: 200,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
    limit: '4MB'
}));

const mongoose = require('mongoose');
const { Item } = require('./item');

const db = mongoose.connection;

mongoose.connect('mongodb+srv://<username>:username@cluster0-cp4wj.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    auth: {
        user: '',
        password: ''
    },
    server: {
        auto_connect: true
    }
});

db.once('open', () => {
    console.log('Database connected');
});

db.on('connect', () => {
    console.log('Database connected');
});

db.on('error', (e) => {
    console.log('Database error ', e);
    mongoose.disconnect();
});

if (!fs.existsSync(path.join(__dirname, '/public/images'))) {
    console.log('Directory not found');
    fs.mkdirSync(path.join(__dirname, '/public/images'));
}
  
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images');
    },
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.mimetype.split('/')[1]}`);
    },
});

const upload = multer({ storage, limits: { fileSize: '4MB' } }).single('photo');

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/beeble'));
app.use('*/images',express.static('public/images'));

app.get('/items', function(req, res) {
    Item.find({}, function(err, items) {
        if(err) return res.status(500).send({
            error: 'internal_server_error',
            data: null
        });

        console.log('Items ', items);
        return res.status(200).send({
            error: null,
            data: items
        })
    });
});

app.post('/items', function(req, res) {
    return upload(req, res, (e) => {
        if(e) return res.status(500).send({
            error: 'internal_server_error',
            data: null
        });
        const item = new Item({
            title: req.body.title,
            description: req.body.description,
            quantity: req.body.quantity,
            photo: req.file ? `https://${ req.headers.host }/images/${ req.file.filename }`: null
        });
    
        item.save((err) => {
            if(err) return res.status(500).send({
                error: 'internal_server_error',
                data: null
            });
    
            console.log('Item saved ');
            return res.status(200).send({
                error: null,
                data: null
            })
        });
    });
});

app.get('/', function(req, res) {
    
    res.sendFile(path.join(__dirname+'/dist/beeble/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);