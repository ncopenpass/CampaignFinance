#!/bin/sh
# wait-for-postgres.sh

set -e

dburl="$1"
shift

# If DBURL does not exist, default to the .env
if [ -z $dburl ];
  then
    eval $(egrep -v '^#' server/.env | xargs)
    dburl=$DATABASE_URL
fi

until psql "$dburl" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up"
