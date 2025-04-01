
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, BookText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QuestionPack, fetchPurchasedQuestionPacks } from "@/services/questionsService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const QuestionsTab = () => {
  const [loading, setLoading] = useState(true);
  const [recentPacks, setRecentPacks] = useState<QuestionPack[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPurchasedPacks = async () => {
      try {
        setLoading(true);
        const packs = await fetchPurchasedQuestionPacks();
        setRecentPacks(packs);
      } catch (error) {
        console.error("Error loading question packs:", error);
        toast.error("Failed to load your question packs");
      } finally {
        setLoading(false);
      }
    };

    loadPurchasedPacks();
  }, []);

  const navigateToExams = () => {
    navigate("/exams");
  };

  const startQuestionPack = (packId: string) => {
    navigate(`/questions/${packId}`);
  };

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
            <Button 
              className="w-full"
              onClick={() => navigate(recentPacks.length > 0 ? `/questions/${recentPacks[0]?.id}` : "/exams")}
            >
              {recentPacks.length > 0 ? "Continue Practice" : "Browse Questions"}
            </Button>
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
            <Button 
              className="w-full"
              onClick={() => toast.info("Timed practice mode will be available soon!")}
            >
              Start Timed Mode
            </Button>
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
            <Button className="w-full" onClick={navigateToExams}>
              Browse Library
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">My Progress</h3>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((_, index) => (
              <div key={index} className="p-6 border rounded-lg">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : recentPacks.length > 0 ? (
          <div className="space-y-4">
            {recentPacks.slice(0, 3).map((pack) => (
              <div key={pack.id} className="p-6 border rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="font-medium mb-1">{pack.title}</h4>
                  <p className="text-sm text-muted-foreground">{pack.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{pack.subject}</Badge>
                    <Badge variant="outline">{pack.examType}</Badge>
                  </div>
                </div>
                <Button onClick={() => startQuestionPack(pack.id)}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {recentPacks.length > 3 && (
              <Button variant="link" className="w-full" onClick={navigateToExams}>
                View all purchased question sets
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">
              You haven't started any question sets yet. 
              Browse our marketplace to find study materials!
            </p>
            <Button className="mt-4" onClick={navigateToExams}>Go to Marketplace</Button>
          </div>
        )}
      </div>
    </div>
  );
};
