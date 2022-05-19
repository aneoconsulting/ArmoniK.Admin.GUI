#!/bin/bash
docker build -f "$1.Dockerfile" -t "dockerhubaneo/armonik_admin_$1:$2" .
