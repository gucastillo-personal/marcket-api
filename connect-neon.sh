PGHOST="ep-winter-shadow-a507ma9d-pooler.us-east-2.aws.neon.tech"
PGDATABASE="neondb"
PGUSER="neondb_owner"
PGPASSWORD="npg_y6Np8esaSzux"
PGPORT=5432

# Ejecutar psql con conexión SSL
PGPASSWORD=$PGPASSWORD psql "sslmode=require host=$PGHOST port=$PGPORT dbname=$PGDATABASE user=$PGUSER"
