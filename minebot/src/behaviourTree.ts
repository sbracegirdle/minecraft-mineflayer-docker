import {BehaviorTreeNodeInterface, StateData, BehaviorTreeBuilder, BehaviorTreeStatus} from 'fluent-behavior-tree'

export const createBehaviourTree = (): BehaviorTreeNodeInterface => {
  console.log('createBehaviourTree')
  const builder = new BehaviorTreeBuilder()
  return builder
    .parallel('my-sequence', 1, 2)
    .do('action1', async _t => {
      await Promise.resolve()

      console.log('action1')

      return BehaviorTreeStatus.Success
    })
    .do('action2', async _t => {
      await Promise.resolve()

      console.log('waiting')
      await wait(20000)
      console.log('done')

      return BehaviorTreeStatus.Success
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
