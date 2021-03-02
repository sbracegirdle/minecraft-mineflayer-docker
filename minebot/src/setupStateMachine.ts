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

import {bot} from './bot'

export function setupStateMachine(): void {
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
}
