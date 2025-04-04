
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Smile, X } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose?: () => void;
  trigger?: React.ReactNode;
}

export function EmojiPicker({ onEmojiSelect, onClose, trigger }: EmojiPickerProps) {
  // Common emoji sets grouped by category
  const emojiCategories = {
    reactions: ["👍", "👎", "❤️", "😂", "😍", "🎉", "👏", "🔥", "⭐", "✅", "❌", "🙏"],
    faces: ["😀", "😊", "🤔", "😐", "😮", "😢", "😴", "😎", "🤓", "😇", "🥳", "🤯"],
    objects: ["📚", "💡", "⏰", "📝", "📌", "🔍", "💻", "📱", "🎓", "📊", "🧠", "🔬"]
  };

  const [open, setOpen] = React.useState(true);

  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
          >
            <Smile className="h-4 w-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-3" 
        align="start"
        sideOffset={5}
      >
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium">Add Reaction</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={() => {
              setOpen(false);
              if (onClose) onClose();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {Object.entries(emojiCategories).map(([category, emojis]) => (
          <div key={category} className="mb-3">
            <h5 className="text-xs text-muted-foreground capitalize mb-1">{category}</h5>
            <div className="grid grid-cols-6 gap-1">
              {emojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  className="h-8 w-8 p-0 text-base"
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
