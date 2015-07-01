// node script for development purposes

var b = require('bonescript');

var pins = ["P9_11", "P9_12"];

pins.forEach(function (pin) {
	if (b.pinMode(pin, b.OUTPUT)) {
		console.log("able to set pin mode, initializing to zero");
		b.digitalWrite(pin, b.LOW);
	} else {
		console.log("unable to set pin mode");
	}

	b.getPinMode(pin, printPinData);
});

function printPinData(x) {
	console.log("completed setting pin mode");
	console.log('mux = ' + x.mux);
	console.log('pullup = ' + x.pullup);
	console.log('slew = ' + x.slew);
	console.log('options = ' + x.options.join(','));
	console.log('err = ' + x.err);
}

function pollPin1() {
	b.digitalWrite(pins[1], b.HIGH);
	setTimeout(function () {b.digitalWrite(pins[1], b.LOW)}, 1);
	setTimeout(pollPin0,5);	
}

function pollPin0() {
	b.digitalWrite(pins[0], b.HIGH);
	setTimeout(function () {b.digitalWrite(pins[0], b.LOW)}, 1);
	setTimeout(pollPin1,5);
}

pollPin0(); // kick it all off