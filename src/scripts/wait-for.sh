#!/bin/sh
# wait-for.sh

set -e
  
host="$1"
shift
cmd="$@"
  
until nc -z "$host" "${2:-5432}"; do
  >&2 echo "Waiting for PostgreSQL to become available... - sleeping"
  sleep 1
done
  
>&2 echo "PostgreSQL is up - executing command"
exec $cmd