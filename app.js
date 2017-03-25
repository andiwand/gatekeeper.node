var express = require('express');
var path = require('path');
var fs = require('fs');

var args = process.argv.slice(2);
if (args.length != 1) {
  console.error('illegal argument count: ' + args.length);
  process.exit(1);
}
var config_file = args[0];
if (!fs.lstatSync(config_file).isFile()) {
  console.error('config file not found');
  process.exit(2);
}

var config = JSON.parse(fs.readFileSync(config_file, 'utf8'));
console.log('name: ' + config.name);
console.log('port: ' + config.port);
console.log('serve-content: ' + config['serve-content']);
console.log('hardware: ' + config.hardware);
console.log('gpio-open: ' + config['gpio-open']);
console.log('gpio-close: ' + config['gpio-close']);
console.log('pulse-length: ' + config['pulse-length']);

if (config.hardware == 'virtual') {
  function pulse(length, pin, callback) {
    setTimeout(callback, length);
  }
} else if (config.hardware == 'rpi') {
  var gpio = require('rpi-gpio');
  gpio.setMode(gpio.MODE_BCM);
  gpio.setup(config['gpio-open'], gpio.DIR_OUT, gpio_cb);
  gpio.setup(config['gpio-close'], gpio.DIR_OUT, gpio_cb);
  
  function gpio_cb(err) {
    if (err) throw err;
  }
  function pulse(length, pin, callback) {
    gpio.write(pin, 1, gpio_cb);
    setTimeout(function() {
      gpio.write(pin, 0, gpio_cb);
      callback();
    }, length);
  }
} else {
  console.error('unknown hardware: ' + config.hardware);
  process.exit(3);
}

var app = express();

if (config['serve-content']) {
  app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
  app.use(express.static(__dirname + '/public'));
}

app.get('/open', function(req, res) {
  console.log('open ...');
  pulse(config['pulse-length'], config['gpio-open'], function() {
    console.log('opened');
    res.send('opened');
  });
});

app.get('/close', function(req, res) {
  console.log('close ...');
  pulse(config['pulse-length'], config['gpio-close'], function() {
    console.log('closed');
    res.send('closed');
  });
});

app.listen(config.port, function () {
  console.log('listening ...');
});
