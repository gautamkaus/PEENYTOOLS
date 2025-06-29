#!/bin/bash

echo "Testing connection to remote MySQL server..."
while ! mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" --silent; do
    echo "MySQL server is not reachable. Waiting..."
    sleep 5
done

echo "MySQL server is reachable! Starting the server..."
node server.js 