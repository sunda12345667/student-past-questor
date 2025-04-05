
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GroupMember } from '@/services/chat';

interface GroupMembersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string | undefined;
  membersLoading: boolean;
  groupMembers: GroupMember[];
}

const GroupMembersDialog: React.FC<GroupMembersDialogProps> = ({
  isOpen,
  onOpenChange,
  groupName,
  membersLoading,
  groupMembers
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Group Members</DialogTitle>
          <DialogDescription>
            {groupName || "Group"} has {groupMembers.length} members.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {membersLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                  <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {groupMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.user?.avatar_url} />
                      <AvatarFallback>
                        {member.user?.name?.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{member.user?.name}</span>
                  </div>
                  
                  {member.is_admin && (
                    <Badge variant="outline">Admin</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupMembersDialog;
