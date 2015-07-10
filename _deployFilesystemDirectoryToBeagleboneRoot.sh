echo This script will deploy the files in 'fs' to the beaglebone black on the default address

. _config.sh 

if [ -d fs ] ; then
	echo .. done!
else
	echo fs directory is not found!
	echo that should have come in the same repo that you got this script. Where did you get this?
	exit
fi 

rsync -avz --no-o --no-g -e ssh --progress fs/* root@$BONE:/
