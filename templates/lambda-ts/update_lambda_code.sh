#!/usr/bin/env bash
#
# This script updates the code of already deployed AdminFunction.
# update_lambda_code.sh <stack-name> <AWS profile name> [<lambda name>]
#
set -euo pipefail

STACK_NAME=${1:-xxxxx-dev}
PROFILE=${2:-xxxxx-lambda-dev}
LAMBDA_FULL_NAME=${3:-${STACK_NAME}-FunctionName}

mkdir -p ./build

REBUILD=0
if [[ ! -d ./build/node_modules ]]; then
  REBUILD=1
fi

if [[ lambda/package.json -nt ./build/package.json ]]; then
  echo "Looks like the package.json changed. We will run npm install."
  REBUILD=1
fi

(cd lambda && npm run build)

rsync -av lambda/dist/ ./build

if [[ $REBUILD == 1 ]]; then
  (cd ./build && npm install --production)
fi

set +e
(cd ./build && zip -ur "../lambda.zip" .)
set -e

echo "Updating ${LAMBDA_FULL_NAME}"

aws lambda update-function-code \
  --function-name="${LAMBDA_FULL_NAME}" \
  --zip-file "fileb://lambda.zip" \
  --profile ${PROFILE}
