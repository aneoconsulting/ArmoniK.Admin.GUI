#!/bin/bash
if [ $# -ne 2 ]; then
    # $1 is for the name of the app to build (app or api)
    # $2 is for the version of the container (eg: 1.0.0 or develop)
    echo "Usage: $0 <app|api> <image-version>"
    exit 1
fi
docker build -f "$1.Dockerfile" -t "dockerhubaneo/armonik_admin_$1:$2" .
