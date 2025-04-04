
import { format } from 'date-fns';

// Format timestamp for display
export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};
