const express = require('express');
const bodyParser = require('body-parser');
var path  = require('path')
const fs = require('fs');
const stream = require('stream');
var multer  = require('multer');
// var upload = multer({ dest: 'uploads/' });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '.txt')
    }
  })
   
  var upload = multer({ storage: storage })

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json());

 // Handling CORS error     
 app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-with, Content-Type, Accept, Authorization');
    if(res.method === 'OPTIONS'){
         res.header('Access-Control-Allow-Methods', 'PUT, GET, DELETE, POST, PATCH');
         return res.status(200).json({});
    }
    next();
});

app.set('port', process.env.PORT || 3000);

// Require Users routes
require('./app/routes/routes.js')(app);

app.post('/api/SingleInvoiceUpload', upload.single('avatar'), function (req, res, next) {

        let getLines = new stream.Transform();
        let getDigitsArray = new stream.Transform();
        let getPatternArray = new stream.Transform();
        let decodeDigits = new stream.Transform();
        let savePattern = new stream.Transform();

        let patterns = [];
        let digits = [];
        let currentPosition = 0;
        let currentCharPosition = 0;
        let line = 0;
        let digitsPattern = {};

        let getdigitsPattern = fs.createReadStream('numberPatterns.txt', 'utf-8');
        let getInvoiceDigits= fs.createReadStream('./uploads/avatar.txt', 'utf-8');

        savePattern._transform = savePatternFunc;
        getLines._transform = getLinesFunc;
        getDigitsArray._transform = getDigitsArrayFunc;
        getPatternArray._transform = getDigitsArrayFunc;
        decodeDigits._transform = decodeDigitsFunc;

        getdigitsPattern
            .pipe(getPatternArray)
            .pipe(savePattern);

        getInvoiceDigits
            .pipe(getLines)
            .pipe(getDigitsArray)
            .pipe(decodeDigits)
            .pipe(fs.createWriteStream('InvoiceReadingResult.txt'));


        function savePatternFunc(chunk, encoding, done) {

            let dig = chunk.toString();
            let digits = JSON.parse(dig);

            for(let i=0; i<10; i++){
                digitsPattern[digits[i]] = i;
            }
            done();
        }

        function getLinesFunc(chunk, encoding, done) {
            let lines = chunk.toString().split('\n\n');

            let self = this;
            lines.forEach(function (line) {
                if(line)
                self.push(line);
            });
            done();
        }
        function decodeDigitsFunc(chunk, encoding, done){

            let digits = JSON.parse(chunk);
            let hasError = false;
            for (let k = 0; k < digits.length; k++) {
                if([digits[k]] in digitsPattern){
                    this.push(''+digitsPattern[digits[k]]);
                }
                else {
                    this.push('?');
                    hasError = true;
                }
            }

            if(hasError)
                this.push(' ILLEGAL');
            this.push('\n');

            done();
        }

        function getDigitsArrayFunc(chunk, encoding, done) {
            let data = chunk.toString();
            for(let i=0; i < data.length; i++) {

                if (digits[currentPosition])
                    digits[currentPosition] += data[i];
                else
                    digits[currentPosition] = data[i];
                currentCharPosition++;

                if (currentCharPosition == 3) {
                    currentCharPosition = 0;
                    currentPosition++;
                }
                if(data[i+1] == '\n' || (line == 2 && digits.length == currentPosition  )){
                    line++;
                    currentPosition = 0;
                    i++;

                }
                if(line == 3) {
                    line = 0;
                    this.push(JSON.stringify(digits));
                    digits = [];


                }
            }
            done();
        }

        getInvoiceDigits.on('end',()=>{
            res.status(200).sendFile('InvoiceReadingResult.txt',{ root: path.join(__dirname) });
        })

        // res.status(200).sendFile('InvoiceReadingResult.txt',{ root: path.join(__dirname) });
  })



app.listen(app.get('port'), () => console.log(`Server is listening on port ${app.get('port')}`));