
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Medal, Trophy, Award, Target, TrendingUp, Star, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Mock data for leaderboards
const globalLeaderboard = [
  { 
    id: '1', 
    name: 'Chioma Nwosu', 
    avatar: '', 
    points: 3850, 
    rank: 1, 
    level: 'Diamond', 
    subjects: ['Mathematics', 'Physics'],
    badges: ['Quick Learner', 'Problem Solver', 'Study Streak: 30 days'],
    progress: 85,
  },
  { 
    id: '2', 
    name: 'David Okafor', 
    avatar: '', 
    points: 3620, 
    rank: 2, 
    level: 'Platinum', 
    subjects: ['Biology', 'Chemistry'],
    badges: ['Top Contributor', 'Quiz Master'],
    progress: 78,
  },
  { 
    id: '3', 
    name: 'Fatima Abdullahi', 
    avatar: '', 
    points: 3400, 
    rank: 3, 
    level: 'Platinum', 
    subjects: ['English', 'Government'],
    badges: ['Consistency King', 'Helpful'],
    progress: 75,
  },
  { 
    id: '4', 
    name: 'Samuel Eze', 
    avatar: '', 
    points: 3100, 
    rank: 4, 
    level: 'Gold', 
    subjects: ['Economics', 'Mathematics'],
    badges: ['Rising Star'],
    progress: 68,
  },
  { 
    id: '5', 
    name: 'Grace Adeyemi', 
    avatar: '', 
    points: 2940, 
    rank: 5, 
    level: 'Gold', 
    subjects: ['Physics', 'Chemistry'],
    badges: ['Quick Thinker'],
    progress: 62,
  },
];

const groupLeaderboard = [
  { 
    id: '1', 
    name: 'JAMB Study Club', 
    members: 24, 
    totalPoints: 45600, 
    rank: 1, 
    level: 'Elite', 
    recentAchievement: 'Most Active Study Group',
    progress: 92,
  },
  { 
    id: '2', 
    name: 'Physics Masters', 
    members: 16, 
    totalPoints: 32800, 
    rank: 2, 
    level: 'Advanced', 
    recentAchievement: 'Most Questions Solved',
    progress: 85,
  },
  { 
    id: '3', 
    name: 'Biology Enthusiasts', 
    members: 45, 
    totalPoints: 30500, 
    rank: 3, 
    level: 'Advanced', 
    recentAchievement: 'Most Improved Group',
    progress: 78,
  },
  { 
    id: '4', 
    name: 'WAEC Mathematics', 
    members: 32, 
    totalPoints: 28900, 
    rank: 4, 
    level: 'Intermediate', 
    recentAchievement: 'Top Quiz Scores',
    progress: 72,
  },
  { 
    id: '5', 
    name: 'English Language Club', 
    members: 28, 
    totalPoints: 24500, 
    rank: 5, 
    level: 'Intermediate', 
    recentAchievement: 'Most Study Sessions',
    progress: 68,
  },
];

