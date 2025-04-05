
import React from 'react';
import { File, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Attachment, formatFileSize } from '@/services/chat/attachmentService';

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemove?: () => void;
  isInMessage?: boolean;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachment,
  onRemove,
  isInMessage = false
}) => {
  const { filename, fileType, size, thumbnailUrl, url } = attachment;
  
  return (
    <div className="flex items-center gap-2 bg-muted/30 rounded p-2 relative">
      {fileType === 'image' && thumbnailUrl ? (
        <div className="h-10 w-10 rounded overflow-hidden bg-muted">
          <img 
            src={thumbnailUrl} 
            alt={filename} 
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="h-10 w-10 flex items-center justify-center bg-muted rounded">
          <File className="h-5 w-5" />
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-medium truncate">{filename}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(size)}
        </p>
      </div>
      
      {isInMessage ? (
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="h-8 px-2"
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            Download
          </a>
        </Button>
      ) : onRemove && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 absolute top-1 right-1 text-muted-foreground"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
