
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
  ShoppingBag, 
  Upload, 
  Book, 
  FileText, 
  Plus, 
  Eye, 
  ShoppingCart,
  BookOpen,
  Download
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { processQuestionPackPurchase } from '@/services/paystackService';

// Mock marketplace data
const marketplaceItems = [
  {
    id: '1',
    title: 'JAMB Physics Complete Guide',
    type: 'ebook',
    subject: 'Physics',
    description: 'A comprehensive guide to JAMB Physics with practice questions and solutions.',
    price: 2500,
    seller: {
      id: 'user1',
      name: 'Prof. Adebayo',
      avatar: '',
      rating: 4.8
    },
    downloads: 253,
    pages: 120,
    format: 'PDF',
    preview: 'Chapter 1: Kinematics - Understanding motion in one and two dimensions...',
    featured: true
  },
  {
    id: '2',
    title: 'WAEC Mathematics Past Questions (2018-2023)',
    type: 'past-question',
    subject: 'Mathematics',
    description: 'Five years of compiled WAEC Mathematics questions with detailed solutions.',
    price: 1800,
    seller: {
      id: 'user2',
      name: 'ExamPrep Nigeria',
      avatar: '',
      rating: 4.9
    },
    downloads: 478,
    pages: 85,
    format: 'PDF',
    preview: 'Question 1 (2023): If f(x) = 2x² - 3x + 4, find f(2)...',
    featured: true
  },
  {
    id: '3',
    title: 'English Language: Mastering Comprehension',
    type: 'ebook',
    subject: 'English',
    description: 'Learn techniques to excel in English comprehension passages and questions.',
    price: 1500,
    seller: {
      id: 'user3',
      name: 'Mrs. Okonkwo',
      avatar: '',
      rating: 4.6
    },
    downloads: 196,
    pages: 76,
    format: 'PDF',
    preview: 'Chapter 3: Inference and Deduction - How to read between the lines...',
    featured: false
  },
  {
    id: '4',
    title: 'Biology Practical Guide',
    type: 'ebook',
    subject: 'Biology',
    description: 'A complete guide to biology practical experiments and diagrams.',
    price: 2000,
    seller: {
      id: 'user4',
      name: 'BioScience Academy',
      avatar: '',
      rating: 4.7
    },
    downloads: 312,
    pages: 94,
    format: 'PDF',
    preview: 'Experiment 5: Observing Cell Structure Under a Microscope...',
    featured: false
  },
  {
    id: '5',
    title: 'Chemistry Equations and Reactions',
    type: 'ebook',
    subject: 'Chemistry',
    description: 'Master chemical equations, balancing, and predicting reaction outcomes.',
    price: 1700,
    seller: {
      id: 'user5',
      name: 'ChemWhiz',
      avatar: '',
      rating: 4.5
    },
    downloads: 189,
    pages: 88,
    format: 'PDF',
    preview: 'Section 2.3: Balancing Redox Reactions in Acidic and Basic Solutions...',
    featured: false
  },
  {
    id: '6',
    title: 'NECO Literature Past Questions (2019-2023)',
    type: 'past-question',
    subject: 'Literature',
    description: 'Compiled NECO Literature in English questions with detailed analyses of texts.',
    price: 1600,
    seller: {
      id: 'user6',
      name: 'LitMasters',
      avatar: '',
      rating: 4.4
    },
    downloads: 142,
    pages: 72,
    format: 'PDF',
    preview: 'Question 3 (2022): Analyze the character of Okonkwo in "Things Fall Apart"...',
    featured: false
  }
];

// User's uploaded materials
const userUploads = [
  {
    id: '7',
    title: 'Economics Study Notes',
    type: 'ebook',
    subject: 'Economics',
    description: 'Personal study notes for Economics exams covering micro and macroeconomics.',
    price: 1200,
    downloads: 37,
    pages: 45,
    format: 'PDF',
    status: 'approved',
    earnings: 44400,
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
  },
  {
    id: '8',
    title: 'Government & Politics Notes',
    type: 'ebook',
    subject: 'Government',
    description: 'Comprehensive notes on Nigerian government and politics for JAMB and WAEC.',
    price: 1000,
    downloads: 18,
    pages: 32,
    format: 'PDF',
    status: 'pending',
    earnings: 0,
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  }
];

