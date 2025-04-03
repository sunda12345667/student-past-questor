
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Clock, Users, Video, MapPin, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

const SessionCard = ({ session }: { session: any }) => {
  const sessionDate = new Date(session.session_date);
  
  return (
    <Card className="overflow-hidden">
      <div className="bg-primary text-primary-foreground p-2 text-center">
        <div className="text-lg font-semibold">
          {format(sessionDate, 'EEEE')}
        </div>
        <div className="text-2xl font-bold">
          {format(sessionDate, 'd MMM')}
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div>{session.title}</div>
          <div className="text-sm font-normal bg-muted py-1 px-2 rounded-md">
            {session.session_time}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {session.description || 'No description provided.'}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2" />
              <span>{session.duration} minutes</span>
            </div>
            
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{session.location}</span>
              {session.meeting_link && session.location === 'online' && (
                <Button variant="link" className="p-0 ml-2 h-auto" size="sm">
                  Join
                </Button>
              )}
            </div>
            
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-2" />
              <span>0 attendees</span>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button size="sm">Join Session</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StudySessions: React.FC = () => {
  const { currentUser } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [location, setLocation] = useState('online');
  const [meetingLink, setMeetingLink] = useState('');
  
  // Fetch sessions
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['study-sessions', date?.toISOString()],
    queryFn: async () => {
      if (!date) return [];
      
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        
        const { data, error } = await supabase
          .from('study_sessions')
          .select(`
            id,
            title,
            description,
            session_date,
            session_time,
            duration,
            location,
            meeting_link,
            host_id,
            group_id
          `)
          .eq('session_date', formattedDate);
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast.error('Failed to load study sessions');
        return [];
      }
    },
  });
  
  const handleCreateSession = async () => {
    if (!title || !sessionTime || !date) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        toast.error('You must be logged in to create a session');
        return;
      }
      
      const sessionData = {
        title,
        description,
        session_date: format(date, 'yyyy-MM-dd'),
        session_time: sessionTime,
        duration: parseInt(duration),
        location,
        meeting_link: location === 'online' ? meetingLink : null,
        host_id: user.user.id,
        group_id: null // For now, not associated with a group
      };
      
      const { error } = await supabase
        .from('study_sessions')
        .insert(sessionData);
        
      if (error) throw error;
      
      toast.success('Study session created successfully');
      setIsCreating(false);
      
      // Reset form
      setTitle('');
      setDescription('');
      setSessionTime('');
      setDuration('60');
      setLocation('online');
      setMeetingLink('');
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create study session');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Study Sessions</h1>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Study Session</DialogTitle>
              <DialogDescription>
                Schedule a new study session for yourself or your group.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Date</Label>
                <div className="col-span-3">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration (min)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="online">Online</option>
                  <option value="in-person">In Person</option>
                </select>
              </div>
              {location === 'online' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="meetingLink" className="text-right">
                    Meeting Link
                  </Label>
                  <Input
                    id="meetingLink"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleCreateSession}>
                Create Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex space-x-4">
        <Card className="w-[300px]">
          <CardHeader>
            <CardTitle className="text-center">
              <CalendarIcon className="h-5 w-5 inline-block mr-2" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="flex-1">
          <h2 className="text-lg font-medium mb-4">
            Sessions for {date ? format(date, 'EEEE, MMMM d') : 'Today'}
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="h-[200px] animate-pulse">
                  <div className="h-full bg-muted/30"></div>
                </Card>
              ))}
            </div>
          ) : sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-muted/30">
              <Video className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No study sessions scheduled</h3>
              <p className="text-muted-foreground mb-4">
                There are no study sessions for this date.
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create New Session
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudySessions;
