#!/usr/bin/env bash

docker-compose stop minebot

set -e

docker-compsoe build minebot
docker-compose up -d minebot
docker-compose logs --tail 100 minebot