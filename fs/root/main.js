// main sensors application

var net = require('net');
var getopt = require('node-getopt');
var sensor = require('sensor.js');
var config = require('./sensors-config.json');

var SMOOTHER_SIZE = 50;

// read command-line arguments

opt = getopt.create([
	['' , 'osc_host=HOST'     , 'the host running OSC to MIDI bridge.'],
	['' , 'osc_port=[PORT]'   , 'the UDP port for the bridge on that host (8000 is the default).'],
	['' , 'debug=IP' , 'dump the raw data from sensor with ip IP to the console.'],
	['' , 'port=[PORT]' , 'the UDP port that this program will listen on (8234 is the default)'],
	['h' , 'help'         , 'display this help'],
	['v' , 'version'      , 'show version']
]).bindHelp();
var options = opt.parseSystem().options; // parse command line

// required options

if (options['osc_host'] == null) {
 	console.error(opt.getHelp());
 	process.exit();
}

// defaults

if (options['osc_port'] == null) {
	options['osc_port'] = 8000;
}
if (options['port'] == null) {
	options['port'] = 8234;
}

if (options['debug'] != null) {
	if (!net.isIPv4(options['debug'])) {
	 	console.error("Invalid sensor IP." + opt.getHelp());
	 	process.exit();	
	}
}

// options to variables

var osc_host = options['osc_host'];
var osc_port = options['osc_port'];
var port = options['port'];
var debug = options['debug'];

console.log("I will be sending OSC to host " + osc_host + " on UDP port " + osc_port);
console.log("I will be listening for sensor UDP data from all IPs, on UDP port " + port);

// load the sensor config

var sensors = []; // array of sensor objects

config.sensors.forEach(function(s) {
	sensors.push(sensor.createSensor(s.ip, SMOOTHER_SIZE, osc_host, osc_port));
});

// Receiving sensor UDP traffic...

/*
we only get values sent to us in response to taking their sense pins high,
so we're constantly ready to accept any value from any sensor.

we then poll each of the configured sensors for a value
*/

// start up the network receiver

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

function decodeDistanceValue(serialData) {
	// extract the serial distance in inches from the received packet,
	// e.g.: <Buffer 00 01 ff fe 52 30 30 39 0d>
	return parseInt(serialData.slice(5, 8).toString()); // magic output format from ultrasonics
}

server.on('message', (msg, rinfo) => { // received UDP packet
	for (var i=0;i<sensors.length;i++) {
		var s = sensors[i];

		if (s.ip == rinfo.address.toString()) {
			s.pushInput(decodeDistanceValue(msg));
			return;
		}
	}

	console.log(`Received packet from unknown sensor: ${rinfo.address} on port ${rinfo.port}`);
});

server.on('listening', () => {
	var address = server.address();
	console.log(`Server listening ${address.address}:${address.port}`);
});

server.on('error', (err) => {
	console.log(`server error:\n${err.stack}`);
	server.close();
	process.exit(1);
});

// bind

server.bind(port, function() {
	poll();
});

// poll

var index = 0;

function sendPollPacket() {
	var s = sensors[index++];

	trigger = new Buffer(1).fill(1);
	offset_into_array = 0;
	bytes_to_send = 1;

	server.send(trigger, offset_into_array, bytes_to_send, 20108, s.ip, function() {
		if (index >= sensors.length) {
			index = 0;
		}
		setTimeout(sendPollPacket, 100);
	});
}

function poll() {
	sendPollPacket();
}
