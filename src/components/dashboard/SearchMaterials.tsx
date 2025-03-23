
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
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Book, 
  FileText, 
  Download, 
  Eye, 
  ShoppingCart 
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { processQuestionPackPurchase } from '@/services/paystackService';

// Mock data for study materials
const mockMaterials = [
  {
    id: '1',
    title: 'JAMB Past Questions (Mathematics)',
    type: 'past-question',
    subject: 'Mathematics',
    year: '2023',
    examType: 'JAMB',
    description: 'Complete set of JAMB Mathematics questions with solutions.',
    price: 1500,
    format: 'PDF',
    preview: 'If x² + y² = 25 and x + y = 7, find the value of x - y.',
    purchasedDate: null
  },
  {
    id: '2',
    title: 'WAEC Biology E-book',
    type: 'ebook',
    subject: 'Biology',
    year: '2023',
    examType: 'WAEC',
    description: 'Comprehensive Biology e-book for WAEC preparation with all topics covered.',
    price: 2500,
    format: 'PDF',
    preview: 'Chapter 1: Cell Structure and Functions...',
    purchasedDate: null
  },
  {
    id: '3',
    title: 'NECO Physics Past Questions',
    type: 'past-question',
    subject: 'Physics',
    year: '2022',
    examType: 'NECO',
    description: 'Complete NECO Physics past questions with detailed explanations.',
    price: 1800,
    format: 'PDF',
    preview: 'Calculate the tension in a string when a mass of 5kg is attached to it.',
    purchasedDate: null
  },
  {
    id: '4',
    title: 'English Language Study Guide',
    type: 'ebook',
    subject: 'English',
    year: '2023',
    examType: 'General',
    description: 'Complete guide to English language proficiency with practice exercises.',
    price: 2000,
    format: 'PDF',
    preview: 'Chapter 3: Understanding Figures of Speech...',
    purchasedDate: '2023-09-12'
  }
];

const SearchMaterials = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedExamType, setSelectedExamType] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [onlyFree, setOnlyFree] = useState(false);
  const [materials, setMaterials] = useState(mockMaterials);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  
  // Filter materials based on search criteria
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = searchQuery === '' || 
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSubject = selectedSubject === '' || material.subject === selectedSubject;
    const matchesYear = selectedYear === '' || material.year === selectedYear;
    const matchesExamType = selectedExamType === '' || material.examType === selectedExamType;
    const matchesFormat = selectedFormat === '' || material.format === selectedFormat;
    const matchesFree = !onlyFree || material.price === 0;
    
    return matchesSearch && matchesSubject && matchesYear && matchesExamType && matchesFormat && matchesFree;
  });
  
  const handlePreview = (material: any) => {
    // In a real app, this would open a preview modal
    toast({
      title: "Preview opened",
      description: `Previewing ${material.title}`,
    });
  };
  
  const handlePayNow = async (material: any) => {
    try {
      setProcessingPayment(material.id);
      await processQuestionPackPurchase(
        material.id,
        material.title,
        material.price
      );
      
      toast({
        title: "Payment Initiated",
        description: "You will be redirected to the payment page.",
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingPayment(null);
    }
  };
  
  const handleDownload = (material: any) => {
    // In a real app, this would trigger a download
    toast({
      title: "Download started",
      description: `Downloading ${material.title}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium">Search Study Materials</h2>
      
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by title, subject, or keyword..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Subject" />
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
          
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Years</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedExamType} onValueChange={setSelectedExamType}>
            <SelectTrigger>
              <SelectValue placeholder="Exam Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Exams</SelectItem>
              <SelectItem value="JAMB">JAMB</SelectItem>
              <SelectItem value="WAEC">WAEC</SelectItem>
              <SelectItem value="NECO">NECO</SelectItem>
              <SelectItem value="Cambridge">Cambridge</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Formats</SelectItem>
              <SelectItem value="PDF">PDF</SelectItem>
              <SelectItem value="DOCX">Word</SelectItem>
              <SelectItem value="EPUB">EPUB</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="free-only"
              checked={onlyFree}
              onCheckedChange={(checked) => setOnlyFree(checked === true)}
            />
            <Label htmlFor="free-only">Free Only</Label>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Found {filteredMaterials.length} materials</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="overflow-hidden transition-all hover:border-primary">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">
                        {material.type === 'past-question' ? 'Past Questions' : 'E-Book'}
                      </Badge>
                      <Badge variant="outline">{material.examType}</Badge>
                      <Badge variant="outline">{material.year}</Badge>
                    </div>
                    <CardTitle className="text-base">{material.title}</CardTitle>
                    <CardDescription>{material.subject}</CardDescription>
                  </div>
                  {material.type === 'past-question' ? (
                    <FileText className="h-6 w-6 text-primary" />
                  ) : (
                    <Book className="h-6 w-6 text-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2 mb-2">{material.description}</p>
                <div className="bg-muted p-2 rounded-md text-xs italic mb-2">
                  <p className="line-clamp-2">{material.preview}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">
                    {material.price === 0 ? 'FREE' : `₦${material.price.toLocaleString()}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Format: {material.format}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => handlePreview(material)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                
                {material.purchasedDate ? (
                  <Button onClick={() => handleDownload(material)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handlePayNow(material)}
                    disabled={processingPayment === material.id}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {processingPayment === material.id ? 'Processing...' : 'Buy Now'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchMaterials;
