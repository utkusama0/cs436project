#!/bin/bash

apt-get update
apt-get install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# Configure PostgreSQL as a replica
systemctl stop postgresql
rm -rf /var/lib/postgresql/13/main
su - postgres -c 'pg_basebackup -h ${primary_ip} -U postgres -D /var/lib/postgresql/13/main -P -R'
echo "primary_conninfo = 'host=${primary_ip} port=5432 user=postgres password=${db_password}'" >> /etc/postgresql/13/main/postgresql.conf
touch /var/lib/postgresql/13/main/standby.signal
systemctl start postgresql
