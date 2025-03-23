
import { Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GroupCard from './GroupCard';

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
  isMyGroups: boolean;
  onJoinGroup?: (groupId: string) => void;
  onDiscoverGroups?: () => void;
  onCreateGroup?: () => void;
}

const GroupList = ({ groups, isMyGroups, onJoinGroup, onDiscoverGroups, onCreateGroup }: GroupListProps) => {
  if (groups.length === 0) {
    return (
      <div className="text-center py-8">
        {isMyGroups ? (
          <>
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No groups yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't joined any study groups yet.
            </p>
            <Button onClick={onDiscoverGroups}>
              Discover Groups
            </Button>
          </>
        ) : (
          <>
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No groups to discover</h3>
            <p className="text-muted-foreground mb-4">
              There are no public groups available to join at the moment.
            </p>
            <Button onClick={onCreateGroup}>
              Create a Group
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {groups.map(group => (
        <GroupCard 
          key={group.id} 
          group={group} 
          isMyGroup={isMyGroups}
          onJoinGroup={onJoinGroup}
        />
      ))}
    </div>
  );
};

export default GroupList;
