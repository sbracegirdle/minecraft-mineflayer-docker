import {Bot, createBot} from 'mineflayer'
import {pathfinder} from 'mineflayer-pathfinder'
import {
  StateTransition,
  BotStateMachine,
  EntityFilters,
  BehaviorFollowEntity,
  BehaviorGetClosestEntity,
  NestedStateMachine,
  EntityFiltersHeader,
  BehaviorIdle,
  StateMachineTargets,
  BehaviorLookAtEntity,
} from 'mineflayer-statemachine'
import {mineflayer} from 'prismarine-viewer'

console.log('Launching mineflayer')

type MineflayerViewer = (bot: Bot, options: {port: number; firstPerson: boolean}) => string

const bot = createBot({
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
  const mfvw: MineflayerViewer = mineflayer as MineflayerViewer
  mfvw(bot, {port: Number(process.env.VIEWER_PORT), firstPerson: true})
  console.log('spawned')
  bot.chat('Yoooooooooooooooooooooo, whatup friends?')

  const targets: StateMachineTargets = {}

  const getClosestPlayer = new BehaviorGetClosestEntity(
    bot,
    targets,
    (EntityFilters() as EntityFiltersHeader).PlayersOnly,
  )
  const idle = new BehaviorIdle()

  const followPlayer = new BehaviorFollowEntity(bot, targets)
  const lookAtPlayer = new BehaviorLookAtEntity(bot, targets)

  const transitions = [
    new StateTransition({
      parent: idle,
      child: getClosestPlayer,
      shouldTransition: () => true,
    }),

    new StateTransition({
      parent: getClosestPlayer,
      child: followPlayer,
      shouldTransition: () => targets.entity !== undefined,
      onTransition: () => bot.chat('followPlayer'),
    }),

    new StateTransition({
      parent: getClosestPlayer,
      child: idle,
      // Didn't find a player? Try again next tick
      shouldTransition: () => targets.entity === undefined,
    }),

    new StateTransition({
      parent: followPlayer,
      child: lookAtPlayer,
      shouldTransition: () => followPlayer.distanceToTarget() < 2,
    }),

    new StateTransition({
      parent: lookAtPlayer,
      child: followPlayer,
      shouldTransition: () => lookAtPlayer.distanceToTarget() >= 2,
    }),

    new StateTransition({
      parent: followPlayer,
      child: idle,
      shouldTransition: () => targets.entity === undefined || !targets.entity.isValid,
      onTransition: () => bot.chat('idle'),
    }),

    new StateTransition({
      parent: lookAtPlayer,
      child: idle,
      shouldTransition: () => targets.entity === undefined || !targets.entity.isValid,
      onTransition: () => bot.chat('idle'),
    }),
  ]

  const rootLayer = new NestedStateMachine(transitions, getClosestPlayer, getClosestPlayer)
  new BotStateMachine(bot, rootLayer)
})
