var express = require('express');
var path = require('path');

var app = express();

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static(__dirname + '/public'));

app.get('/open', function(req, res) {
  console.log('open');
  res.send('opened')
});

app.get('/close', function(req, res) {
  console.log('close');
  res.send('closed')
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
