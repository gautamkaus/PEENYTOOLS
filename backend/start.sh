#!/bin/bash

# Check the environment variables
echo "DB_HOST=$DB_HOST"
echo "DB_PORT=$DB_PORT"
echo "DB_USER=$DB_USER"

# Ensure MySQL is up and accessible
echo "Testing connection to remote MySQL server..."
MAX_RETRIES=5
RETRY_DELAY=5
COUNT=0

until mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" --silent; do
    COUNT=$((COUNT + 1))
    echo "❌ MySQL server is not reachable (Attempt $COUNT/$MAX_RETRIES). Waiting..."
    
    if [ "$COUNT" -ge "$MAX_RETRIES" ]; then
        echo "🚨 ERROR: MySQL server is not reachable after $MAX_RETRIES attempts. Exiting..."
        exit 1
    fi
    
    sleep $RETRY_DELAY
done

echo "✅ MySQL server is reachable! Starting the server..."
node server.js
