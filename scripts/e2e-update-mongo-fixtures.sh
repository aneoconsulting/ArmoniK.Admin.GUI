#!/bin/bash
# check if -h or --help was passed
if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
    echo "Usage: $0"
    echo ""

    echo "This script will update date in some fixtures to populate mongodb (./apps/app-e2e/src/fixtures)."
    exit 1
fi
# create a variable for the current date in milliseconds
date_in_milliseconds=$(date +%s%N | cut -b1-13)

# search for <date> in ./apps/app-e2e/src/fixtures/data/SessionData.json
# and replace it with the current date in milliseconds
sed -i "s/<date>/$date_in_milliseconds/g" ./apps/app-e2e/src/fixtures/data/SessionData.json

# search for <date> in ./apps/app-e2e/src/fixtures/data/TaskData.json
# and replace it with the current date in milliseconds
sed -i "s/<date>/$date_in_milliseconds/g" ./apps/app-e2e/src/fixtures/data/TaskData.json
