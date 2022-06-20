#!/bin/bash
# check if -h or --help was passed
if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
    echo "Usage: $0"
    echo ""

    echo "This script will populate the mongo database with some fixtures (./apps/app-e2e/src/fixtures)."
    echo "The data folder should contain the following files:"
    echo "  - SessionData.json"
    echo "  - TaskData.json"
    echo "You must have a running mongo instance on localhost:27017."
    exit 1
fi
# this script is used to populate a mongo database with data in /apps/app-e2e/src/fixtures/data/{SessionData,TaskData}.json

# load SessionData to mongo
mongoimport --db test --collection SessionData --jsonArray --file ./apps/app-e2e/src/fixtures/data/SessionData.json

# Load TaskData to mongo
mongoimport --db test --collection TaskData --jsonArray --file ./apps/app-e2e/src/fixtures/data/TaskData.json
