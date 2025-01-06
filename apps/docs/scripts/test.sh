#!/usr/bin/env sh
# TODO: implement --coverage, this seems not working
# https://storybook.js.org/docs/8.5/writing-tests/test-coverage#the-coverage-addon-doesnt-support-instrumented-code
npx concurrently -k -s first -n "SB,TEST" -c "magenta,blue" \
    "npx http-server storybook-static --port 6007 --silent" \
    "npx wait-on tcp:127.0.0.1:6007 && STORYBOOK_COVERAGE=true pnpm run test-storybook --coverage --url http://127.0.0.1:6007"