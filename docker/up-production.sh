#!/bin/bash
source "./docker/lib.sh"

# Optimized for the least downtime
prisma-deploy
docker-compose-production down --remove-orphans
docker-compose-production up --detach
