#!/bin/sh
set -e

# Debug: print relevant env vars (helps with Railway vs Render differences)
echo "----- ENTRYPOINT ENV PREVIEW -----"
env | grep -E 'DATABASE_URL|SPRING_DATASOURCE_URL|DB_|PG|PORT|JWT_SECRET|ALLOWED_ORIGINS' || true
echo "---------------------------------"

# Prefer an explicit SPRING_DATASOURCE_URL if provided
if [ -n "$SPRING_DATASOURCE_URL" ]; then
  echo "Using existing SPRING_DATASOURCE_URL"

# If we have a DATABASE_URL (postgres:// or postgresql://), convert it
elif [ -n "$DATABASE_URL" ]; then
  DB_URL=$(echo "$DATABASE_URL" | sed -e 's|^postgres://||' -e 's|^postgresql://||')
  DB_USER=$(echo "$DB_URL" | cut -d: -f1)
  DB_PASS=$(echo "$DB_URL" | cut -d: -f2 | cut -d@ -f1)
  DB_HOST_PORT=$(echo "$DB_URL" | cut -d@ -f2 | cut -d/ -f1)
  DB_NAME=$(echo "$DB_URL" | cut -d/ -f2 | cut -d? -f1)
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST_PORT}/${DB_NAME}"
  # Export the variables that application.properties expects
  export DB_USERNAME="$DB_USER"
  export DB_PASSWORD="$DB_PASS"
  echo "Configured SPRING_DATASOURCE_URL from DATABASE_URL: $SPRING_DATASOURCE_URL"

# Support Railway/Postgres container env vars (PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE)
elif [ -n "$PGHOST" ]; then
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${PGHOST}:${PGPORT:-5432}/${PGDATABASE:-postgres}"
  export DB_USERNAME="${PGUSER:-$DB_USERNAME}"
  export DB_PASSWORD="${PGPASSWORD:-$DB_PASSWORD}"
  echo "Configured SPRING_DATASOURCE_URL from PG* vars: $SPRING_DATASOURCE_URL"

else
  echo "No DATABASE_URL or PG* env vars found; falling back to defaults (may connect to localhost)"
fi

echo "Final SPRING_DATASOURCE_URL=$SPRING_DATASOURCE_URL"
echo "Final DB_USERNAME=${DB_USERNAME:-<unset>}"

exec java -Dserver.port=${PORT:-8080} -jar /app/app.jar
