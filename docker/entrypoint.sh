#!/bin/sh
set -e

node apps/agent/dist/index.js &
node apps/backend/dist/index.js &
node apps/frontend/.next/standalone/server.js &

wait -n
exit $?