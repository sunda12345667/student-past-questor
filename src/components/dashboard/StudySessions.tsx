import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Plus, 
  CalendarDays,
  ClipboardCheck,
  User,
  BookOpen,
  Share2
} from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const upcomingSessions = [
  {
    id: '1',
    title: 'JAMB Mathematics Group Study',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    time: '16:00',
    duration: 60,
    attendees: 8,
    group: 'JAMB Study Club',
    description: 'We will be solving past JAMB Mathematics questions together. Come prepared with your calculator!',
    isHost: true,
    location: 'online',
    meetingLink: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: '2',
    title: 'Physics Problem Solving',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    time: '14:30',
    duration: 90,
    attendees: 12,
    group: 'Physics Masters',
    description: 'Group session focusing on mechanics and electromagnetism problems.',
    isHost: false,
    location: 'online',
    meetingLink: 'https://zoom.us/j/1234567890'
  }
];

const pastSessions = [
  {
    id: '3',
    title: 'English Language Comprehension',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    time: '15:00',
    duration: 60,
    attendees: 15,
    group: 'WAEC Study Group',
    description: 'Reading comprehension practice and vocabulary building.',
    isHost: false,
    location: 'online',
    meetingLink: 'https://zoom.us/j/abcdefghij'
  },
  {
    id: '4',
    title: 'Chemistry Equations Review',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    time: '17:00',
    duration: 45,
    attendees: 9,
    group: 'Chemistry Lab',
    description: 'Balancing chemical equations and stoichiometry practice.',
    isHost: true,
    location: 'online',
    meetingLink: 'https://meet.google.com/xyz-abcd-efg'
  }
];

const mockGroups = [
  { id: '1', name: 'JAMB Study Club' },
  { id: '2', name: 'Physics Masters' },
  { id: '3', name: 'WAEC Mathematics' },
  { id: '4', name: 'Biology Enthusiasts' },
  { id: '5', name: 'Chemistry Lab' }
];

const StudySessions = () => {
  const { toast } = useToast();
  const [upcoming, setUpcoming] = useState(upcomingSessions);
  const [past, setPast] = useState(pastSessions);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const [newSession, setNewSession] = useState({
    title: '',
    group: '',
    description: '',
    time: '',
    duration: '60',
    location: 'online',
    meetingLink: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSession(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateSession = () => {
    if (!newSession.title || !newSession.group || !selectedDate || !newSession.time) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const createdSession = {
      id: Date.now().toString(),
      title: newSession.title,
      date: selectedDate,
      time: newSession.time,
      duration: parseInt(newSession.duration),
      attendees: 1,
      group: newSession.group,
      description: newSession.description,
      isHost: true,
      location: newSession.location,
      meetingLink: newSession.meetingLink
    };
    
    setUpcoming(prev => [createdSession, ...prev]);
    setIsCreatingSession(false);
    
    setNewSession({
      title: '',
      group: '',
      description: '',
      time: '',
      duration: '60',
      location: 'online',
      meetingLink: ''
    });
    
    toast({
      title: "Study session created",
      description: `Your study session "${createdSession.title}" has been scheduled.`,
    });
  };
  
  const handleJoinSession = (sessionId: string) => {
    toast({
      title: "Joining session",
      description: "You'll be redirected to the meeting.",
    });
  };
  
  const handleCancelSession = (sessionId: string) => {
    setUpcoming(prev => prev.filter(session => session.id !== sessionId));
    
    toast({
      title: "Session cancelled",
      description: "The study session has been cancelled.",
    });
  };
  
  const handleSetReminder = (sessionId: string) => {
    toast({
      title: "Reminder set",
      description: "You'll receive a notification before the session starts.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Study Sessions</h2>
        <Dialog open={isCreatingSession} onOpenChange={setIsCreatingSession}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule a Study Session</DialogTitle>
              <DialogDescription>
                Create a new study session for your group.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="session-title">Session Title</Label>
                <Input 
                  id="session-title"
                  name="title"
                  placeholder="e.g., Physics Problem Solving"
                  value={newSession.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session-group">Study Group</Label>
                <Select 
                  value={newSession.group} 
                  onValueChange={(value) => setNewSession(prev => ({ ...prev, group: value }))}
                >
                  <SelectTrigger id="session-group">
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGroups.map(group => (
                      <SelectItem key={group.id} value={group.name}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <CalendarDatePicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="space-y-2">
                    <Label htmlFor="session-time">Time</Label>
                    <Input 
                      id="session-time"
                      name="time"
                      type="time"
                      value={newSession.time}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="session-duration">Duration (minutes)</Label>
                    <Select 
                      value={newSession.duration} 
                      onValueChange={(value) => setNewSession(prev => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger id="session-duration">
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="session-location">Location</Label>
                    <Select 
                      value={newSession.location} 
                      onValueChange={(value) => setNewSession(prev => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger id="session-location">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="physical">Physical Location</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {newSession.location === 'online' && (
                <div className="space-y-2">
                  <Label htmlFor="meeting-link">Meeting Link (Zoom, Google Meet, etc.)</Label>
                  <Input 
                    id="meeting-link"
                    name="meetingLink"
                    placeholder="https://..."
                    value={newSession.meetingLink}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="session-description">Description</Label>
                <Textarea 
                  id="session-description"
                  name="description"
                  placeholder="Describe what will be covered in this session"
                  value={newSession.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatingSession(false)}>Cancel</Button>
              <Button onClick={handleCreateSession}>Schedule Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No upcoming sessions</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any upcoming study sessions scheduled.
              </p>
              <Button onClick={() => setIsCreatingSession(true)}>
                Schedule a Session
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map(session => (
                <Card key={session.id} className={cn(
                  "overflow-hidden transition-all hover:border-primary",
                  session.isHost && "border-primary/50"
                )}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        {session.isHost && (
                          <Badge className="mb-2">You're hosting</Badge>
                        )}
                        <CardTitle className="text-base">{session.title}</CardTitle>
                        <CardDescription>{session.group}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{format(session.date, 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>
                        {session.time} • {session.duration} minutes
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{session.attendees} attendees</span>
                    </div>
                    {session.location === 'online' && (
                      <div className="flex items-center text-sm">
                        <Video className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Online Meeting</span>
                      </div>
                    )}
                    {session.description && (
                      <p className="text-sm mt-2 line-clamp-2">
                        {session.description}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-2">
                    {session.isHost ? (
                      <>
                        <Button onClick={() => handleJoinSession(session.id)}>
                          <Video className="h-4 w-4 mr-2" />
                          Start Session
                        </Button>
                        <Button variant="outline" onClick={() => handleCancelSession(session.id)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => handleJoinSession(session.id)}>
                          <Video className="h-4 w-4 mr-2" />
                          Join
                        </Button>
                        <Button variant="outline" onClick={() => handleSetReminder(session.id)}>
                          <BellRing className="h-4 w-4 mr-2" />
                          Remind Me
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {past.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No past sessions</h3>
              <p className="text-muted-foreground mb-4">
                You haven't participated in any study sessions yet.
              </p>
              <Button onClick={() => document.querySelector('[data-state="inactive"]')?.click()}>
                View Upcoming Sessions
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {past.map(session => (
                <Card key={session.id} className="overflow-hidden transition-all hover:border-primary">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{session.title}</CardTitle>
                        <CardDescription>{session.group}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{format(session.date, 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>
                        {session.time} • {session.duration} minutes
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{session.attendees} attendees</span>
                    </div>
                    {session.description && (
                      <p className="text-sm mt-2 line-clamp-2">
                        {session.description}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Materials
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

export default StudySessions;
