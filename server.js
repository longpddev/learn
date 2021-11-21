const http = require('http');
const https = require('https');
// Api Using Node/Express    
var express = require('express');
var cors = require('cors')
var app = express();

// Add headers before the routes are defined
app.use(cors({ origin: '*' }));

app.get('/', function (req, res) {
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
    }
});
app.listen(process.env.PORT || 8080);
console.log('Server is running on Port 8080')