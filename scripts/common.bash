#!/usr/bin/env bash

[[ -n "${COMMON_BASH:-}" ]] && return || export COMMON_BASH=1

source "$(npm bin)/build-scripts.bash"

init-node
