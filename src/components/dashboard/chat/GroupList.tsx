import React from 'react';
import { ChatGroup } from '@/services/chat/types';
import { Badge } from '@/components/ui/badge';

interface GroupListProps {
  groups: ChatGroup[];
  activeGroup: string | null;
  onGroupClick: (groupId: string) => void;
}

export const GroupList: React.FC<GroupListProps> = ({
  groups,
  activeGroup,
  onGroupClick
}) => {
  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <button
          key={group.id}
          className={`w-full p-3 rounded-md text-left hover:bg-accent hover:text-accent-foreground ${
            activeGroup === group.id ? 'bg-accent text-accent-foreground' : 'bg-background'
          }`}
          onClick={() => onGroupClick(group.id)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{group.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {group.description || 'No description'}
              </p>
            </div>
            {(group.unread || 0) > 0 && (
              <Badge variant="destructive" className="ml-2">
                {group.unread}
              </Badge>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
