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

# redis

function stop_redis {
  pm2 stop kxp_redis -s
}

function delete_redis {
  pm2 delete kxp_redis -s
}

function start_redis {
  pm2 start docker --name kxp_redis -s -- run -i --rm -p 6379:6379 redis
}

# bus

function stop_bus {
  pm2 stop kxp_bus -s
}

function delete_bus {
  pm2 delete kxp_bus -s
}

function start_bus {
  pm2 start docker --name kxp_bus -s -- run -i --rm --hostname bushost -p 5672:5672 --name bus rabbitmq:3
}

# dev database server (mongo)
function stop_mongodb {
  pm2 stop kxp_mongodb -s
}
# the tutum/mongodb container doesnt respond to sigint, so we have to
# explicitly call docker stop on it. 
# TODO: dig thru this docker file to learn more about it.
function stop_mongodb_docker {
  docker stop kxp_mongodb
}
function delete_mongodb {
  pm2 delete kxp_mongodb -s
}
function start_mongodb {
  pm2 start docker --name kxp_mongodb -s -- run -i --rm -p 27017:27017 -p 28017:28017 --name kxp_mongodb -e AUTH=no tutum/mongodb
}
function start_mongodb_lt {
  docker run -d -p 27017:27017 -p 28017:28017 --name kxp_mongodb -e AUTH=no tutum/mongodb
}

# development blob (minio/s3)
function stop_blob {
  pm2 stop kxp_blob -s
}
function delete_blob {
  pm2 delete kxp_blob -s
}
function start_blob {
  pm2 start docker --name kxp_blob -s -- run \
    -i --rm \
    -e "MINIO_ACCESS_KEY=RX3ZLBBZ1N5O6447UZ4D" \
    -e "MINIO_SECRET_KEY=9rAi04T4R3X0YKztCZTJdIkOjLdLrXw+unKLoIFE" \
    -p 9000:9000 \
    minio/minio server /export
}
function start_blob_lt {
  docker run \
    -d \
    -e "MINIO_ACCESS_KEY=RX3ZLBBZ1N5O6447UZ4D" \
    -e "MINIO_SECRET_KEY=9rAi04T4R3X0YKztCZTJdIkOjLdLrXw+unKLoIFE" \
    -p 9000:9000 \
    minio/minio server /export
}

# init webserver (copy bootstrap, run sass once)

function start_devserver_init {
  spushd ./client
    npm run kxp:client:init
  spopd
}

# webpack dev server

function stop_devserver {
  pm2 stop kxp_devserver -s
}

function delete_devserver {
  pm2 delete kxp_devserver -s
}

function start_devserver {
  spushd ./client
    npm run kxp:client:devserver
  spopd
}

# saaa watcher

function stop_sasswatch {
  pm2 stop kxp_sasswatch -s
}

function delete_sasswatch {
  pm2 delete kxp_sasswatch -s
}

function start_sasswatch {
  spushd ./client
    npm run kxp:client:sasswatch
  spopd
}

# fs browser (python)

function stop_fsbrowser {
  pm2 stop kxp_fsbrowser -s
}

function delete_fsbrowser {
  pm2 delete kxp_fsbrowser -s
}

function start_fsbrowser {
  spushd ./srvcommand/server
    pm2 start launch.sh --name kxp_fsbrowser -s
  spopd
}

# control server

function stop_ctrlserver {
  pm2 stop kxp_ctrlserver -s
}

function delete_ctrlserver {
  pm2 delete kxp_ctrlserver -s
}

function start_ctrlserver {
  spushd ./srvapi
    # pm2 start index.js --name kxp_ctrlserver -s --watch
    pm2 start npm --name kxp_ctrlserver -s -- run dev
  spopd
}

# client utils

