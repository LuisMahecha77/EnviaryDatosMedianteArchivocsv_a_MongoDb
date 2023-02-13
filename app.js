var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');
var csvModel = require('./models/csv');
var csv = require('csvtojson');
var bodyParser = require('body-parser');

var storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, './public/uploads');
    },
    filename:(req, file, cb) => {
        cb(null, file.originalname);
    }
});

var uploads = multer({storage: storage});

//Connect to DB
mongoose.connect('mongodb://localhost:27017/stackMern', {useNewUrlParser:true})
.then(() => console.log('conected to Db!!'))
.catch((err) => console.log(err))

//init App
var app = express();

//set the template engine
app.set('view engine', 'ejs');

//fetch data from the request
app.use(bodyParser.urlencoded({extended: false}));

//static folder
app.use(express.static(path.resolve(__dirname, 'public')));

//defailt pageload
app.get('/', (req,res) => {
    csvModel.find((err, data) => {
        if (err) {
            console.log(err);
        }else{
            if (data != '') {
                res.render('demo', {data: data});
            }else{
                res.render('demo', {data: ''});
            }
        }
    });
});

var temp ;

app.post('/', uploads.single('csv'),(req, res) =>{
    //Convert csvFile to JsonArray

    csv()
    .fromFile(req.file.path)
    .then((jsonObj) =>{
        console.log(jsonObj);
        for(var x = 0; x < jsonObj; x++){
            temp = parseFloat(jsonObj[x].Gender)
            jsonObj[x].Gender = temp;
            temp = parseFloat(jsonObj[x].GmailOne)
            jsonObj[x].GmailOne = temp;
            temp = parseFloat(jsonObj[x].GmailTwo)
            jsonObj[x].GmailTwo = temp;
            temp = parseFloat(jsonObj[x].CityOfResidence)
            jsonObj[x].CityOfResidence = temp;
            temp = parseFloat(jsonObj[x].Profession)
            jsonObj[x].Profession = temp;
        }
        csvModel.insertMany(jsonObj, (err, data) =>{
            if (err) {
                console.log(err);
            }else{
                res.redirect('/');
            }
        });
    });
});

//Assing Port
var port = process.env.PORT || 3000;
app.listen(port, () => console.log('server run at port '+ port));