import mitt from 'mitt';

export type EventEmitterRecord = {
  tabPress: string; // screen name
};

export const eventEmitter = mitt<EventEmitterRecord>();
