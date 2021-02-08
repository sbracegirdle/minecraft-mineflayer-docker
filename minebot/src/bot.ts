import {Bot, createBot} from 'mineflayer'
import {mineflayer} from 'prismarine-viewer'

console.log('Launching mineflayer')

type MineflayerViewer = (bot: Bot, options: {port: number; firstPerson: boolean}) => string

const bot = createBot({
  host: process.env.SERVER_HOST,
  port: Number(process.env.SERVER_PORT),
  username: 'minebot',
  version: '1.16.4',
})

bot.on('chat', function (username, message) {
  console.log(username, message)
  if (username === bot.username) return
  bot.chat(message)
})

bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', err => console.log(err))

bot.once('spawn', () => {
  const mfvw: MineflayerViewer = mineflayer as MineflayerViewer
  mfvw(bot, {port: Number(process.env.VIEWER_PORT), firstPerson: true})
  console.log('spawned')
  bot.chat('Yoooooooooooooooooooooo, whatup friends?')
})
