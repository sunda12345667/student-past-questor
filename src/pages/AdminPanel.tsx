
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, FileText, Video, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const AdminPanel = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Student', joined: '2024-02-20' },
  ]);

  const [blogPosts, setBlogPosts] = useState([
    { id: 1, title: 'How to Prepare for WAEC 2024', content: 'Complete guide...', status: 'Published', date: '2024-05-15' },
    { id: 2, title: 'JAMB Registration Updates', content: 'Latest updates...', status: 'Draft', date: '2024-05-20' },
  ]);

  const [videos, setVideos] = useState([
    { id: 1, title: 'Mathematics WAEC Past Questions', price: '₦2,500', category: 'WAEC', duration: '2:30:00' },
    { id: 2, title: 'English Language JAMB Prep', price: '₦3,000', category: 'JAMB', duration: '1:45:00' },
  ]);

  const [newBlogPost, setNewBlogPost] = useState({ title: '', content: '' });
  const [newVideo, setNewVideo] = useState({ title: '', price: '', category: '', duration: '' });

  const handleAddBlogPost = () => {
    if (!newBlogPost.title || !newBlogPost.content) {
      toast.error('Please fill in all fields');
      return;
    }

    const post = {
      id: Date.now(),
      title: newBlogPost.title,
      content: newBlogPost.content,
      status: 'Published',
      date: new Date().toISOString().split('T')[0]
    };

    setBlogPosts([...blogPosts, post]);
    setNewBlogPost({ title: '', content: '' });
    toast.success('Blog post added successfully');
  };

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.price || !newVideo.category) {
      toast.error('Please fill in all fields');
      return;
    }

    const video = {
      id: Date.now(),
      title: newVideo.title,
      price: newVideo.price,
      category: newVideo.category,
      duration: newVideo.duration || '1:00:00'
    };

    setVideos([...videos, video]);
    setNewVideo({ title: '', price: '', category: '', duration: '' });
    toast.success('Video material added successfully');
  };

  const deleteBlogPost = (id: number) => {
    setBlogPosts(blogPosts.filter(post => post.id !== id));
    toast.success('Blog post deleted');
  };

  const deleteVideo = (id: number) => {
    setVideos(videos.filter(video => video.id !== id));
    toast.success('Video deleted');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage users, content, and platform settings</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{blogPosts.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Video Materials</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{videos.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦125,000</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">Joined: {user.joined}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{user.role}</Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Blog Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Blog post title"
                  value={newBlogPost.title}
                  onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                />
                <Textarea
                  placeholder="Blog post content"
                  value={newBlogPost.content}
                  onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
                  rows={4}
                />
                <Button onClick={handleAddBlogPost} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Blog Post
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">{post.content.substring(0, 100)}...</p>
                        <p className="text-xs text-muted-foreground">Published: {post.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteBlogPost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Video Material</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Video title"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                />
                <Input
                  placeholder="Price (e.g., ₦2,500)"
                  value={newVideo.price}
                  onChange={(e) => setNewVideo({ ...newVideo, price: e.target.value })}
                />
                <Input
                  placeholder="Category (WAEC, JAMB, NECO, etc.)"
                  value={newVideo.category}
                  onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                />
                <Input
                  placeholder="Duration (e.g., 2:30:00)"
                  value={newVideo.duration}
                  onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                />
                <Button onClick={handleAddVideo} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Video Material
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videos.map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">Duration: {video.duration}</p>
                        <p className="text-sm font-medium text-primary">{video.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{video.category}</Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteVideo(video.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Platform Name</label>
                  <Input defaultValue="StudyQuest" />
                </div>
                <div>
                  <label className="text-sm font-medium">Contact Email</label>
                  <Input defaultValue="admin@studyquest.com" />
                </div>
                <div>
                  <label className="text-sm font-medium">Support Phone</label>
                  <Input defaultValue="+234 800 000 0000" />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
