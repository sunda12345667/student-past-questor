
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
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Gift,
  Award,
  Clock,
  TrendingUp,
  CheckCircle,
  RefreshCcw,
  Smartphone,
  CreditCard,
  School,
  Wallet,
  Disc
} from 'lucide-react';

const RewardsTab = () => {
  const { toast } = useToast();
  const [spinAnimation, setSpinAnimation] = useState(false);
  const [dailySpinAvailable, setDailySpinAvailable] = useState(true);
  
  const [userRewards] = useState({
    coins: 2500,
    cashBalance: 3000, // in Naira
    referralCount: 8,
    studyStreak: 5,
    challengesCompleted: 12,
    nextReward: {
      name: 'Airtime Voucher',
      threshold: 3000,
      progress: 2500,
    }
  });
  
  const challenges = [
    {
      id: '1',
      title: 'Daily Study Challenge',
      description: 'Study for at least 30 minutes today',
      reward: '50 coins',
      expiry: 'Today',
      completed: false,
      progress: 15,
      total: 30
    },
    {
      id: '2',
      title: 'Quiz Master',
      description: 'Answer 100 practice questions this week',
      reward: '500 coins',
      expiry: '5 days left',
      completed: false,
      progress: 68,
      total: 100
    },
    {
      id: '3',
      title: 'Group Contributor',
      description: 'Contribute to 3 different study group discussions',
      reward: '200 coins',
      expiry: '3 days left',
      completed: false,
      progress: 2,
      total: 3
    },
    {
      id: '4',
      title: 'Consistency Champion',
      description: 'Maintain a 7-day study streak',
      reward: '₦500 cash reward',
      expiry: 'Ongoing',
      completed: false,
      progress: 5,
      total: 7
    }
  ];
  
  const redeemOptions = [
    {
      id: '1',
      title: 'Airtime Recharge',
      description: 'Convert your coins to airtime',
      icon: <Smartphone className="h-5 w-5" />,
      cost: '1000 coins = ₦200 airtime',
      buttonText: 'Redeem Airtime'
    },
    {
      id: '2',
      title: 'Data Bundle',
      description: 'Convert your coins to data',
      icon: <Smartphone className="h-5 w-5" />,
      cost: '2500 coins = 1GB data',
      buttonText: 'Redeem Data'
    },
    {
      id: '3',
      title: 'Cash Withdrawal',
      description: 'Withdraw your earnings to your bank',
      icon: <CreditCard className="h-5 w-5" />,
      cost: 'Min: ₦1000',
      buttonText: 'Withdraw Cash'
    },
    {
      id: '4',
      title: 'School Fees Discount',
      description: 'Get a discount coupon for your school fees',
      icon: <School className="h-5 w-5" />,
      cost: '5000 coins = 5% discount',
      buttonText: 'Get Discount'
    }
  ];
  
  const handleCompleteChallenge = (challengeId: string) => {
    toast({
      title: "Challenge completed!",
      description: "You've earned rewards for completing this challenge.",
    });
  };
  
  const handleRedeemReward = (rewardId: string) => {
    toast({
      title: "Reward redeemed",
      description: "Your reward has been processed successfully.",
    });
  };
  
  const handleDailySpin = () => {
    setSpinAnimation(true);
    
    // After 3 seconds, show reward and stop animation
    setTimeout(() => {
      setSpinAnimation(false);
      setDailySpinAvailable(false);
      
      toast({
        title: "Congratulations!",
        description: "You won 100 study coins!",
      });
    }, 3000);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium">Rewards & Challenges</h2>
      
      {/* User Rewards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="text-center pb-2">
            <Gift className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Study Coins</CardTitle>
            <CardDescription>Earn by completing challenges</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold">{userRewards.coins}</p>
            <Progress 
              value={(userRewards.nextReward.progress / userRewards.nextReward.threshold) * 100} 
              className="mt-2" 
            />
            <p className="text-xs mt-1">
              {userRewards.nextReward.progress} / {userRewards.nextReward.threshold} for {userRewards.nextReward.name}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center pb-2">
            <Wallet className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <CardTitle className="text-lg">Cash Balance</CardTitle>
            <CardDescription>Withdraw or use for purchases</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold">₦{userRewards.cashBalance.toLocaleString()}</p>
            <Button variant="outline" className="mt-2 w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center pb-2">
            <Award className="h-8 w-8 mx-auto text-amber-500 mb-2" />
            <CardTitle className="text-lg">Your Stats</CardTitle>
            <CardDescription>Your reward activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Referrals</span>
              <span className="font-medium">{userRewards.referralCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Study Streak</span>
              <span className="font-medium">{userRewards.studyStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Challenges Completed</span>
              <span className="font-medium">{userRewards.challengesCompleted}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Daily Spin */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Daily Spin & Win</CardTitle>
          <CardDescription>Spin once daily for a chance to win prizes</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div 
            className={`relative w-48 h-48 border-4 border-primary rounded-full flex items-center justify-center mb-4 ${
              spinAnimation ? 'animate-spin' : ''
            }`}
          >
            <Disc className="h-40 w-40 text-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background p-4 rounded-full">
                <Gift className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          
          <Button 
            disabled={!dailySpinAvailable || spinAnimation} 
            onClick={handleDailySpin}
            className="w-full sm:w-48"
          >
            {spinAnimation ? (
              <>
                <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                Spinning...
              </>
            ) : dailySpinAvailable ? (
              <>
                <Gift className="h-4 w-4 mr-2" />
                Spin Now
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Come Back Tomorrow
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {/* Challenges and Rewards Tabs */}
      <Tabs defaultValue="challenges">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="challenges">Active Challenges</TabsTrigger>
          <TabsTrigger value="redeem">Redeem Rewards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="challenges" className="space-y-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{challenge.title}</CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{challenge.expiry}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span>Progress: {challenge.progress}/{challenge.total}</span>
                  <span className="font-medium">Reward: {challenge.reward}</span>
                </div>
                <Progress value={(challenge.progress / challenge.total) * 100} />
              </CardContent>
              <CardFooter>
                <Button 
                  variant={challenge.completed ? "outline" : "default"} 
                  className="w-full"
                  disabled={challenge.completed || challenge.progress < challenge.total}
                  onClick={() => handleCompleteChallenge(challenge.id)}
                >
                  {challenge.completed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : challenge.progress >= challenge.total ? (
                    <>
                      <Gift className="h-4 w-4 mr-2" />
                      Claim Reward
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      In Progress
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="redeem" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {redeemOptions.map((option) => (
              <Card key={option.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {option.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{option.title}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">{option.cost}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleRedeemReward(option.id)}
                  >
                    {option.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RewardsTab;
