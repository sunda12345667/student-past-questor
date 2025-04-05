
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { MessageAttachment } from "./types";

export interface Attachment {
  id: string;
  url: string;
  filename: string;
  fileType: "image" | "document" | "other";
  size: number;
  thumbnailUrl?: string;
}

/**
 * Format file size in bytes to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const uploadAttachment = async (file: File, groupId: string): Promise<MessageAttachment | null> => {
  try {
    const fileId = uuidv4();
    const fileExt = file.name.split('.').pop();
    const filePath = `${groupId}/${fileId}.${fileExt}`;
    const bucketName = 'chat-attachments';

    // Check if the bucket exists, create if it doesn't
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucketName);
    
    if (!bucketExists) {
      console.log("Chat attachments bucket doesn't exist yet, working with temporary file");
      // Return a temporary file object if the bucket doesn't exist yet
      return {
        id: fileId,
        url: URL.createObjectURL(file),
        filename: file.name,
        fileType: file.type.startsWith('image/') ? "image" : "document",
        size: file.size,
        thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      };
    }
    
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);
    
    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return null;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    if (!urlData || !urlData.publicUrl) {
      console.error("Failed to get public URL");
      return null;
    }
    
    // Determine file type
    const fileType = file.type.startsWith('image/') 
      ? "image"
      : file.type.includes('pdf') || file.type.includes('doc') || file.type.includes('txt')
        ? "document"
        : "other";
    
    // Create thumbnails for images if needed
    const thumbnailUrl = fileType === "image" ? urlData.publicUrl : undefined;
    
    return {
      id: fileId,
      url: urlData.publicUrl,
      filename: file.name,
      fileType,
      size: file.size,
      thumbnailUrl
    };
  } catch (error) {
    console.error("Error in uploadAttachment:", error);
    return null;
  }
};

export const deleteAttachment = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('chat-attachments')
      .remove([filePath]);
    
    if (error) {
      console.error("Error deleting file:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteAttachment:", error);
    return false;
  }
};
