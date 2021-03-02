import {BehaviorTreeNodeInterface, StateData, BehaviorTreeBuilder, BehaviorTreeStatus} from 'fluent-behavior-tree'

import {createStateContainer} from './botState'

export const createBehaviourTree = (): BehaviorTreeNodeInterface => {
  const withState = createStateContainer()

  const builder = new BehaviorTreeBuilder()
  return builder
    .sequence('base-location-sequence')
    .do(
      'action1',
      withState(async state => {
        await Promise.resolve()

        return {
          ...state,
          baseLocation: 123,
        }
      }),
    )
    .do(
      'action2',
      withState(async state => {
        await Promise.resolve()

        console.log('waiting')
        await wait(20000)
        console.log('done')

        return {
          ...state,
          baseLocation: state.baseLocation ? state.baseLocation + 100 : undefined,
        }
      }),
    )
    .do('action3', async () => {
      await Promise.resolve()
      return BehaviorTreeStatus.Running // Idle
    })
    .end()
    .build()
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const tick = async (tree: BehaviorTreeNodeInterface, state: StateData = new StateData()): Promise<void> => {
  await tree.tick(state)
  await wait(10)
  return tick(tree, state)
}
