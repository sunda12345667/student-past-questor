
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export type AttachmentType = "image" | "document" | "other";

export interface Attachment {
  id: string;
  url: string;
  filename: string;
  fileType: AttachmentType;
  size: number;
  thumbnailUrl?: string;
}

/**
 * Uploads a file to Supabase storage
 */
export const uploadAttachment = async (
  file: File,
  groupId: string
): Promise<Attachment | null> => {
  try {
    // Generate a unique file name to prevent collision
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${groupId}/${fileName}`;
    
    // Upload file to storage
    const { data, error } = await supabase
      .storage
      .from('chat-attachments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      throw error;
    }
    
    // Get public URL for the file
    const { data: { publicUrl } } = supabase
      .storage
      .from('chat-attachments')
      .getPublicUrl(filePath);
      
    // Determine file type
    let fileType: AttachmentType = "other";
    let thumbnailUrl = undefined;
    
    if (file.type.startsWith('image/')) {
      fileType = "image";
      thumbnailUrl = publicUrl;
    } else if (
      file.type === 'application/pdf' ||
      file.type.includes('document') ||
      file.type.includes('text/')
    ) {
      fileType = "document";
    }
    
    return {
      id: data.path,
      url: publicUrl,
      filename: file.name,
      fileType,
      size: file.size,
      thumbnailUrl
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    toast.error("Failed to upload file");
    return null;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
};

