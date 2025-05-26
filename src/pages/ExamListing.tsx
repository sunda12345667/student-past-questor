import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Book, Search, Filter, Bookmark, ShoppingCart, Download, FileText } from 'lucide-react';
import { fetchQuestionPacks, QuestionPack, purchaseQuestionPack } from '@/services/questionsService';
import { processQuestionPackPurchase } from '@/services/paystackService';
import { useAuth } from '@/hooks/auth';

const ExamListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [questionPacks, setQuestionPacks] = useState<QuestionPack[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  
  useEffect(() => {
    const loadQuestionPacks = async () => {
      try {
        setLoading(true);
        const packs = await fetchQuestionPacks();
        setQuestionPacks(packs);
      } catch (error) {
        console.error('Error fetching question packs:', error);
        toast.error('Failed to load question packs');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestionPacks();
  }, []);
  
  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: (packId: string) => purchaseQuestionPack(packId),
    onSuccess: () => {
      toast.success('Purchase successful!');
      navigate('/dashboard#downloads');
    },
    onError: (error) => {
      console.error('Purchase error:', error);
      toast.error('Failed to complete purchase');
    }
  });
  
  const handlePurchase = async (pack: QuestionPack) => {
    try {
      await processQuestionPackPurchase(
        pack.id.toString(),
        `${pack.examType}: ${pack.subject} (${pack.year})`,
        pack.price,
        currentUser
      );
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed');
    }
  };
  
  const filteredPacks = questionPacks.filter(pack => {
    const matchesSearch = pack.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pack.examType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pack.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesExamType = selectedExamType === 'all' || pack.examType === selectedExamType;
    
    return matchesSearch && matchesExamType;
  });
  
  // Get unique exam types for filtering
  const examTypes = Array.from(new Set(questionPacks.map(pack => pack.examType)));
  
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold mb-6">Past Questions & Study Materials</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search by subject, exam type, or title" 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="mr-2 text-sm">Filter:</span>
            <Tabs defaultValue="all" value={selectedExamType} onValueChange={setSelectedExamType}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                {examTypes.map(type => (
                  <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Question Packs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="bg-muted/30 h-36"></CardHeader>
                <CardContent className="pt-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPacks.length > 0 ? (
              filteredPacks.map((pack) => (
                <Card key={pack.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4 relative">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="bg-background">
                        {pack.examType}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <Bookmark className="h-5 w-5" />
                      </Button>
                    </div>
                    <CardTitle className="mt-4">{pack.subject}</CardTitle>
                    <CardDescription>
                      {pack.title} • {pack.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{pack.questionCount} Questions</span>
                      </div>
                      <div className="text-sm text-primary font-medium">
                        {pack.price ? `₦${pack.price.toLocaleString()}` : 'Free'}
                      </div>
                    </div>
                    <p className="text-sm line-clamp-3">{pack.description}</p>
                  </CardContent>
                  <CardFooter className="border-t pt-4 pb-4">
                    <div className="flex space-x-2 w-full">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate(`/questions/${pack.id}`)}
                      >
                        <Book className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => handlePurchase(pack)}
                        disabled={purchaseMutation.isPending}
                      >
                        {pack.price > 0 ? (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {purchaseMutation.isPending ? 'Processing...' : 'Purchase'}
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExamListing;
