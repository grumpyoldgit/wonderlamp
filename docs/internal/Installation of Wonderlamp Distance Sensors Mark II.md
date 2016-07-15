# Installation of Wonderlamp Distance Sensors Mark II

## Build the sensors

For each sensor unit:
* Build (solder, press-together board, press-together box, tape)
* Configure (proper settings below)
* Label (mark host ID within subnet on the label)
* Install according to wiring diagram

## Setup the Beaglebone

Configure the beaglebone:
* Connect it via usb to your laptop
* Install the usb networking drivers
* Download the github.com/grumpoldgit/wonderlamp
* Deploy the root filesystem to it by running _deployFilesystemDirectoryToBeagleboneRoot.sh
* Reboot it by running _rebootBeaglebone.sh
* When it comes back up, get a shell on it by running _shellOnBeaglebone.sh

## Configure and run the node software

Configure the node software:
* Edit sensors-config.json to reflect the sensor units you have on the network

Run the node software:
* In the root directory, run

```bash
$ node main.js -h
Usage: node main.js

      --osc_host=HOST    the host running OSC to MIDI bridge.
      --osc_port=[PORT]  the UDP port for the bridge on that host (8000 is the default).
      --port=[PORT]      the UDP port that this program will listen on (8234 is the default)
  -h, --help             display this help
  -v, --version          show version

$ node main.js --osc_host 10.0.0.100 --osc_port 9999 --port 8234
```

* Follow the usage to connect the node software to your OSC host

## Test the installation

Verify the installation:
* Test each sensor by walking in front of it
* Debug is available for each sensor in sensors-config.json

