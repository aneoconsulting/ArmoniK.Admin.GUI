#!/bin/bash
# check if -h or --help was passed

if [ "$1" == "-h" -o  "$1" == "--help" ]; then
    echo "Usage: $0"
    echo ""

    echo "This script will create a proxy.conf.json file in the project app."
    exit 1
fi

# create proxy.conf.json
echo "{
  \"/api\": {
    \"target\": \"http://localhost:3333\",
    \"secure\": false
  }
}" > ./apps/app/proxy.conf.json
