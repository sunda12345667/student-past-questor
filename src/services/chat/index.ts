
export * from './messageService';
export * from './realtimeService';
export * from './types';
export * from './groupService';
export * from './membershipService';
export * from './userService';
export * from './attachmentService';
export * from './reactionService';

// Re-export commonly used functions with aliases for backward compatibility
export { 
  sendMessage as sendGroupMessage,
  addMessageReaction,
  removeMessageReaction 
} from './messageService';

// Re-export realtime functions
export {
  subscribeToGroupMessages as subscribeToMessages,
  subscribeToTypingIndicators,
  sendTypingIndicator,
  cleanupChannel
} from './realtimeService';
