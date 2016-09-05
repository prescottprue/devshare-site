#!/usr/bin/env bash
set -e

packageVersion=$(grep version package.json | tr -d \" | tr -d version: | tr -d , | xargs echo)

echo "Package version is $packageVersion"

if [[ "$TRAVIS_BRANCH" == "master" && "$TRAVIS_PULL_REQUEST" == "false" ]]; then
  echo "export const env = 'prod';
  export const packageVersion = '$packageVersion';
  export default {
    envUrls,
    env,
    packageVersion
  };" > ./src/config.js
fi
