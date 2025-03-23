
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, GraduationCap, Users, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const NotificationsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Notifications</h2>
        <Button variant="outline" size="sm">
          Mark all as read
        </Button>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-500" />
                <CardTitle className="text-base">System</CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <CardDescription>
              Welcome to StudyQuest! Complete your profile to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm" variant="outline">Complete Profile</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-green-500" />
                <CardTitle className="text-base">Learning</CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">Yesterday</span>
            </div>
            <CardDescription>
              New WAEC past questions are now available in the marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm" variant="outline">View Questions</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-500" />
                <CardTitle className="text-base">Group</CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">3 days ago</span>
            </div>
            <CardDescription>
              You were added to "JAMB Study Club" group.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm" variant="outline">View Group</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-10">
        <h3 className="text-xl font-medium mb-4">Notification Settings</h3>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <Label htmlFor="new-materials">New Study Materials</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get notified when new study materials are available
                </p>
              </div>
              <Switch id="new-materials" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <Label htmlFor="group-activities">Group Activities</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get notified about activities in your study groups
                </p>
              </div>
              <Switch id="group-activities" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <Label htmlFor="study-reminders">Study Reminders</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get reminders for scheduled study sessions
                </p>
              </div>
              <Switch id="study-reminders" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
