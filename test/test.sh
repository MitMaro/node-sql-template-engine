#!/usr/bin/env sh

filePath="test/Runtime/fixtures/access-denied.tpl"
cd `npm prefix`
touch "$filePath"
chmod -r "$filePath"
mocha
