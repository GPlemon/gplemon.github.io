
//Node response.setHeader('Content-Type', 'text/html');


//-----------------------------------------------------$ npm install cors
var express = require('express');
var cors = require('cors');
var app = express();
 
app.use(cors());
 
app.get('/hello/:id', function (req, res, next) {
  res.json({msg: 'Hello world, we are CORS-enabled!'});
});
 
app.listen(80, function () {
  console.log('CORS-enabled web server is listening on port 80');
});