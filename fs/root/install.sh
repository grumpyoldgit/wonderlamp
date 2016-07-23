#!/bin/bash

echo Disabling and stopping services...

update-rc.d apache2 disable
/etc/init.d/apache2 stop
update-rc.d lightdm disable
/etc/init.d/lightdm stop
systemctl disable node-red.service
systemctl stop node-red.service
systemctl disable wpa_supplicant.service
systemctl stop wpa_supplicant.service

echo Installing node\'s \"forever\" package

npm install forever -g