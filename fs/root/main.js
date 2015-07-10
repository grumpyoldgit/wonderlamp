// main polling loop

var b = require('bonescript');

var osc = require('osc.js');
var dsp = require('dsp.js');

// we poll the devices by taking the control pins high in a ring, and reading an
// analog value from the data pin for that sensor while its control pin is high

// a sensible value for each sensor is only available
// when the controlPin for that sensor is high

var controlPins = ["P9_11", "P9_12", "P9_13", "P9_14"];
var dataPins = ["P9_35", "P9_36", "P9_37", "P9_38"];

var client = new osc.Client('192.168.7.1', 8000);

// set up the sensor control pins by setting them to low
//  - they later go high to ask the sensors to provide accurate data
//  - the sensor data must be read from dataPins whilst 
//    the control pin for that sensor is high

controlPins.forEach(function (pin) {
	console.log("setting up pin " + pin);
	if (b.pinMode(pin, b.OUTPUT)) {
		console.log("able to set pollingControlPin mode, initializing to zero");
		b.digitalWrite(pin, b.LOW);
	} else {
		console.log("unable to set pollingControlPin mode");
	}

	b.getPinMode(pin, printPinData);
});

var s = [0,0,0,0];

function printPinData(x) {
	console.log("completed setting pin mode");
	console.log('mux = ' + x.mux);
	console.log('pullup = ' + x.pullup);
	console.log('slew = ' + x.slew);
	console.log('options = ' + x.options.join(','));
	console.log('err = ' + x.err);
}

function pollSensor3() {
	b.digitalWrite(controlPins[3], b.HIGH);
	
	b.analogRead(dataPins[3], function(x) {
		s[3] = x.value.toFixed(4);
	});

	setTimeout(function() {b.digitalWrite(controlPins[3], b.LOW)}, 1);
	setTimeout(pollSensor0,5);
}

function pollSensor2() {
	b.digitalWrite(controlPins[2], b.HIGH);
	
	b.analogRead(dataPins[2], function(x) {
		s[2] = x.value.toFixed(4);
	});

	setTimeout(function() {b.digitalWrite(controlPins[2], b.LOW)}, 1);
	setTimeout(pollSensor3,5);
}

function pollSensor1() {
	b.digitalWrite(controlPins[1], b.HIGH);
	
	b.analogRead(dataPins[1], function(x) {
		s[1] = x.value.toFixed(4);
	});

	setTimeout(function () {b.digitalWrite(controlPins[1], b.LOW)}, 1);
	setTimeout(pollSensor2,5);	
}

function pollSensor0() {
	b.digitalWrite(controlPins[0], b.HIGH);

	// add entire last read round to the dsp stack

	dsp.pushSample(s);

	// send it to the lighting controller
	
	client.send('/1/fader1', s[1].toFixed(4));
	client.send('/1/fader2', s[2].toFixed(4));
	client.send('/1/fader3', s[3].toFixed(4));


	// analog read sensor0

	b.analogRead(dataPins[0], function(x) {
		s[0] = x.value.toFixed(4);
	});
	setTimeout(function () {b.digitalWrite(controlPins[0], b.LOW)}, 1);
	setTimeout(pollSensor1,5);
}

// read command-line arguments..

// node-getopt oneline example.
opt = require('node-getopt').create([
  ['h' , 'host=ARG'            , 'the host running OSC to MIDI bridge.'],
  ['p' , 'port=[ARG]'          , 'the UDP port for the bridge on that host 8000 is the default.'],
  ['h' , 'help'                , 'display this help'],
  ['v' , 'version'             , 'show version']
])              // create Getopt instance
.bindHelp()     // bind option 'help' to default action
.parseSystem(); // parse command line

console.info(opt);

exit();

osc.connect('192.168.7.1', 8000);

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});


/// pollSensor0(); // kick it all off