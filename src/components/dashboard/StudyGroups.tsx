
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateGroupDialog from './groups/CreateGroupDialog';
import GroupList from './groups/GroupList';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock data types
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

// Mock data for study groups
const mockGroups = [
  {
    id: '1',
    name: 'JAMB Study Club',
    description: 'Group focused on preparing for JAMB exams',
    members: 24,
    isPrivate: false,
    isOwner: true,
    isAdmin: true,
    lastActivity: '2 hours ago',
    upcomingSessions: 2
  },
  {
    id: '2',
    name: 'Physics Masters',
    description: 'Advanced Physics discussions and problem solving',
    members: 16,
    isPrivate: true,
    isOwner: false,
    isAdmin: false,
    lastActivity: 'Yesterday',
    upcomingSessions: 1
  },
  {
    id: '3',
    name: 'WAEC Mathematics',
    description: 'WAEC Mathematics past questions and solutions',
    members: 32,
    isPrivate: false,
    isOwner: false,
    isAdmin: true,
    lastActivity: '3 days ago',
    upcomingSessions: 0
  }
];

const StudyGroups = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [myGroups, setMyGroups] = useState<StudyGroup[]>(mockGroups);
  const [publicGroups, setPublicGroups] = useState<PublicGroup[]>([
    {
      id: '4',
      name: 'Biology Enthusiasts',
      description: 'Discussions on biology topics and exam preparation',
      members: 45,
      isPrivate: false
    },
    {
      id: '5',
      name: 'Chemistry Lab',
      description: 'For students passionate about chemistry',
      members: 29,
      isPrivate: false
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('my-groups');
  
  const handleCreateGroup = (newGroupData: { name: string; description: string; isPrivate: boolean }) => {
    // In a real app, we would save this to the database
    const createdGroup: StudyGroup = {
      id: Date.now().toString(),
      name: newGroupData.name,
      description: newGroupData.description,
      members: 1,
      isPrivate: newGroupData.isPrivate,
      isOwner: true,
      isAdmin: true,
      lastActivity: 'Just now',
      upcomingSessions: 0
    };
    
    setMyGroups(prev => [createdGroup, ...prev]);
    
    toast({
      title: "Group created",
      description: `Your study group "${createdGroup.name}" has been created successfully.`,
    });
  };
  
  const handleJoinGroup = (groupId: string) => {
    const groupToJoin = publicGroups.find(g => g.id === groupId);
    if (!groupToJoin) return;
    
    // Remove from public groups
    setPublicGroups(prev => prev.filter(g => g.id !== groupId));
    
    // Add to my groups
    const joinedGroup: StudyGroup = {
      ...groupToJoin,
      isOwner: false,
      isAdmin: false,
      lastActivity: 'Just now',
      upcomingSessions: 0,
      members: groupToJoin.members + 1
    };
    
    setMyGroups(prev => [...prev, joinedGroup]);
    
    toast({
      title: "Group joined",
      description: `You've successfully joined "${joinedGroup.name}".`,
    });
  };

  const handleDiscoverGroups = () => {
    setActiveTab('discover');
    setTimeout(() => {
      const discoverTab = document.querySelector('[data-state="inactive"]');
      if (discoverTab) {
        (discoverTab as HTMLElement).click();
      }
    }, 0);
  };
  
  const handleOpenChat = (groupId: string) => {
    // Navigate to dashboard chat tab with this group selected
    navigate(`/dashboard#chat`);
    // Store the selected group ID in sessionStorage so the chat component can use it
    sessionStorage.setItem('selectedGroupId', groupId);
  };
  
  const handleOpenSessions = (groupId: string) => {
    navigate(`/dashboard#sessions`);
    // Store the selected group ID for the sessions tab
    sessionStorage.setItem('selectedGroupId', groupId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Study Groups</h2>
        <CreateGroupDialog onCreateGroup={handleCreateGroup} />
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
            onCreateGroup={() => document.querySelector('button')?.click()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyGroups;
