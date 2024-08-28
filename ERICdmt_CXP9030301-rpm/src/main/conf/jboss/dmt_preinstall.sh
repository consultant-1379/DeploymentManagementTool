#!/bin/bash
# preinstall script for DMT service


if [ $1 -gt 1 ]; then 

	echo "Stopping DMT(JBoss)...."
	service dmt_service stop 2>/dev/null

	echo "Killing all leftover processes...."
	pgrep -u dmt_jboss >/dev/null 2>&1
	RETVAL=$?
	if [ $RETVAL -eq '0' ]; then
		 echo "DMT(JBOSS) has a remaining process...."
		 killall -KILL -u dmt_jboss
		 RETVAL=$?
		 echo "killall returns: $RETVAL"
		 if [ $RETVAL -eq '0' ]; then 
			echo "Remaining proccess stopped...."
		 else
		echo "Could not terminate remaining process...."
		 fi
	else
		 echo "dmt_jboss has no remaining processes"
	fi

fi