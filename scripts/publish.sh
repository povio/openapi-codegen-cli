#!/bin/sh

set -e

# check if the working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "Working directory not clean. Please commit all changes before publishing."
  exit 1
fi

# build, just in case
yarn build

# read version from package.json
VERSION=$(node -p -e "require('./package.json').version")

# create a new git tag or error out if the tag already exists
git tag -a v$VERSION -m "v$VERSION"

echo "Publishing version: v$VERSION"

read -p "Press enter to continue"

git push origin "v$VERSION"