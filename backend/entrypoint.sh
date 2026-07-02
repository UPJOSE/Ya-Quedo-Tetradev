#!/bin/sh
# Render provides DATABASE_URL as postgres:// or postgresql://
# Spring Boot needs jdbc:postgresql://host:port/db
if [ -n "$DATABASE_URL" ]; then
  DB_URL=$(echo "$DATABASE_URL" | sed -e 's|^postgres://||' -e 's|^postgresql://||')
  DB_USER=$(echo "$DB_URL" | cut -d: -f1)
  DB_PASS=$(echo "$DB_URL" | cut -d: -f2 | cut -d@ -f1)
  DB_HOST_PORT=$(echo "$DB_URL" | cut -d@ -f2 | cut -d/ -f1)
  DB_NAME=$(echo "$DB_URL" | cut -d/ -f2 | cut -d? -f1)
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST_PORT}/${DB_NAME}"
  export SPRING_DATASOURCE_USERNAME="$DB_USER"
  export SPRING_DATASOURCE_PASSWORD="$DB_PASS"
fi

exec java -Dserver.port=${PORT:-8080} -jar /app/app.jar
