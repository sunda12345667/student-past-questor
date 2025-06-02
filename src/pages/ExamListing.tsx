
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Book, Search, Filter, Bookmark, ShoppingCart, Download, FileText, Video, BookOpen, Star } from 'lucide-react';
import { getAllMaterials, searchMaterials, purchaseMaterial, type Material } from '@/services/materialsService';

const ExamListing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>('all');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);

  // Load materials on component mount
  useEffect(() => {
    const allMaterials = getAllMaterials();
    setMaterials(allMaterials);
    setFilteredMaterials(allMaterials);
  }, []);

  // Filter materials when filters change
  useEffect(() => {
    let filtered = materials;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchMaterials(searchQuery);
    }

    // Apply exam type filter
    if (selectedExamType !== 'all') {
      filtered = filtered.filter(material => material.examType === selectedExamType);
    }

    // Apply material type filter
    if (selectedMaterialType !== 'all') {
      filtered = filtered.filter(material => material.type === selectedMaterialType);
    }

    setFilteredMaterials(filtered);
  }, [searchQuery, selectedExamType, selectedMaterialType, materials]);

  const handlePurchase = async (material: Material) => {
    toast.success(`Processing purchase of ${material.title}...`);
    
    try {
      await purchaseMaterial(material.id);
      // Refresh materials to update download count
      const updatedMaterials = getAllMaterials();
      setMaterials(updatedMaterials);
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    }
  };

  // Get unique exam types for filtering
  const examTypes = Array.from(new Set(materials.map(material => material.examType)));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'past-question': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'ebook': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'past-question': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-red-100 text-red-800';
      case 'ebook': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'past-question': return 'Past Question';
      case 'video': return 'Video Course';
      case 'ebook': return 'E-Book';
      default: return type;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Study Materials & Resources</h1>
          <p className="text-muted-foreground">Discover high-quality past questions, video courses, and e-books</p>
        </div>
        
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
          
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="mr-2 text-sm">Exam:</span>
              <Tabs value={selectedExamType} onValueChange={setSelectedExamType}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  {examTypes.map(type => (
                    <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex items-center">
              <span className="mr-2 text-sm">Type:</span>
              <Tabs value={selectedMaterialType} onValueChange={setSelectedMaterialType}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="past-question">Questions</TabsTrigger>
                  <TabsTrigger value="video">Videos</TabsTrigger>
                  <TabsTrigger value="ebook">E-Books</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {material.type === 'video' && (
                  <div className="aspect-video bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center relative">
                    <Video className="h-12 w-12 text-primary" />
                  </div>
                )}
                
                <CardHeader className="pb-4 relative">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`${getTypeColor(material.type)} flex items-center gap-1`}>
                      {getTypeIcon(material.type)}
                      {getTypeName(material.type)}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {material.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          <span className="text-sm">{material.rating}</span>
                        </div>
                      )}
                      <Button variant="ghost" size="icon">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline">{material.examType}</Badge>
                    <Badge variant="secondary">{material.subject}</Badge>
                    {material.year && <Badge variant="outline">{material.year}</Badge>}
                  </div>
                  
                  <CardTitle className="text-lg">{material.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {material.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-2">
                  <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                    {material.type === 'video' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span>Duration:</span>
                          <span>{material.duration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Lessons:</span>
                          <span>{material.lessons}</span>
                        </div>
                        {material.instructor && (
                          <div className="flex items-center justify-between">
                            <span>Instructor:</span>
                            <span className="text-right text-xs">{material.instructor}</span>
                          </div>
                        )}
                      </>
                    )}
                    
                    {(material.type === 'past-question' || material.type === 'ebook') && (
                      <div className="flex items-center justify-between">
                        <span>Pages:</span>
                        <span>{material.pages}</span>
                      </div>
                    )}
                    
                    {material.type === 'ebook' && material.author && (
                      <div className="flex items-center justify-between">
                        <span>Author:</span>
                        <span className="text-right text-xs">{material.author}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span>Downloads:</span>
                      <span>{material.downloads}</span>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {material.price ? `₦${material.price.toLocaleString()}` : 'Free'}
                    </span>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t pt-4 pb-4">
                  <div className="flex space-x-2 w-full">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate(`/materials/${material.id}`)}
                    >
                      <Book className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => handlePurchase(material)}
                    >
                      {material.price > 0 ? (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Purchase
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
      </div>
    </Layout>
  );
};

export default ExamListing;
