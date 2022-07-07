  #!/bin/bash
# check if -h or --help was passed
if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
    echo "Usage: $0"
    echo ""

    echo "This script will update the version using the GITHUB_REF_NAME environment variable."
    exit 1
fi

# Get value from GITHUB_REF_NAME (e.g. v1.0.0)
VERSION=$(echo $GITHUB_REF_NAME | sed 's/^v//')

# Update package.json
sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/g" package.json
