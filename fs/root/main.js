// main polling loop

// read command-line arguments..

var getopt = require('node-getopt');
opt = getopt.create([
	['' , 'host=HOST'     , 'the host running OSC to MIDI bridge.'],
	['' , 'port=[PORT]'   , 'the UDP port for the bridge on that host (8000 is the default).'],
	['' , 'debug=[SENSOR]' , 'dump the raw data from sensor with number SENSOR (0-5) to the console.'],
	['h' , 'help'         , 'display this help'],
	['v' , 'version'      , 'show version']
]).bindHelp();
var options = opt.parseSystem().options; // parse command line

if (options['host'] == null) {
 	console.error(opt.getHelp());
 	process.exit();
}
if (options['port'] == null) {
	options['port'] = 8000;
}

var debug = null; // which port to output to console.

if (options['debug'] != null) {
	try {
		debug = parseInt(options['debug']);
		if (debug < 0 || debug > 5) {
			throw "Invalid sensor number";
		}
	} catch (ex){
	 	console.error("Invalid sensor number " + opt.getHelp());
	 	process.exit();	
	}
}

console.log("Using host " + options['host'] + " and port " + options['port']);

var b = require('bonescript');

var osc = require('osc.js');
var dsp = require('dsp.js');

osc.connect(options['host'], options['port']);

// we poll the devices by taking the control pins high in a ring, and reading an
// analog value from the data pin for that sensor while its control pin is high

// a sensible value for each sensor is only available
// when the controlPin for that sensor is high

var controlPins = ["P9_11", "P9_12", "P9_13", "P9_14", "P9_15", "P9_16"];
var dataPins = ["P9_33", "P9_35", "P9_36", "P9_37", "P9_39", "P9_40"];

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

function printPinData(x) {
	console.log("completed setting pin mode");
	console.log('mux = ' + x.mux);
	console.log('pullup = ' + x.pullup);
	console.log('slew = ' + x.slew);
	console.log('options = ' + x.options.join(','));
	console.log('err = ' + x.err);
}

var numberOfChannels = 4;
var sample = new Array();

/*
this function pushes a single sample to the DSP stack, and retrieves
a single sample from the DSP stack. If the stack decides that there is no
data worth sending, it will return null. If the stack decides that some
channels are not worth sending, just those values will be null.
*/

function pushToFaderSon() {

	// add entire last read round to the dsp stack

	dsp.pushInput(sample);

	var o = dsp.getOutput();
	if (o != null) {
		for (var i=0; i<o.length; i++) {
			if (o[i] != null) {
				osc.transmitFaderData(i, o[i]);
			}
		}
	}
}

var count = 0;

// for the debug output - needed to produce the debug 'ghetto oscilloscope'

String.prototype.repeat = function( num ) {
    return new Array( num + 1 ).join( this );
}


function pollSensorNumber(sensorIndex) {
	b.digitalWrite(controlPins[sensorIndex], b.HIGH); // set poll pin high

	if (sample[sensorIndex] == undefined) { // autoscale sample size to number of sensors
		sample.push(0);
	}

	var nextSensorIndex = sensorIndex + 1;

	if (nextSensorIndex >= numberOfChannels) {
		pushToFaderSon(); // transmit sample (if available)
		nextSensorIndex = 0;
		count++;
	}

	// analog read sensorN
	
	b.analogRead(dataPins[sensorIndex], function(x) {
		sample[sensorIndex] = x.value.toFixed(6);
		if (sensorIndex == debug) {
			console.log("**".repeat(Math.round((x.value.toFixed(6) * 10))));
		}
	});

	// close polling pin for this sensor in 1 millisecond
	setTimeout(function () {b.digitalWrite(controlPins[sensorIndex], b.LOW)}, 1);

	// read next sensor in 5 milliseconds
	setTimeout(pollSensorNumber,3,nextSensorIndex);
}

pollSensorNumber(0); // kick it all off


