#!/bin/bash

echoerr()
{
    echo "$@" 1>&2;
}

spushd()
{
    pushd "$1" 2>&1> /dev/null
}

spopd()
{
    popd 2>&1> /dev/null
}

function help {
	cat <<!EOF!	
Usage: manager.sh [--help|-h] [-v|--verbose] [-l|--launch procname] 

-v|--verbose   - turn on verbose logging
-l|--launch procname - launch a worker process
!EOF!
}

function start_redis {
  pm2 start bin/docker_run_redis.sh
}

function start_bus {
  pm2 start bin/docker_run_rabbitmq.sh
}

function start_devserver_init {
  spushd ./client
    npm run kxp:client:init
  spopd
}

function start_devserver {
  spushd ./client
    npm run kxp:client:devserver
  spopd
}

function start_sasswatch {
  spushd ./client
    npm run kxp:client:sasswatch
  spopd
}

VERBOSE=0
LAUNCH=""

while : 
do
	case $1 in
		-v|--verbose)
      VERBOSE=1
			shift
			;;
		-h|--help)
			help
			exit
			;;
		-l|--launch)
      if [ -z "$2" ]
      then
        echo "launch: please provide a procname"
        exit
      fi
      LAUNCH=$2
      shift
      shift
			break
			;;
		-*)
			echo Unrecognized option: $1
			echo
			help
			exit
			break
			;;
		*)
			break
			;;
	esac
done

echo $VERBOSE
echo $LAUNCH

if [ ! -z "$LAUNCH" ]
then
  case $LAUNCH in
    redis)
      echo "redis"
      start_redis
      exit
      ;;
    bus)
      echo "bus"
      start_bus
      exit
      ;;
    coreall)
      start_redis
      start_bus
      start_devserver_init
      start_devserver
      start_sasswatch
      exit
      ;;
    *)
      echo "other"
      exit
      ;;
  esac
fi
