
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, BookOpen, FileText, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Material card component
const MaterialCard = ({ material }: { material: any }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <CardTitle className="text-lg font-medium">{material.title}</CardTitle>
          <Badge variant={material.price > 0 ? "default" : "secondary"}>
            {material.price > 0 ? `₦${material.price}` : "Free"}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>{material.subject}</span>
          <span className="mx-2">•</span>
          <span>{material.type}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {material.description || "No description provided."}
        </p>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 mr-1" />
          <span>{material.downloads} downloads</span>
        </div>
        <Button variant="outline" size="sm">View Details</Button>
      </CardFooter>
    </Card>
  );
};

const SearchMaterials: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [materialType, setMaterialType] = useState('all');
  const [subject, setSubject] = useState('all');

  // Fetch study materials
  const { data: materials, isLoading } = useQuery({
    queryKey: ['study-materials', searchQuery, materialType, subject],
    queryFn: async () => {
      try {
        let query = supabase.from('study_materials').select('*');
        
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }
        
        if (materialType !== 'all') {
          query = query.eq('type', materialType);
        }
        
        if (subject !== 'all') {
          query = query.eq('subject', subject);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching materials:', error);
        toast.error('Failed to load study materials');
        return [];
      }
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is handled by the query hook
  };

  // Filter options
  const subjectOptions = [
    'Mathematics', 
    'Physics', 
    'Chemistry', 
    'Biology', 
    'English', 
    'Economics',
    'History',
    'Computer Science'
  ];

  const typeOptions = [
    'Past Questions',
    'Textbook',
    'Note',
    'Video',
    'Tutorial'
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Search Study Materials</h1>

      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for study materials..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <Tabs defaultValue="all" onValueChange={setMaterialType}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Types</TabsTrigger>
            <TabsTrigger value="Past Questions">Questions</TabsTrigger>
            <TabsTrigger value="Textbook">Books</TabsTrigger>
            <TabsTrigger value="Note">Notes</TabsTrigger>
            <TabsTrigger value="Video">Videos</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <select 
              className="bg-transparent text-sm border-none focus:outline-none focus:ring-0"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="all">All Subjects</option>
              {subjectOptions.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-[200px] animate-pulse">
                  <div className="h-full bg-muted/30"></div>
                </Card>
              ))}
            </div>
          ) : materials && materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No study materials found</h3>
              <p className="text-muted-foreground">
                Try changing your search terms or filters
              </p>
            </div>
          )}
        </TabsContent>
        
        {typeOptions.map(type => (
          <TabsContent key={type} value={type} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="h-[200px] animate-pulse">
                    <div className="h-full bg-muted/30"></div>
                  </Card>
                ))}
              </div>
            ) : materials?.filter(m => m.type === type).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.filter(m => m.type === type).map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No {type.toLowerCase()} found</h3>
                <p className="text-muted-foreground">
                  Try changing your search or filters
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SearchMaterials;