function make_component {
  spushd ./client/src/components
    mkdir $1
    # touch $1/$1.html
    # touch $1/$1.ts
    # touch $1/$1.scss
    # touch $1/index.ts
    PREFIX=$1
    cat ~/.kxp/templates/client_component/component.html | sed \
      -e "s|{{prefix}}|${PREFIX}|g" \
      > $PREFIX/$PREFIX.html
    cat ~/.kxp/templates/client_component/component.ts | sed \
      -e "s|{{prefix}}|${PREFIX}|g" \
      > $PREFIX/$PREFIX.ts
    cat ~/.kxp/templates/client_component/index.ts | sed \
      -e "s|{{prefix}}|${PREFIX}|g" \
      > $PREFIX/index.ts
  spopd
}

VERBOSE=0
LAUNCH=""
STOPPROC=""
DELPROC=""
CREATE=""
CREATE_COMP=""

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
		-c|--create)
      if [ -z "$2" ]
      then
        echo "create: please provide a key"
        exit
      fi
      if [ -z "$3" ]
      then
        echo "create: please provide a name"
        exit
      fi
      CREATE=$2
      CREATE_COMP=$3
      shift
      shift
      shift
			break
			;;
		-s|--stop)
      if [ -z "$2" ]
      then
        echo "stop: please provide a procname"
        exit
      fi
      STOPPROC=$2
      shift
      shift
			break
			;;
		-d|--del)
      if [ -z "$2" ]
      then
        echo "del: please provide a procname"
        exit
      fi
      DELPROC=$2
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

if [ ! -z "$LAUNCH" ]
then
  case $LAUNCH in
    redis)
      start_redis
      pm2 list
      exit
      ;;
    bus)
      start_bus
      pm2 list
      exit
      ;;
    fsbrowser)
      start_fsbrowser
      pm2 list
      exit
      ;;
    coreall)
      start_blob
      start_mongodb
      start_redis
      start_bus
      echo "warming up cache, dal, and messaging infrastructure."
      echo "please be patient."
      echo "WARNING: sleep period is hardcoded in manager.sh"
      # sleep 25
      start_ctrlserver
      start_devserver_init > /dev/null 2>&1
      DEVSRV_STAT=$(pm2 list | grep "kxp_devserver")
      if [ -z "$DEVSRV_STAT" ]
      then
        start_devserver > /dev/null 2>&1
      fi
      # SASSSRV_STAT=$(pm2 list | grep "kxp_sasswatch")
      # if [ -z "$SASSSRV_STAT" ]
      # then
      #   start_sasswatch
      # fi
      sleep 5
      echo "initializing backend with development data."
      # TODO: dev/prod switch needed.
      # load_dev_env_data 
      # tagged_ads
      pm2 list
      exit
      ;;
    *)
      echo "other"
      exit
      ;;
  esac
fi

if [ ! -z "$CREATE" ]
then
  case $CREATE in
    macomp)
      make_component $CREATE_COMP
      exit
      ;;
  esac
fi

if [ ! -z "$STOPPROC" ]
then
  case $STOPPROC in
    fsbrowser)
      stop_fsbrowser
      pm2 list
      exit
      ;;
    coreall)
      stop_redis
      stop_bus
      stop_ctrlserver
      stop_devserver
      stop_sasswatch
      pm2 list
      exit
      ;;
    *)
      echo "other"
      exit
      ;;
  esac
fi

if [ ! -z "$DELPROC" ]
then
  case $DELPROC in
    fsbrowser)
      stop_fsbrowser
      delete_fsbrowser
      pm2 list
      exit
      ;;
    coreall)
      stop_blob
      stop_mongodb
      stop_mongodb_docker
      stop_redis
      stop_bus
      stop_ctrlserver
      stop_devserver
      # stop_sasswatch
      delete_blob
      delete_mongodb
      delete_redis
      delete_bus
      delete_ctrlserver
      delete_devserver
      # delete_sasswatch
      pm2 list
      exit
      ;;
    *)
      echo "other"
      exit
      ;;
  esac
fi
