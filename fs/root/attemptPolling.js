// node script for development purposes

var b = require('bonescript');

// we poll the devices around in a ring.

var pollingControlPins = ["P9_11", "P9_12", "P9_13", "P9_14"];
var pollingReadDataPins = ["P8_07", "P8_08", "P8_09", "P8_10"];

// set up the sensor control ports by setting them to low
//  - they later go high to ask the sensors to provide accurate data
//  - the sensor data must be read from pollingReadDataPins whilst 
//    the control pin for that sensor is high

pollingControlPins.forEach(function (pin) {
	if (b.pinMode(pin, b.OUTPUT)) {
		console.log("able to set pollingControlPin mode, initializing to zero");
		b.digitalWrite(pin, b.LOW);
	} else {
		console.log("unable to set pollingControlPin mode");
	}

	b.getPinMode(pin, printPinData);
});

// set up the PWM input pins from the sensors
// a sensible value for that sensor is only available
// when the pollingControlPin for that sensor is high

pollingReadDataPins.forEach(function (pin)) {
	if (b.pinMode(pin, b.INPUT)) {
		console.log("able to set pollingReadDataPin mode");
	} else {
		console.log("unable to set pollingReadDataPin mode");
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

function pollSensor3() {
	b.digitalWrite(pins[3], b.HIGH);
	// TODO: read sensor3
	setTimeout(function() {b.digitalWrite(pings[3], b.LOW)}, 1);
	setTimeout(pollSensor0,5);
}

function pollSensor2() {
	b.digitalWrite(pins[2], b.HIGH);
	// TODO: read sensor2
	setTimeout(function() {b.digitalWrite(pings[2], b.LOW)}, 1);
	setTimeout(pollSensor3,5);
}

function pollSensor1() {
	b.digitalWrite(pins[1], b.HIGH);
	// TODO: read sensor1
	setTimeout(function () {b.digitalWrite(pins[1], b.LOW)}, 1);
	setTimeout(pollSensor2,5);	
}

function pollSensor0() {
	b.digitalWrite(pins[0], b.HIGH);
	// TODO: read sensor0
	setTimeout(function () {b.digitalWrite(pins[0], b.LOW)}, 1);
	setTimeout(pollSensor1,5);
}

pollSensor0(); // kick it all off