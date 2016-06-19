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

var debug = null; // which IP to output to console.

o = options['debug']

var net = require('net'); // we'll be needing this

if (o != null) {
	if (net.isIPv4(o)) {
		debug = o;
	} else {
	 	console.error("Invalid sensor IP." + opt.getHelp());
	 	process.exit();	
	}
}

console.log("I will be sending OSC to host " + options['host'] + " on UDP port " + options['port']);
console.log("I will be listening for sensor UDP data on all IPs, on UDP port 31337.");


/*

Receiving sensor UDP traffic...

*/

// hopefully the value from a sensor only changes when
// we take it's control pin high!
//
// otherwise just accepting every value we get isn't going to work:


// we receive from anywhere, accomodating new sensors with a new smoother object
// and a new place to store a previous value:

var sensors = []; // associative array of IP addresses to previous values
var sensor = require('sensor.js');

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => { // received UDP packet
  
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

  if (sensors[rinfo.address] == undefined) {  // the first we're hearing from this sensor
    sensors[rinfo.address] = sensor.newSensor(); // make a new sensor object for it
  }

  s = sensors[rinfo.address];

  // not sure what I've got to do here - do I need to stream reconstruct the serial data? Does it come one character at a time?

});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
  process.exit(1);
});


server.bind(31337);


var osc = require('osc.js');
osc.connect(options['host'], options['port']);


// we poll the devices by taking the control pins high in a ring, and reading changes
// in the values we receive over UDP.

for (var sensor in sensors) {
	console.log("polling sensor on IP " + sensor);
}
