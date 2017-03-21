var express = require('express');
var path = require('path');
var fs = require('fs');
var gpio = require('rpi-gpio');

var args = process.argv.slice(2);
if (args.length != 1) {
  console.error('illegal argument count: ' + args.length);
  process.exit(1);
}
var config_file = args[0]
if (!fs.lstatSync(config_file).isFile()) {
  console.error('config file not found');
  process.exit(2);
}

var config = JSON.parse(fs.readFileSync(config_file, 'utf8'));
console.log('port: ' + config.port);
console.log('gpio-open: ' + config['gpio-open']);
console.log('gpio-close: ' + config['gpio-close']);
console.log('pulse-length: ' + config['pulse-length']);

gpio.setMode(gpio.MODE_BCM)
gpio.setup(config['gpio-open'], gpio.DIR_OUT, gpio_cb)
gpio.setup(config['gpio-close'], gpio.DIR_OUT, gpio_cb)

function gpio_cb(err) {
  if (err) throw err;
}

var app = express();

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static(__dirname + '/public'));

app.get('/open', function(req, res) {
  console.log('open ...');
  gpio.write(config['gpio-open'], 1, gpio_cb);
  setTimeout(function() {
    gpio.write(config['gpio-open'], 0, gpio_cb);
    console.log('opened');
    res.send('opened');
  }, config['pulse-length']);
});

app.get('/close', function(req, res) {
  console.log('close ...');
  gpio.write(config['gpio-close'], 1, gpio_cb);
  setTimeout(function() {
    gpio.write(config['gpio-close'], 0, gpio_cb);
    console.log('closed');
    res.send('closed');
  }, config['pulse-length']);
});

app.listen(config.port, function () {
  console.log('listening ...');
});
