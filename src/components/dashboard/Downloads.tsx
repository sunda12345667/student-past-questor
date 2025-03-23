
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
  Download, 
  FileText, 
  Book, 
  Search, 
  Calendar, 
  Share, 
  FileBarChart,
  FileBar,
  EyeOff
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

// Mock data for downloaded materials
const downloadedMaterials = [
  {
    id: '1',
    title: 'WAEC 2023 Mathematics',
    type: 'past-question',
    subject: 'Mathematics',
    format: 'PDF',
    fileSize: '2.5 MB',
    downloadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    progress: 100,
    lastOpened: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
  },
  {
    id: '2',
    title: 'English Language Study Guide',
    type: 'ebook',
    subject: 'English',
    format: 'PDF',
    fileSize: '4.2 MB',
    downloadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    progress: 45,
    lastOpened: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  {
    id: '3',
    title: 'JAMB Physics 2022-2023',
    type: 'past-question',
    subject: 'Physics',
    format: 'PDF',
    fileSize: '3.1 MB',
    downloadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    progress: 75,
    lastOpened: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
  },
  {
    id: '4',
    title: 'Chemistry Practical Guide',
    type: 'ebook',
    subject: 'Chemistry',
    format: 'PDF',
    fileSize: '5.8 MB',
    downloadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    progress: 30,
    lastOpened: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
  }
];

const Downloads = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState(downloadedMaterials);
  
  // Filter materials based on search criteria
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = searchQuery === '' || 
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesSearch;
  });
  
  const handleOpen = (material: any) => {
    // In a real app, this would open the file
    toast({
      title: "Opening file",
      description: `Opening ${material.title}`,
    });
  };
  
  const handleShareMaterial = (material: any) => {
    toast({
      title: "Share feature",
      description: "Sharing functionality coming soon.",
    });
  };
  
  const handleDeleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(material => material.id !== id));
    
    toast({
      title: "File deleted",
      description: "The file has been removed from your downloads.",
    });
  };
  
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium">My Downloads</h2>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search your downloads..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{materials.length}</div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {(materials.reduce((total, material) => {
                  return total + parseFloat(material.fileSize.split(' ')[0]);
                }, 0)).toFixed(1)} MB
              </div>
              <FileBarChart className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Reading Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold">
                {Math.round(materials.reduce((total, material) => {
                  return total + material.progress;
                }, 0) / materials.length)}%
              </div>
              <FileBar className="h-8 w-8 text-primary" />
            </div>
            <Progress 
              value={materials.reduce((total, material) => {
                return total + material.progress;
              }, 0) / materials.length}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Downloads List */}
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Downloads</TabsTrigger>
          <TabsTrigger value="books">E-Books</TabsTrigger>
          <TabsTrigger value="questions">Past Questions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-8">
              <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No downloads found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try a different search term' : 'You have not downloaded any materials yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="overflow-hidden transition-all hover:border-primary">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {material.type === 'past-question' ? 'Past Questions' : 'E-Book'}
                          </Badge>
                          <Badge variant="outline">{material.subject}</Badge>
                        </div>
                        <CardTitle className="text-base mt-1">{material.title}</CardTitle>
                        <CardDescription>Downloaded on {format(material.downloadDate, 'PPP')}</CardDescription>
                      </div>
                      {material.type === 'past-question' ? (
                        <FileText className="h-6 w-6 text-primary" />
                      ) : (
                        <Book className="h-6 w-6 text-primary" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Format:</span> {material.format}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span> {material.fileSize}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last opened:</span> {format(material.lastOpened, 'PP')}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Progress:</span> {material.progress}%
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Reading Progress</span>
                        <span>{material.progress}%</span>
                      </div>
                      <Progress 
                        value={material.progress} 
                        className={getProgressColor(material.progress)} 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleOpen(material)}
                      className="w-full"
                    >
                      Open
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleShareMaterial(material)}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleDeleteMaterial(material.id)}
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="books">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredMaterials
              .filter(material => material.type === 'ebook')
              .map((material) => (
                // Same card structure as above
                <Card key={material.id} className="overflow-hidden transition-all hover:border-primary">
                  {/* Card content (same as above) */}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">E-Book</Badge>
                          <Badge variant="outline">{material.subject}</Badge>
                        </div>
                        <CardTitle className="text-base mt-1">{material.title}</CardTitle>
                        <CardDescription>Downloaded on {format(material.downloadDate, 'PPP')}</CardDescription>
                      </div>
                      <Book className="h-6 w-6 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Format:</span> {material.format}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span> {material.fileSize}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last opened:</span> {format(material.lastOpened, 'PP')}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Progress:</span> {material.progress}%
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Reading Progress</span>
                        <span>{material.progress}%</span>
                      </div>
                      <Progress 
                        value={material.progress} 
                        className={getProgressColor(material.progress)} 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleOpen(material)}
                      className="w-full"
                    >
                      Open
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleShareMaterial(material)}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleDeleteMaterial(material.id)}
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="questions">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredMaterials
              .filter(material => material.type === 'past-question')
              .map((material) => (
                // Same card structure as above
                <Card key={material.id} className="overflow-hidden transition-all hover:border-primary">
                  {/* Card content (same as above) */}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Past Questions</Badge>
                          <Badge variant="outline">{material.subject}</Badge>
                        </div>
                        <CardTitle className="text-base mt-1">{material.title}</CardTitle>
                        <CardDescription>Downloaded on {format(material.downloadDate, 'PPP')}</CardDescription>
                      </div>
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Format:</span> {material.format}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span> {material.fileSize}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last opened:</span> {format(material.lastOpened, 'PP')}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Progress:</span> {material.progress}%
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Reading Progress</span>
                        <span>{material.progress}%</span>
                      </div>
                      <Progress 
                        value={material.progress} 
                        className={getProgressColor(material.progress)} 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleOpen(material)}
                      className="w-full"
                    >
                      Open
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleShareMaterial(material)}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleDeleteMaterial(material.id)}
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Downloads;
