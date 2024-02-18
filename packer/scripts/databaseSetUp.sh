#!/bin/bash

# database setup script 

# Download and install postgresql service
sudo dnf -y install https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm
sudo dnf -qy module disable postgresql
sudo dnf -y install postgresql16-server postgresql16 postgresql-contrib
sudo /usr/pgsql-16/bin/postgresql-16-setup initdb
sudo systemctl enable --now postgresql-16

# Move to postgres user to create assignment 2 user and assign previlidges to run application
su - postgres

# Create a PostgreSQL user and database
psql -c "CREATE ROLE assignment2 WITH SUPERUSER CREATEDB LOGIN PASSWORD 'assignment2';"
psql -c "CREATE DATABASE assignment2;"
psql -c "GRANT ALL PRIVILEGES ON SCHEMA public TO assignment2;"
psql -c "GRANT ALL PRIVILEGES ON DATABASE assignment2 TO assignment2;"
psql -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO assignment2;"

psql -c "CREATE ROLE integration WITH SUPERUSER CREATEDB LOGIN PASSWORD 'integration';"
psql -c "CREATE DATABASE integration;"
psql -c "GRANT ALL PRIVILEGES ON SCHEMA public TO integration;"
psql -c "GRANT ALL PRIVILEGES ON DATABASE integration TO integration;"
psql -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO integration;"

exit
