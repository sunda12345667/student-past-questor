
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, BookText } from "lucide-react";

export const QuestionsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium">My Question Bank</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Recent Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Continue where you left off with your recent question sets.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">View Recent</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Timed Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Test yourself with timed question sets to simulate exam conditions.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Start Timed Mode</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BookText className="w-5 h-5 mr-2" />
              Browse All
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Browse our complete library of past questions and practice sets.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Browse Library</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">My Progress</h3>
        
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">
            You haven't started any question sets yet. 
            Browse our marketplace to find study materials!
          </p>
          <Button className="mt-4">Go to Marketplace</Button>
        </div>
      </div>
    </div>
  );
};
