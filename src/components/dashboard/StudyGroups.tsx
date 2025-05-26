
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateGroupDialog from './groups/CreateGroupDialog';
import GroupList from './groups/GroupList';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { joinStudyGroup } from '@/services/groupService';

interface StudyGroup {
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

interface PublicGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  isPrivate: boolean;
}

const StudyGroups = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [publicGroups, setPublicGroups] = useState<PublicGroup[]>([]);
  const [activeTab, setActiveTab] = useState('my-groups');
  const [isLoading, setIsLoading] = useState(true);

  const loadMyGroups = async () => {
    if (!currentUser) return;

    try {
      const { data: memberGroups, error } = await supabase
        .from('group_members')
        .select(`
          group_id,
          is_admin,
          study_groups (
            id,
            name,
            description,
            is_private,
            owner_id,
            created_at
          )
        `)
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Error loading my groups:', error);
        return;
      }

      const groups: StudyGroup[] = memberGroups
        ?.filter(mg => mg.study_groups)
        .map(mg => ({
          id: mg.study_groups.id,
          name: mg.study_groups.name,
          description: mg.study_groups.description || '',
          members: 0, // Will be calculated separately if needed
          isPrivate: mg.study_groups.is_private,
          isOwner: mg.study_groups.owner_id === currentUser.id,
          isAdmin: mg.is_admin,
          lastActivity: 'Recently',
          upcomingSessions: 0
        })) || [];

      setMyGroups(groups);
    } catch (error) {
      console.error('Error loading my groups:', error);
    }
  };

  const loadPublicGroups = async () => {
    if (!currentUser) return;

    try {
      // Get public groups that the user is not already a member of
      const { data: myGroupIds } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', currentUser.id);

      const memberGroupIds = myGroupIds?.map(mg => mg.group_id) || [];

      const { data: publicGroupsData, error } = await supabase
        .from('study_groups')
        .select('*')
        .eq('is_private', false)
        .not('id', 'in', `(${memberGroupIds.join(',') || 'null'})`);

      if (error) {
        console.error('Error loading public groups:', error);
        return;
      }

      const groups: PublicGroup[] = publicGroupsData?.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description || '',
        members: 0, // Will be calculated separately if needed
        isPrivate: group.is_private
      })) || [];

      setPublicGroups(groups);
    } catch (error) {
      console.error('Error loading public groups:', error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([loadMyGroups(), loadPublicGroups()]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);
  
  const handleCreateGroup = () => {
    // Refresh data after group creation
    loadData();
  };
  
  const handleJoinGroup = async (groupId: string) => {
    const success = await joinStudyGroup(groupId);
    if (success) {
      // Refresh data to move group from public to my groups
      loadData();
    }
  };

  const handleDiscoverGroups = () => {
    setActiveTab('discover');
  };
  
  const handleOpenChat = (groupId: string) => {
    navigate('/chat');
  };
  
  const handleOpenSessions = (groupId: string) => {
    navigate('/dashboard#sessions');
    sessionStorage.setItem('selectedGroupId', groupId);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-medium">Study Groups</h2>
          <CreateGroupDialog onGroupCreated={handleCreateGroup} />
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Study Groups</h2>
        <CreateGroupDialog onGroupCreated={handleCreateGroup} />
      </div>
      
      <Tabs defaultValue="my-groups" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="discover">Discover Groups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-groups" className="space-y-4">
          <GroupList 
            groups={myGroups} 
            isMyGroups={true}
            onDiscoverGroups={handleDiscoverGroups}
            onOpenChat={handleOpenChat}
            onOpenSessions={handleOpenSessions}
          />
        </TabsContent>
        
        <TabsContent value="discover" className="space-y-4">
          <GroupList 
            groups={publicGroups} 
            isMyGroups={false}
            onJoinGroup={handleJoinGroup}
            onCreateGroup={handleCreateGroup}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyGroups;
