
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ChatGroup } from '@/services/chat';

interface GroupListProps {
  groups: ChatGroup[];
  publicGroups: ChatGroup[];
  loading: boolean;
  selectedGroup: string | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectGroup: (groupId: string) => void;
  onCreateGroup: () => void;
  onJoinGroup: (groupId: string) => void;
}

const GroupList: React.FC<GroupListProps> = ({
  groups,
  publicGroups,
  loading,
  selectedGroup,
  activeTab,
  setActiveTab,
  onSelectGroup,
  onCreateGroup,
  onJoinGroup
}) => {
  return (
    <div className="w-full md:w-64 flex-shrink-0 border rounded-lg overflow-hidden">
      <div className="p-3 border-b bg-muted/30">
        <div className="flex justify-between items-center">
          <h3 className="font-medium flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Study Groups
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={onCreateGroup}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-2">
        <div className="flex space-x-2 mb-2">
          <Button
            variant={activeTab === 'my-groups' ? "default" : "outline"}
            size="sm"
            className="w-1/2"
            onClick={() => setActiveTab('my-groups')}
          >
            My Groups
          </Button>
          <Button
            variant={activeTab === 'discover' ? "default" : "outline"}
            size="sm"
            className="w-1/2"
            onClick={() => setActiveTab('discover')}
          >
            Discover
          </Button>
        </div>
      </div>
      <div className="p-2 h-[calc(100%-6rem)] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 bg-muted animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : (
          activeTab === 'my-groups' ? (
            groups.length > 0 ? (
              groups.map(group => (
                <Button
                  key={group.id}
                  variant={selectedGroup === group.id ? "default" : "ghost"}
                  className="w-full justify-start mb-1 relative"
                  onClick={() => onSelectGroup(group.id)}
                >
                  <div className="flex items-center w-full overflow-hidden">
                    <span className="truncate">{group.name}</span>
                    {group.unread && group.unread > 0 && (
                      <Badge className="ml-auto bg-red-500 text-white min-w-[1.5rem] flex items-center justify-center">
                        {group.unread}
                      </Badge>
                    )}
                  </div>
                </Button>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>You haven't joined any groups yet.</p>
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab('discover')}
                >
                  Discover groups
                </Button>
              </div>
            )
          ) : (
            publicGroups.length > 0 ? (
              publicGroups.map(group => (
                <div key={group.id} className="mb-2 p-2 border rounded-md">
                  <div className="font-medium">{group.name}</div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {group.members} members
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      onClick={() => onJoinGroup(group.id)}
                    >
                      Join
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No public groups available.</p>
                <Button 
                  variant="link" 
                  onClick={onCreateGroup}
                >
                  Create a group
                </Button>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default GroupList;
