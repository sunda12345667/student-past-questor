import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Download, 
  ShoppingCart,
  Eye
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { initializePayment, checkPurchaseStatus } from '@/services/paystackService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Add a mock implementation for the missing function
const processQuestionPackPurchase = async (packId: string, title: string, price: number) => {
  // In a real app, call the actual initializePayment function
  toast.success(`Processing payment for ${title}...`);
  return { success: true };
};

const SearchMaterials = () => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<string | null>(null);
  
  // Mock data for search results
  const searchResults = [
    {
      id: '1',
      title: 'WAEC Mathematics 2023',
      description: 'Complete set of WAEC Mathematics questions with solutions',
      subject: 'Mathematics',
      examType: 'WAEC',
      year: '2023',
      type: 'Past Questions',
      price: 1500,
      isPurchased: true
    },
    {
      id: '2',
      title: 'JAMB Physics 2022-2023',
      description: 'Comprehensive JAMB Physics questions and answers',
      subject: 'Physics',
      examType: 'JAMB',
      year: '2023',
      type: 'Past Questions',
      price: 1200,
      isPurchased: false
    },
    {
      id: '3',
      title: 'NECO Biology Practical Guide',
      description: 'Step-by-step guide for NECO Biology practical examinations',
      subject: 'Biology',
      examType: 'NECO',
      year: '2023',
      type: 'Study Guide',
      price: 1800,
      isPurchased: false
    },
    {
      id: '4',
      title: 'Cambridge A-Level Chemistry',
      description: 'Past questions and solutions for Cambridge A-Level Chemistry',
      subject: 'Chemistry',
      examType: 'Cambridge',
      year: '2022',
      type: 'Past Questions',
      price: 2500,
      isPurchased: false
    },
    {
      id: '5',
      title: 'English Language Comprehensive Guide',
      description: 'Complete guide for mastering English Language examinations',
      subject: 'English',
      examType: 'General',
      year: '2023',
      type: 'Study Guide',
      price: 1700,
      isPurchased: true
    }
  ];
  
  // Filter results based on search query and filters
  const filteredResults = searchResults.filter(item => {
    const matchesQuery = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = selectedSubject === '' || item.subject === selectedSubject;
    const matchesExamType = selectedExamType === '' || item.examType === selectedExamType;
    const matchesYear = selectedYear === '' || item.year === selectedYear;
    
    return matchesQuery && matchesSubject && matchesExamType && matchesYear;
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Searching for "${searchQuery}"...`);
  };
  
  const handlePurchase = async (item: typeof searchResults[0]) => {
    if (!currentUser) {
      toast.error('Please log in to make a purchase');
      return;
    }
    
    try {
      setIsProcessingPayment(item.id);
      
      // Check if already purchased
      const isPurchased = await checkPurchaseStatus(currentUser.id, item.id);
      if (isPurchased) {
        toast.info('You already own this material');
        setIsProcessingPayment(null);
        return;
      }
      
      // Process payment
      await processQuestionPackPurchase(item.id, item.title, item.price);
      
      toast.success(`Purchase initiated for ${item.title}`);
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsProcessingPayment(null);
    }
  };
  
  const handleDownload = (item: typeof searchResults[0]) => {
    toast.success(`Downloading ${item.title}...`);
  };
  
  const handlePreview = (item: typeof searchResults[0]) => {
    toast.info(`Opening preview for ${item.title}...`);
  };
  
  const clearFilters = () => {
    setSelectedSubject('');
    setSelectedExamType('');
    setSelectedYear('');
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium">Search Study Materials</h2>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for past questions, study guides, and more..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </form>
      
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Subjects</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exam-type">Exam Type</Label>
                <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                  <SelectTrigger id="exam-type">
                    <SelectValue placeholder="All Exam Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Exam Types</SelectItem>
                    <SelectItem value="WAEC">WAEC</SelectItem>
                    <SelectItem value="JAMB">JAMB</SelectItem>
                    <SelectItem value="NECO">NECO</SelectItem>
                    <SelectItem value="Cambridge">Cambridge</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Years</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                    <SelectItem value="2019">2019</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox id="free-only" />
              <Label htmlFor="free-only">Show only free materials</Label>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Search Results</h3>
          <span className="text-sm text-muted-foreground">
            {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found
          </span>
        </div>
        <Separator />
      </div>
      
      {filteredResults.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No results found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResults.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-1">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    {item.isPurchased && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Purchased
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="secondary">{item.subject}</Badge>
                    <Badge variant="secondary">{item.examType}</Badge>
                    <Badge variant="secondary">{item.year}</Badge>
                    <Badge variant="secondary">{item.type}</Badge>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-6 flex flex-row md:flex-col justify-between items-center md:items-end gap-4 border-t md:border-t-0 md:border-l border-border">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Price</div>
                    <div className="text-xl font-bold">₦{item.price.toLocaleString()}</div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {item.isPurchased ? (
                      <Button onClick={() => handleDownload(item)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handlePurchase(item)}
                        disabled={isProcessingPayment === item.id}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isProcessingPayment === item.id ? 'Processing...' : 'Purchase'}
                      </Button>
                    )}
                    
                    <Button variant="outline" onClick={() => handlePreview(item)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchMaterials;
