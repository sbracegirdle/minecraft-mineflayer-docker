import {Bot, createBot} from 'mineflayer'
import {pathfinder} from 'mineflayer-pathfinder'
import {mineflayer} from 'prismarine-viewer'

import {createBehaviourTree, tick} from './behaviourTree'

console.log('Launching mineflayer')

type MineflayerViewer = (bot: Bot, options: {port: number; firstPerson: boolean}) => string

export const bot = createBot({
  host: process.env.SERVER_HOST,
  port: Number(process.env.SERVER_PORT),
  username: 'minebot',
  version: '1.16.4',
})

bot.loadPlugin(pathfinder)

bot.on('chat', function (username, message) {
  console.log(username, message)
  if (username === bot.username) return
  bot.chat(message)
})

bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', err => console.log(err))

bot.once('spawn', () => {
  const viewer: MineflayerViewer = mineflayer as MineflayerViewer
  viewer(bot, {port: Number(process.env.VIEWER_PORT), firstPerson: true})
  console.log('spawned')
  bot.chat('Yoooooooooooooooooooooo, whatup friends?')

  // setupStateMachine()
  const tree = createBehaviourTree()

  tick(tree).catch(e => console.log(e))
})
