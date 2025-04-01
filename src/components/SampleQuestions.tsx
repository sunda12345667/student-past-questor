import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, ExternalLink } from 'lucide-react';
import { fetchSampleQuestions, SampleQuestion } from '@/services/questionsService';
import { processQuestionPackPurchase } from '@/services/paystackService';
import { useToast } from '@/hooks/use-toast';

interface SubjectGroup {
  subject: string;
  questions: SampleQuestion[];
}

export function SampleQuestions() {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<SampleQuestion[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const data = await fetchSampleQuestions();
        setQuestions(data);
        
        // Group questions by subject
        const groupedQuestions = data.reduce<Record<string, SampleQuestion[]>>((acc, question) => {
          if (!acc[question.subject]) {
            acc[question.subject] = [];
          }
          acc[question.subject].push(question);
          return acc;
        }, {});
        
        const groups = Object.entries(groupedQuestions).map(([subject, questions]) => ({
          subject,
          questions
        }));
        
        setSubjectGroups(groups);
        
        // Set initial active tab
        if (groups.length > 0) {
          setActiveTab(groups[0].subject);
        }
      } catch (error) {
        console.error('Failed to fetch sample questions:', error);
        toast({
          title: "Error",
          description: "Failed to load sample questions",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [toast]);
  
  const handleDownload = async (question: SampleQuestion) => {
    try {
      toast({
        title: "Downloading...",
        description: `Preparing ${question.subject} sample questions`,
      });
      
      await processQuestionPackPurchase(
        question.id.toString(),
        `${question.subject}: ${question.title} (${question.examType} ${question.year})`,
        question.price,
        null // Add the missing 4th parameter (user), using null for sample questions since we don't require authentication here
      );
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading these sample questions",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Sample Questions</h2>
            <p className="text-muted-foreground mt-2">Loading sample questions...</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-5 bg-muted rounded w-1/3"></div>
                  <div className="h-6 bg-muted rounded w-2/3"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Sample Questions</h2>
          <p className="text-muted-foreground mt-2">Preview our high-quality exam prep materials</p>
        </div>
        
        {subjectGroups.length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                {subjectGroups.map((group) => (
                  <TabsTrigger key={group.subject} value={group.subject}>
                    {group.subject}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {subjectGroups.map((group) => (
              <TabsContent key={group.subject} value={group.subject} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.questions.map((question) => (
                    <Card key={question.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/30">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="bg-background">
                            {question.examType} {question.year}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{question.title}</CardTitle>
                        <CardDescription>{question.subject}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm mb-4 line-clamp-3">{question.content}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            Free sample
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownload(question)}
                            >
                              <Download className="h-4 w-4 mr-2" /> Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Button asChild>
                    <a href="/exams">
                      View All Available Questions <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sample questions available at the moment.</p>
            <Button asChild className="mt-4">
              <a href="/exams">
                View All Available Questions <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
