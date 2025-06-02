
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Star, Video, Play, FileText, Download, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Enhanced materials with all types
  const allMaterials = [
    // Past Questions
    {
      id: 1,
      title: 'WAEC Mathematics 2023',
      description: 'Complete WAEC Mathematics past questions with detailed solutions and marking scheme.',
      price: '₦1,500',
      category: 'WAEC',
      type: 'past-question',
      year: 2023,
      subject: 'Mathematics',
      questions: 60,
      pages: 45,
      rating: 4.8,
      downloads: 156
    },
    {
      id: 2,
      title: 'JAMB English Language 2022',
      description: 'Comprehensive JAMB English past questions covering all topics with explanations.',
      price: '₦1,200',
      category: 'JAMB',
      type: 'past-question',
      year: 2022,
      subject: 'English Language',
      questions: 80,
      pages: 52,
      rating: 4.9,
      downloads: 203
    },
    // Video Courses
    {
      id: 3,
      title: 'Physics JAMB Complete Course',
      description: 'Comprehensive video course covering all JAMB Physics topics with practical examples.',
      price: '₦4,500',
      category: 'JAMB',
      type: 'video',
      subject: 'Physics',
      duration: '8 hours',
      lessons: 24,
      rating: 4.7,
      instructor: 'Dr. Michael Okafor',
      downloads: 89
    },
    {
      id: 4,
      title: 'Chemistry WAEC Video Tutorials',
      description: 'Step-by-step chemistry tutorials with lab demonstrations and theory explanations.',
      price: '₦3,800',
      category: 'WAEC',
      type: 'video',
      subject: 'Chemistry',
      duration: '6.5 hours',
      lessons: 18,
      rating: 4.6,
      instructor: 'Prof. Sarah Adebayo',
      downloads: 67
    },
    // E-books
    {
      id: 5,
      title: 'Complete WAEC Mathematics Guide',
      description: 'Comprehensive e-book covering all WAEC Mathematics topics with solved examples.',
      price: '₦2,200',
      category: 'WAEC',
      type: 'ebook',
      subject: 'Mathematics',
      pages: 180,
      rating: 4.5,
      author: 'Mathematics Academy',
      downloads: 234
    },
    {
      id: 6,
      title: 'JAMB Government Handbook',
      description: 'Complete guide to JAMB Government with current affairs and practice questions.',
      price: '₦1,800',
      category: 'JAMB',
      type: 'ebook',
      subject: 'Government',
      pages: 156,
      rating: 4.4,
      author: 'Political Science Dept.',
      downloads: 178
    }
  ];

  const categories = ['All', 'WAEC', 'JAMB', 'NECO', 'GCE'];

  const filteredMaterials = allMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || material.category === selectedCategory;
    const matchesType = selectedType === 'All' || 
                       (selectedType === 'Questions' && material.type === 'past-question') ||
                       (selectedType === 'Videos' && material.type === 'video') ||
                       (selectedType === 'Ebooks' && material.type === 'ebook');
    return matchesSearch && matchesCategory && matchesType;
  });

  const handlePurchase = (item: any) => {
    toast.success(`Added ${item.title} to cart! Redirecting to payment...`);
  };

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Educational Marketplace</h2>
        <p className="text-muted-foreground">Browse and purchase past questions, video courses, and e-books</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Questions">Past Questions</SelectItem>
            <SelectItem value="Videos">Video Courses</SelectItem>
            <SelectItem value="Ebooks">E-Books</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {material.type === 'video' && (
              <div className="aspect-video bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center">
                <Play className="h-12 w-12 text-primary" />
              </div>
            )}
            
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={`${getTypeColor(material.type)} flex items-center gap-1`}>
                  {getTypeIcon(material.type)}
                  {getTypeName(material.type)}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                  <span className="text-sm">{material.rating}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mb-2">
                <Badge variant="outline">{material.category}</Badge>
                <Badge variant="secondary">{material.subject}</Badge>
                {material.year && <Badge variant="outline">{material.year}</Badge>}
              </div>
              
              <CardTitle className="text-lg line-clamp-2">{material.title}</CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-2">{material.description}</p>
              
              <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                {material.type === 'past-question' && (
                  <>
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span>{material.questions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pages:</span>
                      <span>{material.pages}</span>
                    </div>
                  </>
                )}
                
                {material.type === 'video' && (
                  <>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{material.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lessons:</span>
                      <span>{material.lessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Instructor:</span>
                      <span className="text-right">{material.instructor}</span>
                    </div>
                  </>
                )}
                
                {material.type === 'ebook' && (
                  <>
                    <div className="flex justify-between">
                      <span>Pages:</span>
                      <span>{material.pages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Author:</span>
                      <span className="text-right">{material.author}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between">
                  <span>Downloads:</span>
                  <span>{material.downloads}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">{material.price}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handlePurchase(material)} size="sm">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Buy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No materials found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
