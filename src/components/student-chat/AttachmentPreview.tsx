
import React from 'react';
import { File, Image, FileText, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttachmentPreviewProps {
  type: 'image' | 'document' | 'other';
  filename: string;
  url: string;
  previewUrl?: string;
  size?: string;
  onRemove?: () => void;
  isPreview?: boolean;
}

export const AttachmentPreview = ({
  type,
  filename,
  url,
  previewUrl,
  size,
  onRemove,
  isPreview = false
}: AttachmentPreviewProps) => {
  const renderIcon = () => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <Paperclip className="h-4 w-4" />;
    }
  };

  return (
    <div className="mt-2 rounded-md border bg-background/50 p-2">
      <div className="flex items-center gap-2">
        {type === 'image' && previewUrl ? (
          <div className="relative h-10 w-10 overflow-hidden rounded">
            <img 
              src={previewUrl} 
              alt={filename} 
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
            {renderIcon()}
          </div>
        )}
        
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-medium">{filename}</p>
          {size && <p className="text-xs text-muted-foreground">{size}</p>}
        </div>
        
        {!isPreview && onRemove && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={onRemove}
          >
            ×
          </Button>
        )}
        
        {isPreview && (
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="h-8 px-2 text-xs"
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              Download
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};
