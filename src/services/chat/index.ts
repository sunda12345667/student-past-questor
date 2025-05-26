
export * from './messageService';
export * from './realTimeService';
export * from './types';

// Re-export commonly used functions with aliases for backward compatibility
export { 
  sendMessage as sendGroupMessage,
  addMessageReaction,
  removeMessageReaction 
} from './messageService';
