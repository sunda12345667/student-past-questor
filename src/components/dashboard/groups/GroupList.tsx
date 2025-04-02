
import React from 'react';
import GroupCard from './GroupCard';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  isPrivate: boolean;
  isOwner?: boolean;
  isAdmin?: boolean;
  lastActivity?: string;
  upcomingSessions?: number;
}

interface GroupListProps {
  groups: Group[];
  isMyGroups?: boolean;
  onDiscoverGroups?: () => void;
  onCreateGroup?: () => void;
  onJoinGroup?: (groupId: string) => void;
  onOpenChat?: (groupId: string) => void;
  onOpenSessions?: (groupId: string) => void;
}

const GroupList = ({ 
  groups, 
  isMyGroups = false, 
  onDiscoverGroups,
  onCreateGroup,
  onJoinGroup,
  onOpenChat,
  onOpenSessions
}: GroupListProps) => {
  if (!groups || groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-muted/20">
        <h3 className="mb-2 text-lg font-medium">
          {isMyGroups 
            ? "You haven't joined any study groups yet" 
            : "No groups available for discovery right now"}
        </h3>
        <p className="mb-4 text-muted-foreground">
          {isMyGroups
            ? "Join existing groups or create your own to collaborate with other students"
            : "Check back soon or create your own study group"}
        </p>
        
        {isMyGroups ? (
          <Button onClick={onDiscoverGroups}>
            <Search className="w-4 h-4 mr-2" />
            Discover Groups
          </Button>
        ) : (
          <Button onClick={onCreateGroup}>
            <Plus className="w-4 h-4 mr-2" />
            Create a Group
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map(group => (
        <GroupCard 
          key={group.id} 
          group={group} 
          isMyGroup={isMyGroups}
          onJoinGroup={onJoinGroup}
          onOpenChat={onOpenChat}
          onOpenSessions={onOpenSessions}
        />
      ))}
    </div>
  );
};

export default GroupList;
