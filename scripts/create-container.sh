#!/bin/bash
# $1 is for the name of the app to build (app or api)
# $2 is for the version of the container (eg: 1.0.0 or develop)
docker build -f "$1.Dockerfile" -t "dockerhubaneo/armonik_admin_$1:$2" .
