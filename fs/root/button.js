/*

button.js - handles the press of a single button

*/


// https://github.com/fivdi/onoff

var onoff = require ('onoff');
var osc = require('osc');
var getopt = require('node-getopt');
var fs = require('fs');

opt = getopt.create([
        ['' , 'osc_host=HOST'           , 'the host running OSC to MIDI bridge.'],
        ['' , 'osc_channel=CHANNEL'   , 'the osc channel that the output is sent to'],
        ['' , 'osc_port=[PORT]'         , 'the UDP port for the bridge on that host (8000 is the default).'],
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

var toggle = osc.createToggle(osc_host, osc_port, osc_channel);

//
// Set up the board for inputs / outputs correctly.
//

// http://beaglebone.cameon.net/home/using-the-gpios

var BUTTON_GPIO = "30"; // pin 11
var LED_GPIO = "31"; // pin 13

// Force unexport first, in case we didn't shut down cleanly last time

try {
    fs.writeFileSync("/sys/class/gpio/unexport", BUTTON_GPIO);
} catch (err) {}

try {
    fs.writeFileSync("/sys/class/gpio/unexport", LED_GPIO);
} catch (err) {}

var LED_ON = 1;
var LED_OFF = 0;

function led_on () {
    console.log("... led on");
    led.writeSync(LED_ON);
}
function led_off() {
    console.log("... led off");
    led.writeSync(LED_OFF);
}

// do reading / state machine...

var listening = true; // ISR fast-close path

var counter = 0;

function button_isr() {
    if (listening == false) { // if we're still handling the last press
        return;
    }
    listening = false;

    counter++;
    console.log("Button pushed " + counter.toString() + " time(s)");

    // reset OSC device after 1s

    console.log("... setting toggle");
    toggle.send(true);

    setTimeout(function() {
        console.log("... resetting toggle");
        toggle.send(false);
    }, 30 * 1000); // 30 seconds before toggle gets reset to lightjams

    // reset LED and button listening after ~ 20 minutes

    led_off();

    setTimeout(function() {
        console.log("... resetting button");
        led_on();
        listening = true;
    }, timer * 1000);
}

// initialize devices

console.log("Initializing...");

var button = onoff.Gpio(BUTTON_GPIO, "in", "both");
var led = onoff.Gpio(LED_GPIO, "out");

led_on();

button.watch(button_isr);

function shutdown() {
    console.log("Shutting down.");
    led_off();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);