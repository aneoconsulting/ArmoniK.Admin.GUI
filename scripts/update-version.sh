#!/bin/bash
# Script to update the version of the package.json file, the app (pages.component.html) and the api (app.controller.ts)

# If no version is passed, failed
if [ $# -ne 1 ]; then
    echo "Usage: $0 <version>"
    exit 1
fi

# If -h or --help is passed, failed
if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
    echo "Usage: $0 <version>"

    echo "This script will update the version in all the projet using the argument as the version."
    echo "The version follow semver format (eg: 1.0.0)."
    exit 0
fi

# Replace version in package.json file
sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$1\"/g" package.json
echo "Version updated in package.json"

# Replace version in app.controller.ts file
sed -i "s/version: '[^']*'/version: '$1'/g" apps/api/src/app/app.controller.ts
echo "Version updated in app.controller.ts"

# Replace version in pages.component.html file
sed -i "s/<span> v[^ ]* <\/span>/<span> v$1 <\/span>/g" apps/app/src/app/pages/pages.component.html
echo "Version updated in pages.component.html"
