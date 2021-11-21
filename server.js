const http = require('http');
const https = require('https');
// Api Using Node/Express    
var express = require('express');
var cors = require('cors')
var app = express();
var fs = require('fs');

// Add headers before the routes are defined
app.use(cors({ origin: '*' }));
app.use(express.static('public'));
app.get('/', function (req, res) {
    try {
        fs.readFile(__dirname + '/index.html', function (err, data) {
            if (err) {
                throw err;
            }
            res.end(data.toString());
        });
    } catch (err) {
        res.end('error');
        console.log(err);
    }

})

app.get('/search', function (req, res) {
    try {
        https.get(req.query.url, reps => {
            let data = '';
            reps.on('data', chunk => {
                data += chunk;
            })

            reps.on('end', () => {
                res.end(data);
            });
        })
    } catch (e) {
        console.log(e);
        res.end('some error');
    }
});
app.listen(process.env.PORT || 80);
console.log('Server is running on Port 80')