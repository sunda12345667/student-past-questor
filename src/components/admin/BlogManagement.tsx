
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Calendar, User, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  status: 'published' | 'draft';
  readTime: string;
  createdAt: string;
  updatedAt: string;
}

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    status: 'draft' as 'published' | 'draft',
    readTime: ''
  });

  const categories = ['WAEC', 'JAMB', 'NECO', 'Study Tips', 'Education News', 'General'];

  // Load existing blog posts from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with sample posts
      const samplePosts: BlogPost[] = [
        {
          id: '1',
          title: 'How to Prepare for WAEC 2024: Complete Study Guide',
          excerpt: 'A comprehensive guide to help students prepare effectively for the West African Examinations Council (WAEC) examinations.',
          content: 'Complete content for WAEC preparation guide...',
          author: 'StudyQuest Team',
          category: 'WAEC',
          status: 'published',
          readTime: '8 min read',
          createdAt: '2024-05-20',
          updatedAt: '2024-05-20'
        },
        {
          id: '2',
          title: 'JAMB 2024 Registration: Everything You Need to Know',
          excerpt: 'Latest updates and step-by-step guide for JAMB UTME registration process.',
          content: 'Complete content for JAMB registration guide...',
          author: 'Education Team',
          category: 'JAMB',
          status: 'published',
          readTime: '6 min read',
          createdAt: '2024-05-18',
          updatedAt: '2024-05-18'
        }
      ];
      setPosts(samplePosts);
      localStorage.setItem('blogPosts', JSON.stringify(samplePosts));
    }
  }, []);

  const savePosts = (updatedPosts: BlogPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.excerpt || !newPost.content || !newPost.author) {
      toast.error('Please fill in all required fields');
      return;
    }

    const post: BlogPost = {
      id: Date.now().toString(),
      ...newPost,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedPosts = [...posts, post];
    savePosts(updatedPosts);

    // Reset form
    setNewPost({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      status: 'draft',
      readTime: ''
    });

    toast.success('Blog post created successfully');
  };

  const handleUpdatePost = () => {
    if (!isEditing) return;

    const updatedPosts = posts.map(post => 
      post.id === isEditing.id 
        ? { ...isEditing, updatedAt: new Date().toISOString().split('T')[0] }
        : post
    );
    
    savePosts(updatedPosts);
    setIsEditing(null);
    toast.success('Blog post updated successfully');
  };

  const handleDeletePost = (id: string) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    savePosts(updatedPosts);
    toast.success('Blog post deleted successfully');
  };

  return (
    <div className="space-y-6">
      {/* Create/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Post title *"
              value={isEditing ? isEditing.title : newPost.title}
              onChange={(e) => 
                isEditing 
                  ? setIsEditing({ ...isEditing, title: e.target.value })
                  : setNewPost({ ...newPost, title: e.target.value })
              }
            />
            
            <Input
              placeholder="Author name *"
              value={isEditing ? isEditing.author : newPost.author}
              onChange={(e) => 
                isEditing 
                  ? setIsEditing({ ...isEditing, author: e.target.value })
                  : setNewPost({ ...newPost, author: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select 
              value={isEditing ? isEditing.category : newPost.category}
              onValueChange={(value) => 
                isEditing 
                  ? setIsEditing({ ...isEditing, category: value })
                  : setNewPost({ ...newPost, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Category *" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={isEditing ? isEditing.status : newPost.status}
              onValueChange={(value: 'published' | 'draft') => 
                isEditing 
                  ? setIsEditing({ ...isEditing, status: value })
                  : setNewPost({ ...newPost, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Read time (e.g., 5 min read)"
              value={isEditing ? isEditing.readTime : newPost.readTime}
              onChange={(e) => 
                isEditing 
                  ? setIsEditing({ ...isEditing, readTime: e.target.value })
                  : setNewPost({ ...newPost, readTime: e.target.value })
              }
            />
          </div>

          <Textarea
            placeholder="Post excerpt/summary *"
            value={isEditing ? isEditing.excerpt : newPost.excerpt}
            onChange={(e) => 
              isEditing 
                ? setIsEditing({ ...isEditing, excerpt: e.target.value })
                : setNewPost({ ...newPost, excerpt: e.target.value })
            }
            rows={3}
          />

          <Textarea
            placeholder="Post content *"
            value={isEditing ? isEditing.content : newPost.content}
            onChange={(e) => 
              isEditing 
                ? setIsEditing({ ...isEditing, content: e.target.value })
                : setNewPost({ ...newPost, content: e.target.value })
            }
            rows={10}
          />

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleUpdatePost} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Update Post
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(null)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleCreatePost} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Post
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                      <Badge variant="outline">{post.category}</Badge>
                      {post.readTime && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {post.readTime}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{post.excerpt}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span className="font-medium">Author:</span> {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Created:</span> {post.createdAt}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Updated:</span> {post.updatedAt}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {posts.length === 0 && (
              <div className="text-center py-12">
                <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No blog posts yet</h3>
                <p className="text-muted-foreground">Create your first blog post to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagement;
