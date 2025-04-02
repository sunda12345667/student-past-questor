
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Settings, MessageSquare, Calendar, Users, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description: string;
    members: number;
    isPrivate: boolean;
    isOwner?: boolean;
    isAdmin?: boolean;
    lastActivity?: string;
    upcomingSessions?: number;
  };
  isMyGroup?: boolean;
  onJoinGroup?: (groupId: string) => void;
  onOpenChat?: (groupId: string) => void;
  onOpenSessions?: (groupId: string) => void;
}

const GroupCard = ({ 
  group, 
  isMyGroup = false, 
  onJoinGroup,
  onOpenChat,
  onOpenSessions
}: GroupCardProps) => {
  const navigate = useNavigate();
  
  const handleChatClick = () => {
    if (onOpenChat) {
      onOpenChat(group.id);
    } else {
      // Navigate to dashboard with chat tab and group selected
      navigate(`/dashboard#chat?groupId=${group.id}`);
    }
  };
  
  const handleSessionsClick = () => {
    if (onOpenSessions) {
      onOpenSessions(group.id);
    } else {
      // Navigate to dashboard with sessions tab
      navigate(`/dashboard#sessions?groupId=${group.id}`);
    }
  };

  return (
    <Card className="transition-all hover:border-primary">
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
          {isMyGroup && (group.isOwner || group.isAdmin) && (
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
          {isMyGroup && (
            <>
              <span className="mx-2">•</span>
              <span>Last active {group.lastActivity}</span>
            </>
          )}
        </div>
        
        {isMyGroup && (
          <div className="flex flex-wrap gap-2 mt-2">
            {group.isOwner && <Badge variant="outline">Owner</Badge>}
            {group.isAdmin && <Badge variant="outline">Admin</Badge>}
            {(group.upcomingSessions || 0) > 0 && (
              <Badge className="bg-green-500">
                {group.upcomingSessions} Upcoming Session{(group.upcomingSessions || 0) !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        {isMyGroup ? (
          <>
            <Button className="flex-1" onClick={handleChatClick}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
            {(group.upcomingSessions || 0) > 0 && (
              <Button variant="outline" className="flex-1" onClick={handleSessionsClick}>
                <Calendar className="h-4 w-4 mr-2" />
                Sessions
              </Button>
            )}
          </>
        ) : (
          <Button onClick={() => onJoinGroup?.(group.id)} className="w-full">
            <UserPlus className="h-4 w-4 mr-2" />
            Join Group
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GroupCard;
