#!/usr/bin/env bash
cd "$(dirname "${BASH_SOURCE[0]}")" && source "./common.bash"


export NODE_ENV=test

task="${1-}"
shift 1 || true

filePath="test/fixtures/access-denied.tpl"
touch "$filePath"
chmod -r "$filePath"

case "$task" in
	':unit')
		mocha "$@"
		;;
	':coverage'|':unit:coverage')
		nyc mocha "$@"
		;;
	''|':all')
		nyc mocha "$@"
		;;
	*) fatal "Invalid test target $task" "$EXIT_CODE_INVALID_STATE" ;;
esac