const LeaderboardTab = () => {
  const [currentUser] = useState({
    id: '8',
    name: 'John Doe',
    avatar: '',
    points: 2200,
    rank: 8,
    level: 'Silver',
    subjects: ['Mathematics', 'English'],
    badges: ['Newcomer'],
    progress: 45,
  });
  
  const renderRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="font-medium">{rank}</span>;
  };
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-emerald-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Diamond': return 'bg-blue-500';
      case 'Platinum': return 'bg-indigo-500';
      case 'Gold': return 'bg-yellow-500';
      case 'Silver': return 'bg-gray-400';
      case 'Bronze': return 'bg-amber-700';
      case 'Elite': return 'bg-purple-500';
      case 'Advanced': return 'bg-indigo-500';
      case 'Intermediate': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium">Leaderboards & Achievements</h2>
      
      {/* User Stats Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your Performance</CardTitle>
          <CardDescription>
            Your current rank and achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <h3 className="font-medium">{currentUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentUser.subjects.join(', ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{currentUser.points} points</p>
                  <p className="text-sm text-muted-foreground">Rank #{currentUser.rank}</p>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{currentUser.level} Level</span>
                  <span className="text-sm">{currentUser.progress}%</span>
                </div>
                <Progress value={currentUser.progress} className={getProgressColor(currentUser.progress)} />
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className={getLevelColor(currentUser.level)}>
                  {currentUser.level}
                </Badge>
                {currentUser.badges.map((badge, index) => (
                  <Badge key={index} variant="outline">{badge}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Leaderboard Tabs */}
      <Tabs defaultValue="students">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">Student Rankings</TabsTrigger>
          <TabsTrigger value="groups">Group Rankings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Students with the highest points this month</CardDescription>
                </div>
                <Badge className="bg-green-500">Weekly Update</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {globalLeaderboard.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {renderRankBadge(user.rank)}
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.subjects.join(', ')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{user.points} pts</p>
                          <Badge className={getLevelColor(user.level)} variant="secondary">
                            {user.level}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-1">
                        <Progress value={user.progress} className={getProgressColor(user.progress)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">View Full Rankings</Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="text-center pb-2">
                <Award className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                <CardTitle className="text-lg">Achievements</CardTitle>
                <CardDescription>Unlock badges as you learn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 rounded-lg border">
                    <Star className="h-6 w-6 mx-auto text-amber-500 mb-1" />
                    <p className="text-xs font-medium">Quick Learner</p>
                  </div>
                  <div className="text-center p-2 rounded-lg border">
                    <Target className="h-6 w-6 mx-auto text-red-500 mb-1" />
                    <p className="text-xs font-medium">Goal Setter</p>
                  </div>
                  <div className="text-center p-2 rounded-lg border">
                    <TrendingUp className="h-6 w-6 mx-auto text-green-500 mb-1" />
                    <p className="text-xs font-medium">Improver</p>
                  </div>
                  <div className="text-center p-2 rounded-lg border">
                    <Award className="h-6 w-6 mx-auto text-purple-500 mb-1" />
                    <p className="text-xs font-medium">Expert</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center pb-2">
                <Trophy className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                <CardTitle className="text-lg">Weekly Challenges</CardTitle>
                <CardDescription>Complete to earn bonus points</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 rounded-lg border">
                  <p className="text-sm font-medium">Complete 50 questions</p>
                  <Progress value={70} className="mt-1" />
                  <p className="text-xs text-right mt-1">35/50 questions</p>
                </div>
                <div className="p-2 rounded-lg border">
                  <p className="text-sm font-medium">Study for 5 days straight</p>
                  <Progress value={60} className="mt-1" />
                  <p className="text-xs text-right mt-1">3/5 days</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center pb-2">
                <Medal className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                <CardTitle className="text-lg">Your Statistics</CardTitle>
                <CardDescription>Your learning activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Questions Answered</span>
                  <span className="font-medium">246</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Study Sessions</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Study Streak</span>
                  <span className="font-medium">4 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Time Spent</span>
                  <span className="font-medium">32 hours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Top Study Groups</CardTitle>
                  <CardDescription>Most active and successful groups</CardDescription>
                </div>
                <Badge className="bg-purple-500">Monthly Ranking</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupLeaderboard.map((group) => (
                  <div key={group.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {renderRankBadge(group.rank)}
                    </div>
                    
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{group.name}</p>
                          <p className="text-xs text-muted-foreground">{group.members} members</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{group.totalPoints.toLocaleString()} pts</p>
                          <Badge className={getLevelColor(group.level)} variant="secondary">
                            {group.level}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-1">
                        <Progress value={group.progress} className={getProgressColor(group.progress)} />
                      </div>
                      
                      <div className="mt-1">
                        <p className="text-xs italic">Achievement: {group.recentAchievement}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">View All Groups</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaderboardTab;
