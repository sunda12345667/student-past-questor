
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Book, File, ExternalLink, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const Downloads = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("past-questions");
  
  const pastQuestions = [
    {
      id: "pq1",
      title: "WAEC Mathematics 2023",
      format: "PDF",
      size: "2.4 MB",
      date: "July 15, 2023",
      progress: 100,
      subject: "Mathematics"
    },
    {
      id: "pq2",
      title: "JAMB Physics Past Questions (2018-2022)",
      format: "PDF",
      size: "5.7 MB",
      date: "August 3, 2023",
      progress: 100,
      subject: "Physics"
    },
    {
      id: "pq3",
      title: "NECO Chemistry Objective Questions",
      format: "PDF",
      size: "3.2 MB",
      date: "August 10, 2023",
      progress: 35,
      subject: "Chemistry"
    }
  ];
  
  const ebooks = [
    {
      id: "eb1",
      title: "Complete Guide to Calculus",
      format: "PDF",
      size: "8.3 MB",
      date: "June 28, 2023",
      progress: 100,
      subject: "Mathematics"
    },
    {
      id: "eb2",
      title: "English Grammar and Composition",
      format: "EPUB",
      size: "4.1 MB",
      date: "July 22, 2023",
      progress: 70,
      subject: "English"
    }
  ];
  
  const filteredPastQuestions = pastQuestions.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredEbooks = ebooks.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">My Downloads</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search downloads..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="past-questions" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="past-questions">Past Questions</TabsTrigger>
          <TabsTrigger value="ebooks">E-Books</TabsTrigger>
        </TabsList>
        
        <TabsContent value="past-questions" className="space-y-4 mt-6">
          {filteredPastQuestions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No past questions found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No results match your search criteria." : "You haven't downloaded any past questions yet."}
              </p>
              <Button onClick={() => setSearchQuery("")}>
                {searchQuery ? "Clear Search" : "Browse Marketplace"}
              </Button>
            </div>
          ) : (
            <>
              {filteredPastQuestions.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>
                          {item.subject} • {item.format} • {item.size}
                        </CardDescription>
                      </div>
                      <File className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Download Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      Downloaded on {item.date}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex gap-2">
                    {item.progress === 100 ? (
                      <>
                        <Button className="flex-1" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </>
                    ) : (
                      <Button className="w-full" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Resume Download
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="ebooks" className="space-y-4 mt-6">
          {filteredEbooks.length === 0 ? (
            <div className="text-center py-8">
              <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No e-books found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No results match your search criteria." : "You haven't downloaded any e-books yet."}
              </p>
              <Button onClick={() => setSearchQuery("")}>
                {searchQuery ? "Clear Search" : "Browse Marketplace"}
              </Button>
            </div>
          ) : (
            <>
              {filteredEbooks.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>
                          {item.subject} • {item.format} • {item.size}
                        </CardDescription>
                      </div>
                      <Book className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Download Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      Downloaded on {item.date}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex gap-2">
                    {item.progress === 100 ? (
                      <>
                        <Button className="flex-1" size="sm">
                          <Book className="h-4 w-4 mr-2" />
                          Read
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </>
                    ) : (
                      <Button className="w-full" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Resume Download
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Downloads;
