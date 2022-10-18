#!/bin/bash
# check if -h or --help was passed

if [ "$1" == "-h" -o  "$1" == "--help" ]; then
    echo "Usage: $0"
    echo ""

    echo "This script will create a proxy.conf.json file in the project app."
    exit 1
fi

dir=$(dirname $0)

# create proxy.conf.json
echo "{
  \"/api\": {
    \"target\": \"http://localhost:3333\",
    \"secure\": false
  }
}" > $dir/../apps/app-e2e/proxy.conf.json
