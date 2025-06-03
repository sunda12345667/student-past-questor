import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Users, FileText, Video, DollarSign, Upload, Save, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import MaterialUpload from '@/components/admin/MaterialUpload';

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Student', joined: '2024-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Teacher', joined: '2024-03-10' },
  ]);

  const [blogPosts, setBlogPosts] = useState([
    { 
      id: 1, 
      title: 'How to Prepare for WAEC 2024: Complete Study Guide', 
      content: 'A comprehensive guide to help students prepare effectively for the West African Examinations Council (WAEC) examinations...', 
      excerpt: 'A comprehensive guide to help students prepare effectively for WAEC examinations.',
      status: 'Published', 
      date: '2024-05-15',
      category: 'WAEC',
      author: 'StudyQuest Team'
    },
    { 
      id: 2, 
      title: 'JAMB Registration Updates', 
      content: 'Latest updates and step-by-step guide for JAMB UTME registration process...', 
      excerpt: 'Latest updates and step-by-step guide for JAMB UTME registration process.',
      status: 'Draft', 
      date: '2024-05-20',
      category: 'JAMB',
      author: 'Education Team'
    },
  ]);

  const [videos, setVideos] = useState([
    { id: 1, title: 'Mathematics WAEC Past Questions', price: '₦2,500', category: 'WAEC', duration: '2:30:00', description: 'Comprehensive mathematics past questions and solutions' },
    { id: 2, title: 'English Language JAMB Prep', price: '₦3,000', category: 'JAMB', duration: '1:45:00', description: 'Complete English language preparation for JAMB' },
    { id: 3, title: 'Physics NECO Complete Guide', price: '₦2,800', category: 'NECO', duration: '3:15:00', description: 'Complete physics guide for NECO examinations' },
  ]);

  const [newBlogPost, setNewBlogPost] = useState({ 
    title: '', 
    content: '', 
    excerpt: '', 
    category: '', 
    author: 'StudyQuest Team' 
  });
  
  const [newVideo, setNewVideo] = useState({ 
    title: '', 
    price: '', 
    category: '', 
    duration: '', 
    description: '' 
  });

  const [editingPost, setEditingPost] = useState<any>(null);
  const [editingVideo, setEditingVideo] = useState<any>(null);

  const blogCategories = ['WAEC', 'JAMB', 'NECO', 'Study Tips', 'English', 'Mathematics', 'Science', 'Admission'];

  const handleAddBlogPost = () => {
    if (!newBlogPost.title || !newBlogPost.content || !newBlogPost.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const post = {
      id: Date.now(),
      title: newBlogPost.title,
      content: newBlogPost.content,
      excerpt: newBlogPost.excerpt || newBlogPost.content.substring(0, 150) + '...',
      status: 'Published',
      date: new Date().toISOString().split('T')[0],
      category: newBlogPost.category,
      author: newBlogPost.author
    };

    setBlogPosts([...blogPosts, post]);
    setNewBlogPost({ title: '', content: '', excerpt: '', category: '', author: 'StudyQuest Team' });
    toast.success('Blog post published successfully');
  };

  const handleUpdateBlogPost = () => {
    if (!editingPost) return;

    setBlogPosts(blogPosts.map(post => 
      post.id === editingPost.id ? editingPost : post
    ));
    setEditingPost(null);
    toast.success('Blog post updated successfully');
  };

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.price || !newVideo.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const video = {
      id: Date.now(),
      title: newVideo.title,
      price: newVideo.price,
      category: newVideo.category,
      duration: newVideo.duration || '1:00:00',
      description: newVideo.description
    };

    setVideos([...videos, video]);
    setNewVideo({ title: '', price: '', category: '', duration: '', description: '' });
    toast.success('Video material added successfully');
  };

  const handleUpdateVideo = () => {
    if (!editingVideo) return;

    setVideos(videos.map(video => 
      video.id === editingVideo.id ? editingVideo : video
    ));
    setEditingVideo(null);
    toast.success('Video updated successfully');
  };

  const deleteBlogPost = (id: number) => {
    setBlogPosts(blogPosts.filter(post => post.id !== id));
    toast.success('Blog post deleted');
  };

  const deleteVideo = (id: number) => {
    setVideos(videos.filter(video => video.id !== id));
    toast.success('Video deleted');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file upload
      toast.success(`File "${file.name}" uploaded successfully`);
    }
  };

  const handleLogin = (password: string) => {
    if (password === 'admin123') {
      setIsLoggedIn(true);
      toast.success('Welcome to iRapid Admin Panel');
    } else {
      toast.error('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (currentPassword !== 'admin123') {
      toast.error('Current password is incorrect');
      return;
    }
    toast.success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePrintBulk = (provider: string) => {
    // Generate bulk print layout
    const printWindow = window.open('', '_blank');
    const logoUrl = provider === 'MTN' ? '/mtn-logo.png' : 
                   provider === 'GLO' ? '/glo-logo.png' : 
                   provider === 'AIRTEL' ? '/airtel-logo.png' : '/9mobile-logo.png';
    
    const printContent = `
      <html>
        <head>
          <title>Bulk ${provider} Cards - iRapid</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .card { border: 1px solid #ccc; margin: 10px; padding: 15px; display: inline-block; width: 200px; }
            .logo { width: 50px; height: 50px; }
            .provider { font-weight: bold; color: ${provider === 'MTN' ? '#ffcc00' : provider === 'GLO' ? '#00a651' : '#e60000'}; }
          </style>
        </head>
        <body>
          <h2>Bulk ${provider} Recharge Cards - iRapid</h2>
          ${Array(20).fill(0).map((_, i) => `
            <div class="card">
              <img src="${logoUrl}" alt="${provider}" class="logo" />
              <div class="provider">${provider}</div>
              <div>₦1000</div>
              <div>PIN: ${Math.random().toString().substr(2, 16)}</div>
              <div>Serial: ${provider}${Date.now() + i}</div>
            </div>
          `).join('')}
        </body>
      </html>
    `;
    
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container mx-auto px-4 pt-28 pb-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>iRapid Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="password"
                placeholder="Enter admin password"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin(e.currentTarget.value);
                  }
                }}
              />
              <Button 
                className="w-full mt-4" 
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                  handleLogin(input.value);
                }}
              >
                Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">iRapid Admin Panel</h1>
            <p className="text-muted-foreground">Manage platform content and settings</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Print</TabsTrigger>
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
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{blogPosts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {blogPosts.filter(p => p.status === 'Published').length} published
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Video Materials</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{videos.length}</div>
                  <p className="text-xs text-muted-foreground">Across all categories</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦125,000</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {blogPosts.slice(0, 3).map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{post.title}</p>
                          <p className="text-xs text-muted-foreground">{post.date}</p>
                        </div>
                        <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {videos.slice(0, 3).map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{video.title}</p>
                          <p className="text-xs text-muted-foreground">{video.category}</p>
                        </div>
                        <span className="text-sm font-medium text-primary">{video.price}</span>
                      </div>
                    ))}
                  </div>
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

          <TabsContent value="materials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Study Materials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Material title" />
                  <Input placeholder="Price (₦)" type="number" />
                  <Input placeholder="School/Institution" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea placeholder="Material description" />
                <Input type="file" accept=".pdf,.doc,.docx" />
                <Button className="w-full">Upload Material</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            {/* Add/Edit Blog Post Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Blog post title"
                  value={editingPost ? editingPost.title : newBlogPost.title}
                  onChange={(e) => 
                    editingPost 
                      ? setEditingPost({ ...editingPost, title: e.target.value })
                      : setNewBlogPost({ ...newBlogPost, title: e.target.value })
                  }
                />
                
                <Select 
                  value={editingPost ? editingPost.category : newBlogPost.category}
                  onValueChange={(value) => 
                    editingPost 
                      ? setEditingPost({ ...editingPost, category: value })
                      : setNewBlogPost({ ...newBlogPost, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {blogCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Short excerpt (optional)"
                  value={editingPost ? editingPost.excerpt : newBlogPost.excerpt}
                  onChange={(e) => 
                    editingPost 
                      ? setEditingPost({ ...editingPost, excerpt: e.target.value })
                      : setNewBlogPost({ ...newBlogPost, excerpt: e.target.value })
                  }
                  rows={2}
                />
                
                <Textarea
                  placeholder="Blog post content"
                  value={editingPost ? editingPost.content : newBlogPost.content}
                  onChange={(e) => 
                    editingPost 
                      ? setEditingPost({ ...editingPost, content: e.target.value })
                      : setNewBlogPost({ ...newBlogPost, content: e.target.value })
                  }
                  rows={8}
                />

                <Input
                  placeholder="Author name"
                  value={editingPost ? editingPost.author : newBlogPost.author}
                  onChange={(e) => 
                    editingPost 
                      ? setEditingPost({ ...editingPost, author: e.target.value })
                      : setNewBlogPost({ ...newBlogPost, author: e.target.value })
                  }
                />

                <div className="flex items-center gap-4">
                  <div>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </span>
                      </Button>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    {editingPost ? (
                      <>
                        <Button onClick={handleUpdateBlogPost} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Update Post
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingPost(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleAddBlogPost} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Publish Post
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blog Posts List */}
            <Card>
              <CardHeader>
                <CardTitle>Published Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>By {post.author}</span>
                          <span>Published: {post.date}</span>
                          <Badge variant="outline">{post.category}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingPost(post)}
                        >
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

          <TabsContent value="bulk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Recharge Card Printing</CardTitle>
                <CardDescription>Print bulk recharge cards for resellers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['MTN', 'GLO', 'AIRTEL', '9MOBILE'].map((provider) => (
                    <Button
                      key={provider}
                      variant="outline"
                      onClick={() => handlePrintBulk(provider)}
                      className="h-20 flex flex-col gap-2"
                    >
                      <span className="font-bold">{provider}</span>
                      <span className="text-sm">Print Bulk Cards</span>
                    </Button>
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
                  <Input defaultValue="iRapid" />
                </div>
                <div>
                  <label className="text-sm font-medium">Contact Email</label>
                  <Input defaultValue="admin@irapid.com" />
                </div>
                <div>
                  <label className="text-sm font-medium">Support Phone</label>
                  <Input defaultValue="+234 706 299 6474" />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button onClick={handlePasswordChange}>Change Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
