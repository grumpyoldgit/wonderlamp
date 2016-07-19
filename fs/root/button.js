/*

button.js - handles the press of a single button

*/


var osc = require('osc');
var getopt = require('node-getopt');
var fs = require('fs');

opt = getopt.create([
        ['' , 'osc_host=HOST'           , 'the host running OSC to MIDI bridge.'],
        ['' , 'osc_port=[PORT]'         , 'the UDP port for the bridge on that host (8000 is the default).'],
        ['' , 'osc_channel=CHANNEL'   , 'the osc channel that the output is sent to'],
        ['' , 'timer=[TIME_IN_SECONDS]' , 'the minimum time between triggers'],
        ['h' , 'help'                           , 'display this help'],
        ['v' , 'version'                        , 'show version']
]).bindHelp();
var options = opt.parseSystem().options; // parse command line

// required options

if (options['osc_host'] == null || options['osc_channel'] == null) {
    console.error(opt.getHelp());
    process.exit();
}

// defaults

if (options['osc_port'] == null) {
    options['osc_port'] = 8000;
}
if (options['timer'] == null) {
    options['timer'] = 20*60; // 20 minutes default
}

var osc_host = options['osc_host'];
var osc_channel = options['osc_channel'];
var osc_port = options['osc_port'];
var timer = options['timer'];

// make the client

var fader = osc.createFader(osc_host, osc_port, osc_channel);

//
// Set up the board for inputs / outputs correctly.
//

// http://beaglebone.cameon.net/home/using-the-gpios

var SWITCH_GPIO = "30"; // pin 11
var LED_GPIO = "31"; // pin 13

function _getPinString(number) {
    return ("/sys/class/gpio/gpio" + number.toString() + "/");
}

function exportPin(number, callback) {
    fs.writeFile("/sys/class/gpio/export", SWITCH_GPIO, callback);
}

function setPinRead(number, rising, callback) {
    fs.writeFile(_getPinString(number) + "direction", "in", callback);
    if (rising == true) {
        fs.writeFile(_getPinString(number) + "edge", "rising");
    } else {
        fs.writeFile(_getPinString(number) + "edge", "falling");
    }
}

function setPinWrite(number) {
    fs.writeFile(_getPinString(number) + "direction", "out");
}

function readPin(number, blocking, callback) {
    var buffer = new Buffer(1);
    var mode = "r";
    if (blocking == true) {
        mode += "s";
    }
    var buttonfd = fs.open(_getPinString(SWITCH_GPIO)+"value", 'rs', function (callback) {
        fs.read(buttonfd, 0, 1, 0, callback);
    };
}

// TODO: set output pin (led)

// handle events

function button_ready() {
    // switch on the LED
    b.digitalWrite(LED_PIN, b.HIGH);
    setImmediate(read_button);
}

function button_pushed_complete() {
    fader.send(0);
}

function button_pushed() {
    b.digitalWrite(LED_PIN, b.LOW);
    fader.send(255);
    setTimeout(button_pushed_complete, 200); // resets after 200 ms
    setTimeout(button_ready, timer * 1000); // resets after ~ 20 minutes
}

function read_button() {
    // this has to be blocking to read an edge
    // this will only return when the button is pushed!
    readPin(SWITCH_GPIO, true, button_pushed);
}

// set input pin (switch)

exportPin(SWITCH_GPIO, function () {

	console.log("setting pin read");

    setPinRead(SWITCH_GPIO, true, function () {

        console.log("reading button..");

        read_button();
    });
});