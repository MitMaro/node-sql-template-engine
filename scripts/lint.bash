#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE[0]}")" && source "./common.bash"

info "Running ESLint"
eslint --ext .ts --fix "$@" .

info "Running TSLint"
tslint --project tsconfig.json --format stylish --config tslint.json "$@" 'src/**/*.ts'
