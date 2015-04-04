echo This script will deploy a list of directories to a Beaglebone black on the default address

export FILES=/Users/bwinston/Documents/beaglebone/src/wonderlampsensor
export DIRS="root"

echo First it checks that the repo is here...
ls -la $REPO

if [ -e $REPO ] ; then
	echo .. done!
else
	echo $REPO is not found!
	echo Maybe try checking it out?
	exit
fi 

rsync -avz -e ssh --progress $REPO/* root@192.168.7.2:/root/
