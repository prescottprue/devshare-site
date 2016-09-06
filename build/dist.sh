#!/usr/bin/env bash
set -e

packageVersion=$(grep version package.json | tr -d \" | tr -d version: | tr -d , | xargs echo)

echo "Package version is $packageVersion"

if [[ "$TRAVIS_BRANCH" == "master" && "$TRAVIS_PULL_REQUEST" == "false" ]]; then
  echo "export const env = 'prod';
  export const packageVersion = '$packageVersion';
  export default {
    env,
    packageVersion
  };" > ./src/config.js
else
  echo "export const env = 'dev';
  export const packageVersion = '$packageVersion';
  export default {
    env,
    packageVersion
  };" > ./src/config.js
fi
