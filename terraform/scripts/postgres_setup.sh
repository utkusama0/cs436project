#!/bin/bash

apt-get update
apt-get install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# Configure PostgreSQL
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '${db_password}';"
sudo -u postgres psql -c 'CREATE DATABASE student_management;'

# Update pg_hba.conf to allow remote connections
echo 'host all all 0.0.0.0/0 md5' >> /etc/postgresql/13/main/pg_hba.conf
echo "listen_addresses = '*'" >> /etc/postgresql/13/main/postgresql.conf

# Restart PostgreSQL to apply changes
systemctl restart postgresql
