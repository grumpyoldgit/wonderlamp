# Wonderlamp sensor array code

## Requires 

A beaglebone black, flashed with Debian. The static IP 192.168.7.2 is the USB host <-> beaglebone black virtual ethernet over usb networking address, for the beaglebone end. This is configurable in _config.sh if you've changed it from the default. 

The drivers are in this repo if you need them.

Flashing is achieved by writing the Debian image to a microSD card and then powering on the devie with S2 push-button depressed. [Detailed instructions are available on adafruit's website](https://learn.adafruit.com/beaglebone-black-installing-operating-systems/flashing-the-beaglebone-black), then once it has booted from the SD card, login and edit the file /boot/uEnv.txt, uncommenting the eMMC flash line. Then shutdown, power down and power back up with the S2 push-button again depressed. Hold it till the blue lights are all on, then you'll see the blue lights go all knightrider while the SD card flashes to the eMMC. This will take about 30 minutes. When the blue lights go solid, flashing is complete and you can power down, eject the SD and store it somewhere safe as a useful reset, then power on the beaglebone into your new system.

Be sure to remove the SD card if you end up enabling 'autoflash' after flashing, otherwise the bone will flash every boot, erasing your changes.


## Provides

Simple human-memory free access to your beaglebone on the right IP address, scripts to deploy any addition to the filesystem you wish on the beaglebone using rsync from a single command (you can change the contents of 'fs' easily enough!)

Also provides the code to poll sensors and ship that data off to the lighting control system, presenting an instrument over OSC.

