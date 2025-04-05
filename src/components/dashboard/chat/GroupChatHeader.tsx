
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Settings } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface GroupChatHeaderProps {
  groupName: string | undefined;
  isGroupAdmin: boolean;
  onShowMembers: () => void;
  onLeaveGroup: () => void;
}

const GroupChatHeader: React.FC<GroupChatHeaderProps> = ({
  groupName,
  isGroupAdmin,
  onShowMembers,
  onLeaveGroup
}) => {
  return (
    <div className="p-3 border-b flex justify-between items-center bg-muted/30">
      <h3 className="font-medium">
        {groupName}
      </h3>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onShowMembers}
        >
          <Users className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Chat Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
            <DropdownMenuItem>Pin Chat</DropdownMenuItem>
            {isGroupAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Manage Members</DropdownMenuItem>
                <DropdownMenuItem>Group Settings</DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-500"
              onClick={onLeaveGroup}
            >
              Leave Group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default GroupChatHeader;
