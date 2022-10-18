#!/bin/bash
# check if -h or --help was passed

if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
    echo "Usage: $0"
    echo ""

    echo "This script will create a proxy.conf.json file in the project app."
    exit 1
fi

# create proxy.conf.json
echo "{
  \"/api\": {
    \"target\": \"http://localhost:3000\",
    \"secure\": false,
  }
}" > ./apps/app/proxy.conf.json
