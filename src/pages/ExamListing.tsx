import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Book, Search, Filter, Bookmark, ShoppingCart, Download, FileText } from 'lucide-react';
import { fetchQuestionPacks, QuestionPack, purchaseQuestionPack } from '@/services/questionsService';
import { processQuestionPackPurchase } from '@/services/paystackService'; 
import { useAuth } from '@/contexts/AuthContext';

const ExamListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [questionPacks, setQuestionPacks] = useState<QuestionPack[]>([]);
  const [filteredPacks, setFilteredPacks] = useState<QuestionPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [purchasing, setPurchasing] = useState<string | null>(null);
  
  const examTypes = ['All', 'WAEC', 'JAMB', 'NECO', 'Cambridge', 'Post-UTME'];
  const subjects = ['All', 'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'General', 'Science', 'Arts', 'Engineering'];
  const years = ['All', '2023', '2022', '2021', '2020', '2019'];
  
  const [selectedExamType, setSelectedExamType] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  useEffect(() => {
    const loadQuestionPacks = async () => {
      try {
        setLoading(true);
        const packs = await fetchQuestionPacks();
        setQuestionPacks(packs);
        setFilteredPacks(packs);
      } catch (error) {
        toast.error('Failed to load question packs');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestionPacks();
  }, [toast]);

  useEffect(() => {
    let filtered = [...questionPacks];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pack => 
        pack.title.toLowerCase().includes(query) ||
        pack.description.toLowerCase().includes(query) ||
        pack.subject.toLowerCase().includes(query)
      );
    }
    
    if (selectedExamType !== 'All') {
      filtered = filtered.filter(pack => pack.examType === selectedExamType);
    }
    
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(pack => pack.subject === selectedSubject);
    }
    
    if (selectedYear !== 'All') {
      filtered = filtered.filter(pack => pack.year === selectedYear);
    }
    
    setFilteredPacks(filtered);
  }, [questionPacks, searchQuery, selectedExamType, selectedSubject, selectedYear]);

  const handlePurchase = async (packId: string) => {
    try {
      setPurchasing(packId);
      const pack = questionPacks.find(p => p.id === packId);
      
      if (!pack) {
        toast.error('Question pack not found');
        return;
      }
      
      const result = await processQuestionPackPurchase(
        packId, 
        pack.title, 
        pack.price, 
        currentUser
      );
      
      if (result.success) {
        setQuestionPacks(prevPacks => 
          prevPacks.map(pack => 
            pack.id === packId 
              ? { 
                  ...pack, 
                  purchasedDate: new Date().toISOString().split('T')[0],
                  status: 'Available'
                } 
              : pack
          )
        );
        
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to purchase question pack');
      console.error('Purchase error:', error);
    } finally {
      setPurchasing(null);
    }
  };

  const handleDownload = (packId: string, title: string) => {
    toast.success(`Started downloading ${title} PDF...`);
    
    setTimeout(() => {
      toast.success(`${title} PDF downloaded successfully!`);
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-2">Past Questions PDF Library</h1>
          <p className="text-muted-foreground">
            Browse our comprehensive collection of downloadable past exam question PDFs to prepare for your exams.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Exam Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {examTypes.map(examType => (
                      <Badge
                        key={examType}
                        variant={selectedExamType === examType ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedExamType(examType)}
                      >
                        {examType}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Subject</h3>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map(subject => (
                      <Badge
                        key={subject}
                        variant={selectedSubject === subject ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedSubject(subject)}
                      >
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Year</h3>
                  <div className="flex flex-wrap gap-2">
                    {years.map(year => (
                      <Badge
                        key={year}
                        variant={selectedYear === year ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedYear(year)}
                      >
                        {year}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search past question PDFs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All PDFs</TabsTrigger>
                <TabsTrigger value="purchased">Purchased</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {loading ? (
                  <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3, 4].map((_, index) => (
                      <Card key={index} className="animate-pulse">
                        <CardHeader>
                          <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                          <div className="h-4 w-1/2 bg-muted rounded"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-4 w-full bg-muted rounded mb-2"></div>
                          <div className="h-4 w-full bg-muted rounded mb-2"></div>
                          <div className="h-4 w-3/4 bg-muted rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredPacks.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredPacks.map((pack) => (
                      <Card key={pack.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{pack.title} PDF</CardTitle>
                              <CardDescription>{pack.description}</CardDescription>
                            </div>
                            {pack.purchasedDate && (
                              <Badge variant="secondary">Purchased</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="bg-primary/10">
                              {pack.subject}
                            </Badge>
                            <Badge variant="outline" className="bg-primary/10">
                              {pack.examType}
                            </Badge>
                            <Badge variant="outline" className="bg-primary/10">
                              {pack.year}
                            </Badge>
                            <Badge variant="outline" className="bg-primary/10">
                              <FileText className="h-3 w-3 mr-1" /> PDF Document
                            </Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <div className="text-lg font-semibold">
                            ₦{pack.price.toLocaleString()}
                          </div>
                          <div className="flex gap-2">
                            {pack.purchasedDate ? (
                              <Button 
                                onClick={() => handleDownload(pack.id, pack.title)}
                                variant="default"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </Button>
                            ) : (
                              <Button 
                                onClick={() => handlePurchase(pack.id)}
                                disabled={purchasing === pack.id}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                {purchasing === pack.id ? 'Processing...' : 'Purchase PDF'}
                              </Button>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 glass-panel rounded-xl">
                    <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No PDFs Found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="purchased">
                {loading ? (
                  <div className="grid grid-cols-1 gap-4">
                    {[1, 2].map((_, index) => (
                      <Card key={index} className="animate-pulse">
                        <CardHeader>
                          <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                          <div className="h-4 w-1/2 bg-muted rounded"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-4 w-full bg-muted rounded mb-2"></div>
                          <div className="h-4 w-3/4 bg-muted rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredPacks.filter(pack => pack.purchasedDate).length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredPacks
                      .filter(pack => pack.purchasedDate)
                      .map((pack) => (
                        <Card key={pack.id}>
                          <CardHeader>
                            <CardTitle>{pack.title} PDF</CardTitle>
                            <CardDescription>{pack.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="outline" className="bg-primary/10">
                                {pack.subject}
                              </Badge>
                              <Badge variant="outline" className="bg-primary/10">
                                {pack.examType}
                              </Badge>
                              <Badge variant="outline" className="bg-primary/10">
                                {pack.year}
                              </Badge>
                              <Badge variant="outline" className="bg-primary/10">
                                <FileText className="h-3 w-3 mr-1" /> PDF Document
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Purchased on {pack.purchasedDate}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              className="w-full"
                              onClick={() => handleDownload(pack.id, pack.title)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                          </CardFooter>
                        </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 glass-panel rounded-xl">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Purchased PDFs</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't purchased any past question PDFs yet.
                    </p>
                    <Button onClick={() => navigate('/exams')}>
                      Browse PDFs
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExamListing;
