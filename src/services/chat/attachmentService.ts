
import { supabase } from '@/integrations/supabase/client';
import { MessageAttachment } from './types';

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  fileType: 'image' | 'document';
  size: number;
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const uploadAttachment = async (file: File): Promise<MessageAttachment | null> => {
  try {
    console.log('Uploading attachment:', file.name);
    
    return {
      id: Math.random().toString(36),
      filename: file.name,
      url: URL.createObjectURL(file),
      fileType: file.type.startsWith('image/') ? 'image' : 'document',
      size: file.size
    };
  } catch (error) {
    console.error('Error uploading attachment:', error);
    return null;
  }
};
