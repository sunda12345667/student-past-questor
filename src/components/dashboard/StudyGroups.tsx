import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Plus, 
  Settings, 
  Lock, 
  Globe, 
  UserPlus, 
  MessageSquare, 
  Calendar
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

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
  
  const [myGroups, setMyGroups] = useState(mockGroups);
  const [publicGroups, setPublicGroups] = useState([
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
  
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    isPrivate: false
  });
  
  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) {
      toast({
        title: "Group name required",
        description: "Please provide a name for your study group.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would save this to the database
    const createdGroup = {
      id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description,
      members: 1,
      isPrivate: newGroup.isPrivate,
      isOwner: true,
      isAdmin: true,
      lastActivity: 'Just now',
      upcomingSessions: 0
    };
    
    setMyGroups(prev => [createdGroup, ...prev]);
    setNewGroup({ name: '', description: '', isPrivate: false });
    setIsCreatingGroup(false);
    
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
    const joinedGroup = {
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Study Groups</h2>
        <Dialog open={isCreatingGroup} onOpenChange={setIsCreatingGroup}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Study Group</DialogTitle>
              <DialogDescription>
                Create a new study group to collaborate with other students.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input 
                  id="group-name" 
                  placeholder="e.g., JAMB Physics Study Group"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="group-description">Description</Label>
                <Textarea 
                  id="group-description" 
                  placeholder="Describe the purpose of your group"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="private-group" 
                  checked={newGroup.isPrivate}
                  onCheckedChange={(checked) => 
                    setNewGroup(prev => ({ ...prev, isPrivate: checked === true }))
                  }
                />
                <Label htmlFor="private-group" className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Make this group private (invite only)
                </Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatingGroup(false)}>Cancel</Button>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="my-groups">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="discover">Discover Groups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-groups" className="space-y-4">
          {myGroups.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No groups yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't joined any study groups yet.
              </p>
              <Button onClick={() => document.querySelector('[data-state="inactive"]')?.click()}>
                Discover Groups
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myGroups.map(group => (
                <Card key={group.id} className="transition-all hover:border-primary">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {group.name}
                          {group.isPrivate && (
                            <Lock className="h-4 w-4 ml-2 text-muted-foreground" />
                          )}
                        </CardTitle>
                        <CardDescription>{group.description}</CardDescription>
                      </div>
                      {(group.isOwner || group.isAdmin) && (
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{group.members} members</span>
                      <span className="mx-2">•</span>
                      <span>Last active {group.lastActivity}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {group.isOwner && <Badge variant="outline">Owner</Badge>}
                      {group.isAdmin && <Badge variant="outline">Admin</Badge>}
                      {group.upcomingSessions > 0 && (
                        <Badge className="bg-green-500">
                          {group.upcomingSessions} Upcoming Session{group.upcomingSessions !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex gap-2">
                    <Button className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                    {group.upcomingSessions > 0 && (
                      <Button variant="outline" className="flex-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Sessions
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="discover" className="space-y-4">
          {publicGroups.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No groups to discover</h3>
              <p className="text-muted-foreground mb-4">
                There are no public groups available to join at the moment.
              </p>
              <Button onClick={() => setIsCreatingGroup(true)}>
                Create a Group
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publicGroups.map(group => (
                <Card key={group.id} className="transition-all hover:border-primary">
                  <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{group.members} members</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleJoinGroup(group.id)} className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Group
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyGroups;
