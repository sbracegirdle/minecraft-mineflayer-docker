# Minecraft server and bot composition

Basic docker composition including a private minecraft server (Java edition), and a [mineflayer](https://github.com/PrismarineJS/mineflayer) based bot that will join that server.

The bot will not do anything, so this serves as a good starting point for developing Minecraft bot projects.


## How to use

```
docker-compose up --build -d
```

Join the minecraft server at `localhost:25565`.


## Minecraft server

Sourced from the official page (https://www.minecraft.net/en-us/download/server/).

Use of this composition assumes you agree with their terms of services.


## Mineflayer

Prismarine minelayer docs available at https://mineflayer.prismarine.js.org/#/.

