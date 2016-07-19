/*

button.js - handles the press of a single button

*/


var osc = require('osc');
var getopt = require('node-getopt');
var b = require ('bonescript');

opt = getopt.create([
        ['' , 'osc_host=HOST'           , 'the host running OSC to MIDI bridge.'],
        ['' , 'osc_port=[PORT]'         , 'the UDP port for the bridge on that host (8000 is the default).'],
        ['' , 'osc_channel=CHANNEL'   , 'the osc channel that the output is sent to'],
        ['' , 'timer=[TIME_IN_SECONDS]' , 'the number of seconds that the button LED will be down after it is pushed'],
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
var osc_channel = optinos['osc_channel'];
var osc_port = options['osc_port'];
var timer = options['timer'];

// make the client

var fader = osc.createFader(osc_host, osc_port, channel);

//
// Set up the board for inputs / outputs correctly.
//

var LED_PIN = "P8_12";

// set input pin (button)

// set output pin (led)

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
    // this has to be blocking. Might need to use native file IO interface.
    var buffer = new Buffer(1);
    // this will only return when the button is pushed!
    fs.read(buttonfd, 0, 1, 0, button_pushed);
}


// open isn't synchronous. This might be a mistake, might need to use openSync.
var buttonfd = fs.open("/sys/class/gpio/export/gpio7/value", 'rs', read_button);


