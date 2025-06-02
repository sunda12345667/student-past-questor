import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Star, Video, Play } from 'lucide-react';
import { toast } from 'sonner';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const questionPacks = [
    {
      id: 1,
      title: 'WAEC 2020 Past Questions',
      description: 'Comprehensive WAEC past questions for all subjects in 2020.',
      price: '₦1,500',
      category: 'WAEC',
      year: 2020,
      questions: 500,
      pages: 120
    },
    {
      id: 2,
      title: 'JAMB 2021 Past Questions',
      description: 'Detailed JAMB past questions for all subjects in 2021.',
      price: '₦1,800',
      category: 'JAMB',
      year: 2021,
      questions: 600,
      pages: 150
    },
    {
      id: 3,
      title: 'NECO 2019 Past Questions',
      description: 'Complete NECO past questions for all subjects in 2019.',
      price: '₦1,200',
      category: 'NECO',
      year: 2019,
      questions: 450,
      pages: 110
    },
    {
      id: 4,
      title: 'GCE 2022 Past Questions',
      description: 'Extensive GCE past questions for all subjects in 2022.',
      price: '₦2,000',
      category: 'GCE',
      year: 2022,
      questions: 700,
      pages: 180
    }
  ];

  const videoMaterials = [
    {
      id: 1,
      title: 'Mathematics WAEC Complete Video Course',
      description: 'Comprehensive video tutorials covering all WAEC Mathematics topics with solved examples.',
      price: '₦3,500',
      category: 'WAEC',
      duration: '8 hours',
      lessons: 24,
      rating: 4.8,
      instructor: 'Dr. John Adebayo'
    },
    {
      id: 2,
      title: 'English Language JAMB Preparation Videos',
      description: 'Complete English Language preparation course for JAMB with grammar, comprehension, and essay writing.',
      price: '₦4,000',
      category: 'JAMB',
      duration: '6 hours',
      lessons: 18,
      rating: 4.9,
      instructor: 'Prof. Sarah Johnson'
    },
    {
      id: 3,
      title: 'Physics NECO Video Tutorials',
      description: 'In-depth Physics video course covering mechanics, electricity, and modern physics for NECO.',
      price: '₦4,500',
      category: 'NECO',
      duration: '10 hours',
      lessons: 30,
      rating: 4.7,
      instructor: 'Dr. Michael Okafor'
    },
    {
      id: 4,
      title: 'Chemistry GCE Video Course',
      description: 'Complete Chemistry course with practical demonstrations and theory explanations.',
      price: '₦4,200',
      category: 'GCE',
      duration: '9 hours',
      lessons: 27,
      rating: 4.6,
      instructor: 'Dr. Fatima Ahmed'
    }
  ];

  const categories = ['All', 'WAEC', 'JAMB', 'NECO', 'GCE'];

  const filteredQuestionPacks = questionPacks.filter(pack => {
    const matchesSearch = pack.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || pack.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredVideoMaterials = videoMaterials.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePurchase = (item: any, type: string) => {
    toast.success(`Added ${item.title} to cart! Redirecting to payment...`);
    // In a real app, this would integrate with the payment system
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Marketplace</h2>
        <p className="text-muted-foreground">Browse and purchase study materials and video courses</p>
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
            <SelectItem value="Questions">Question Packs</SelectItem>
            <SelectItem value="Videos">Video Courses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content based on selected type */}
      {(selectedType === 'All' || selectedType === 'Videos') && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Courses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredVideoMaterials.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center">
                  <Play className="h-12 w-12 text-primary" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{video.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      <span className="text-sm">{video.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{video.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{video.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Lessons:</span>
                      <span>{video.lessons}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Instructor:</span>
                      <span>{video.instructor}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{video.price}</span>
                    <Button onClick={() => handlePurchase(video, 'video')}>
                      Purchase
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(selectedType === 'All' || selectedType === 'Questions') && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Question Packs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestionPacks.map((pack) => (
              <Card key={pack.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{pack.category}</Badge>
                    <span className="text-sm text-muted-foreground">{pack.year}</span>
                  </div>
                  <CardTitle className="text-lg">{pack.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{pack.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      {pack.questions} questions
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {pack.pages} pages
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{pack.price}</span>
                    <Button onClick={() => handlePurchase(pack, 'questions')}>
                      Purchase
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {((selectedType === 'Questions' && filteredQuestionPacks.length === 0) || 
        (selectedType === 'Videos' && filteredVideoMaterials.length === 0) ||
        (selectedType === 'All' && filteredQuestionPacks.length === 0 && filteredVideoMaterials.length === 0)) && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No materials found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
