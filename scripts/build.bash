#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE[0]}")" && source "./common.bash"

rm -rf "./lib/"
rm -rf "./types/"

tsc -p tsconfig-build.json "$@"
