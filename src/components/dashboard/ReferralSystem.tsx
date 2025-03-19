
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share, User, Users } from "lucide-react";

const ReferralSystem = () => {
  const { toast } = useToast();
  const referralCode = "STUDY" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
    });
  };

  const shareReferral = () => {
    // In a real implementation, this would open a share dialog
    toast({
      title: "Share",
      description: "Sharing functionality would open here.",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium">Refer & Earn</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>
            Share this code with friends and earn points when they sign up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input value={referralCode} readOnly className="font-mono text-center" />
            <Button variant="outline" size="icon" onClick={copyReferralCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button onClick={shareReferral} className="w-full">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="w-full">
              <User className="mr-2 h-4 w-4" />
              Invite Friends
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="history">Referral History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Referrals</CardDescription>
                <CardTitle className="text-3xl">12</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">4 active this month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Points Earned</CardDescription>
                <CardTitle className="text-3xl">2,500</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground">Worth ₦5,000</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-3 p-4 font-medium">
                  <div>Name</div>
                  <div>Date</div>
                  <div>Status</div>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="grid grid-cols-3 p-4 border-t">
                    <div>John Doe</div>
                    <div>2023-08-{10 + i}</div>
                    <div className="text-green-600">Active</div>
                  </div>
                ))}
                {[4, 5].map((i) => (
                  <div key={i} className="grid grid-cols-3 p-4 border-t">
                    <div>Jane Smith</div>
                    <div>2023-07-{20 + i}</div>
                    <div className="text-amber-600">Pending</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReferralSystem;
