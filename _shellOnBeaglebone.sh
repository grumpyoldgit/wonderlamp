. _config.sh

# added -e for OS X, might not work on others
sed -i -e '/^192.168.7.2 .*/d' ~/.ssh/known_hosts 

ssh -oStrictHostKeyChecking=no root@$BONE
