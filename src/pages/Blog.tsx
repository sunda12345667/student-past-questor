
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Search, User } from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const blogPosts = [
    {
      id: 1,
      title: 'How to Prepare for WAEC 2024: Complete Study Guide',
      excerpt: 'A comprehensive guide to help students prepare effectively for the West African Examinations Council (WAEC) examinations.',
      content: 'The West African Examinations Council (WAEC) is one of the most important examinations for secondary school students in West Africa. Proper preparation is key to success...',
      author: 'StudyQuest Team',
      date: '2024-05-20',
      readTime: '8 min read',
      category: 'WAEC',
      featured: true
    },
    {
      id: 2,
      title: 'JAMB 2024 Registration: Everything You Need to Know',
      excerpt: 'Latest updates and step-by-step guide for JAMB UTME registration process.',
      content: 'The Joint Admissions and Matriculation Board (JAMB) has announced the commencement of registration for the 2024 Unified Tertiary Matriculation Examination (UTME)...',
      author: 'Education Team',
      date: '2024-05-18',
      readTime: '6 min read',
      category: 'JAMB'
    },
    {
      id: 3,
      title: 'NECO 2024: Important Dates and Exam Timetable',
      excerpt: 'Key dates and examination schedule for the National Examinations Council (NECO) 2024.',
      content: 'The National Examinations Council (NECO) has released the official timetable for the 2024 Senior School Certificate Examination (SSCE)...',
      author: 'StudyQuest Team',
      date: '2024-05-15',
      readTime: '5 min read',
      category: 'NECO'
    },
    {
      id: 4,
      title: 'Study Tips: How to Master Mathematics for Secondary School Exams',
      excerpt: 'Proven strategies and techniques to excel in mathematics examinations.',
      content: 'Mathematics is often considered one of the most challenging subjects by students. However, with the right approach and study techniques...',
      author: 'Mathematics Expert',
      date: '2024-05-12',
      readTime: '10 min read',
      category: 'Study Tips'
    },
    {
      id: 5,
      title: 'English Language: Common Mistakes to Avoid in Exams',
      excerpt: 'Learn about the most common errors students make in English Language exams and how to avoid them.',
      content: 'English Language is a compulsory subject in most Nigerian examinations. Understanding common pitfalls can significantly improve your performance...',
      author: 'Language Expert',
      date: '2024-05-10',
      readTime: '7 min read',
      category: 'English'
    },
    {
      id: 6,
      title: 'University Cut-off Marks 2024: What You Need to Know',
      excerpt: 'Updated list of university admission requirements and cut-off marks for various courses.',
      content: 'University admission is highly competitive in Nigeria. Knowing the cut-off marks for your desired institution and course is crucial...',
      author: 'Admission Guide',
      date: '2024-05-08',
      readTime: '12 min read',
      category: 'Admission'
    }
  ];

  const categories = ['All', 'WAEC', 'JAMB', 'NECO', 'Study Tips', 'English', 'Admission'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Education Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest education news, exam tips, and study guides to help you excel in your academic journey.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && !searchTerm && (
          <Card className="mb-12 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gradient-to-r from-primary/10 to-primary/5 p-8 flex items-center justify-center">
                <div className="text-center">
                  <Badge className="mb-4">Featured</Badge>
                  <h3 className="text-lg font-semibold text-primary">Latest Article</h3>
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="outline">{featuredPost.category}</Badge>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(featuredPost.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    {featuredPost.author}
                  </div>
                  <Button>Read More</Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <Button variant="outline" size="sm">Read More</Button>
                </div>
                <div className="flex items-center mt-3 text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-1" />
                  {post.author}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found matching your search criteria.</p>
          </div>
        )}

        {/* Newsletter Subscription */}
        <Card className="mt-16">
          <CardContent className="text-center p-8">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter to get the latest education news and exam tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Blog;