const Marketplace = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [onlyFree, setOnlyFree] = useState(false);
  const [materials, setMaterials] = useState(marketplaceItems);
  const [uploads, setUploads] = useState(userUploads);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newUpload, setNewUpload] = useState({
    title: '',
    subject: '',
    type: 'ebook',
    description: '',
    price: '',
    file: null as File | null
  });
  
  // Filter materials based on search criteria
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = searchQuery === '' || 
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSubject = selectedSubject === '' || material.subject === selectedSubject;
    const matchesType = selectedType === '' || material.type === selectedType;
    const matchesFree = !onlyFree || material.price === 0;
    
    return matchesSearch && matchesSubject && matchesType && matchesFree;
  });
  
  const featuredMaterials = filteredMaterials.filter(material => material.featured);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewUpload(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUpload(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewUpload(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUpload = () => {
    if (!newUpload.title || !newUpload.subject || !newUpload.file) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields and select a file.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const uploadedItem = {
        id: Date.now().toString(),
        title: newUpload.title,
        type: newUpload.type,
        subject: newUpload.subject,
        description: newUpload.description,
        price: parseFloat(newUpload.price) || 0,
        downloads: 0,
        pages: 0, // Would be determined from the actual file
        format: newUpload.file?.name.split('.').pop()?.toUpperCase() || 'PDF',
        status: 'pending',
        earnings: 0,
        uploadDate: new Date()
      };
      
      setUploads(prev => [uploadedItem, ...prev]);
      setIsUploading(false);
      
      // Reset form
      setNewUpload({
        title: '',
        subject: '',
        type: 'ebook',
        description: '',
        price: '',
        file: null
      });
      
      toast({
        title: "Upload successful",
        description: "Your material has been uploaded and is pending review.",
      });
    }, 2000);
  };
  
  const handlePreview = (material: any) => {
    toast({
      title: "Preview opened",
      description: `Previewing ${material.title}`,
    });
  };
  
  const handleBuyNow = async (material: any) => {
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Marketplace</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Sell Materials
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Study Material</DialogTitle>
              <DialogDescription>
                Share your notes and materials with other students and earn money.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  name="title"
                  placeholder="e.g., Physics Study Notes"
                  value={newUpload.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={newUpload.subject} 
                    onValueChange={(value) => handleSelectChange('subject', value)}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Economics">Economics</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                      <SelectItem value="Literature">Literature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Material Type</Label>
                  <Select 
                    value={newUpload.type} 
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ebook">E-Book/Notes</SelectItem>
                      <SelectItem value="past-question">Past Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  placeholder="Describe your material"
                  rows={3}
                  value={newUpload.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (in Naira)</Label>
                <Input 
                  id="price"
                  name="price"
                  type="number"
                  placeholder="e.g., 1000"
                  value={newUpload.price}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file">Upload File (PDF, DOCX)</Label>
                <div className="border-2 border-dashed rounded-md p-4 text-center">
                  <Input 
                    id="file"
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Label htmlFor="file" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium">
                        {newUpload.file ? newUpload.file.name : 'Click to select a file'}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Maximum file size: 10MB
                      </span>
                    </div>
                  </Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>Uploading...</>
                ) : (
                  <>Upload Material</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="browse">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Materials</TabsTrigger>
          <TabsTrigger value="my-uploads">My Uploads</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for study materials..."
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Material Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="ebook">E-Books</SelectItem>
                  <SelectItem value="past-question">Past Questions</SelectItem>
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
          
          {/* Featured Materials */}
          {featuredMaterials.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Featured Materials
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredMaterials.map((material) => (
                  <Card key={material.id} className="overflow-hidden transition-all hover:border-primary">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/20">
                              Featured
                            </Badge>
                            <Badge variant="outline">
                              {material.type === 'past-question' ? 'Past Questions' : 'E-Book'}
                            </Badge>
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
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={material.seller.avatar} alt={material.seller.name} />
                            <AvatarFallback>
                              {material.seller.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{material.seller.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <span className="text-xs font-medium">{material.seller.rating}</span>
                          <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-lg font-semibold">
                          {material.price === 0 ? 'FREE' : `₦${material.price.toLocaleString()}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Download className="h-3 w-3 inline mr-1" />
                          {material.downloads} downloads
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => handlePreview(material)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        onClick={() => handleBuyNow(material)}
                        disabled={processingPayment === material.id}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {processingPayment === material.id ? 'Processing...' : 'Buy Now'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* All Materials */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">All Study Materials</h3>
            
            {filteredMaterials.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No materials found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedSubject || selectedType ? 
                    'Try adjusting your search filters' : 
                    'There are no materials available at the moment'}
                </p>
              </div>
            ) : (
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
                            <Badge variant="outline">{material.subject}</Badge>
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
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={material.seller.avatar} alt={material.seller.name} />
                            <AvatarFallback>
                              {material.seller.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{material.seller.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <span className="text-xs font-medium">{material.seller.rating}</span>
                          <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-lg font-semibold">
                          {material.price === 0 ? 'FREE' : `₦${material.price.toLocaleString()}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Download className="h-3 w-3 inline mr-1" />
                          {material.downloads} downloads
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => handlePreview(material)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        onClick={() => handleBuyNow(material)}
                        disabled={processingPayment === material.id}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {processingPayment === material.id ? 'Processing...' : 'Buy Now'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="my-uploads" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Materials You've Uploaded</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                {/* Upload form (Same as above) */}
                <DialogHeader>
                  <DialogTitle>Upload Study Material</DialogTitle>
                  <DialogDescription>
                    Share your notes and materials with other students and earn money.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title"
                      name="title"
                      placeholder="e.g., Physics Study Notes"
                      value={newUpload.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select 
                        value={newUpload.subject} 
                        onValueChange={(value) => handleSelectChange('subject', value)}
                      >
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                          <SelectItem value="Biology">Biology</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Economics">Economics</SelectItem>
                          <SelectItem value="Government">Government</SelectItem>
                          <SelectItem value="Literature">Literature</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Material Type</Label>
                      <Select 
                        value={newUpload.type} 
                        onValueChange={(value) => handleSelectChange('type', value)}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ebook">E-Book/Notes</SelectItem>
                          <SelectItem value="past-question">Past Questions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      placeholder="Describe your material"
                      rows={3}
                      value={newUpload.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (in Naira)</Label>
                    <Input 
                      id="price"
                      name="price"
                      type="number"
                      placeholder="e.g., 1000"
                      value={newUpload.price}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="file">Upload File (PDF, DOCX)</Label>
                    <div className="border-2 border-dashed rounded-md p-4 text-center">
                      <Input 
                        id="file"
                        type="file"
                        accept=".pdf,.docx"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Label htmlFor="file" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-sm font-medium">
                            {newUpload.file ? newUpload.file.name : 'Click to select a file'}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            Maximum file size: 10MB
                          </span>
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    onClick={handleUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>Uploading...</>
                    ) : (
                      <>Upload Material</>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {uploads.length === 0 ? (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No uploads yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't uploaded any study materials yet.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Upload Your First Material</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  {/* Upload form (Same as above) */}
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-4">
              {uploads.map((upload) => (
                <Card key={upload.id} className="overflow-hidden transition-all hover:border-primary">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">
                            {upload.type === 'past-question' ? 'Past Questions' : 'E-Book'}
                          </Badge>
                          <Badge variant="outline">{upload.subject}</Badge>
                          {upload.status === 'approved' ? (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                              Approved
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">
                              Pending
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-base">{upload.title}</CardTitle>
                        <CardDescription>{upload.subject}</CardDescription>
                      </div>
                      {upload.type === 'past-question' ? (
                        <FileText className="h-6 w-6 text-primary" />
                      ) : (
                        <Book className="h-6 w-6 text-primary" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-2">{upload.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-muted-foreground">Price:</span> ₦{upload.price.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Downloads:</span> {upload.downloads}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Format:</span> {upload.format}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pages:</span> {upload.pages}
                      </div>
                    </div>
                    {upload.status === 'approved' && (
                      <div className="mt-2 p-2 bg-green-500/10 rounded-md">
                        <p className="text-sm font-medium text-green-700">
                          Total Earnings: ₦{upload.earnings.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-2">
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {upload.status === 'approved' ? (
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        Pending Review
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketplace;
