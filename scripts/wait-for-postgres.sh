#!/bin/sh
# wait-for-postgres.sh

set -e

dburl="$1"
shift

until psql "$dburl" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up"
