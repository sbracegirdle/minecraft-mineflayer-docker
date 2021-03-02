import { StateData, BehaviorTreeStatus } from 'fluent-behavior-tree';

interface BotState {
  spawned: boolean;
  error?: string;
  baseLocation?: number;
}

export const isBotState = (obj: unknown): obj is BotState => {
  return !!obj && (obj as BotState).spawned !== undefined;
};
type StatefulHandler = (state: BotState) => Promise<BotState>;
export const createStateContainer = () => {
  // We try keep most of our state effects in here
  let state: BotState = Object.freeze({ spawned: true });

  // Returns function for creating stateful handlers
  return (handler: StatefulHandler) => async (_t: StateData): Promise<BehaviorTreeStatus> => {
    try {
      if (!isBotState(state))
        throw Error('Incoming state data is not valid bot state');
      state = Object.freeze(await handler(state));
      console.log(state);
      return BehaviorTreeStatus.Success;
    } catch (e) {
      console.log(e);
      return BehaviorTreeStatus.Failure;
    }
  };
};
