#!/usr/bin/env bash

docker-compose down

set -e

docker-compose up --build -d
docker-compose logs --tail 100 minebot