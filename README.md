# Wonderlamp sensor array code

## Requires 

A beaglebone black, flashed with Debian. The static IP 192.168.7.2 is the USB host <-> beaglebone black virtual ethernet over usb networking address, for the beaglebone end. This is configurable in _config.sh if you've changed it from the default. 

The drivers are in this repo if you need them.

Flashing is achieved by writing the Debian image to a microSD card and then powering on the devie with S2 push-button depressed. [Detailed instructions are available on adafruit's website](https://learn.adafruit.com/beaglebone-black-installing-operating-systems/flashing-the-beaglebone-black)

Be sure to remove the SD card if you end up enabling 'autoflash' after flashing, otherwise the bone will flash every boot, erasing your changes.


## Provides

Simple human-memory free access to your beaglebone on the right IP address, scripts to deploy any addition to the filesystem you wish on the beaglebone using rsync from a single command (you can change the contents of 'fs' easily enough!)

Also provides the code to poll sensors and ship that data off to the lighting control system, presenting an instrument over OSC.

