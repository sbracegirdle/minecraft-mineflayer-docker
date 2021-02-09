#!/usr/bin/env bash

docker-compose stop minebot
docker-compose up --build -d
docker-compose logs --tail 100 minebot