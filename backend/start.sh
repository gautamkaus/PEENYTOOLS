#!/bin/bash

echo "==============================="
echo "🚀 Starting Peeny Backend Setup"
echo "==============================="

# Print DB environment vars (don't log password directly!)
echo "🔧 Environment Variables:"
echo "DB_HOST=$DB_HOST"
echo "DB_PORT=$DB_PORT"
echo "DB_USER=$DB_USER"
echo "DB_NAME=$DB_NAME"

# Use MYSQL_PWD to avoid -p parsing issues (don't log this)
export MYSQL_PWD="$DB_PASSWORD"

# Wait for MySQL to be ready
echo "🔍 Testing connection to remote MySQL server..."
MAX_RETRIES=5
RETRY_DELAY=5
COUNT=0

until mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" --silent; do
  COUNT=$((COUNT + 1))
  echo "❌ MySQL server is not reachable (Attempt $COUNT/$MAX_RETRIES). Retrying in $RETRY_DELAY sec..."
  
  if [ "$COUNT" -ge "$MAX_RETRIES" ]; then
    echo "🚨 ERROR: MySQL server is not reachable after $MAX_RETRIES attempts. Exiting."
    exit 1
  fi
  
  sleep $RETRY_DELAY
done

echo "✅ MySQL server is reachable! Starting the Node.js server..."
echo "==============================="

# Start the Node.js app
node server.js

# Optional: catch failure
EXIT_CODE=$?
if [ "$EXIT_CODE" -ne 0 ]; then
  echo "💥 Node.js server crashed or exited with code $EXIT_CODE"
  exit $EXIT_CODE
fi
