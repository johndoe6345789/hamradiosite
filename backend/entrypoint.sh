#!/bin/sh
set -e

# Seed the database if topics table is empty
if [ ! -f /app/data/topics.json ] || [ "$(cat /app/data/topics.json 2>/dev/null)" = "[]" ] || [ "$(cat /app/data/topics.json 2>/dev/null)" = "" ]; then
  echo "Seeding database..."
  flask seed-db
fi

exec "$@"
