
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Upload, 
  Users, 
  Settings,
  PlusCircle,
  Search,
  Package,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const uploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  examType: z.string().min(1, 'Please select an exam type'),
  subject: z.string().min(1, 'Please select a subject'),
  year: z.string().min(1, 'Please select a year'),
  price: z.string().min(1, 'Please enter a price'),
  description: z.string().optional(),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

const AdminPanel = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      examType: '',
      subject: '',
      year: '',
      price: '',
      description: '',
    }
  });

  const onSubmit = async (data: UploadFormValues) => {
    if (!file) {
      toast.error('Please upload a PDF file');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      // In a real app, this would be an API call to upload the file and data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Question uploaded successfully!');
      form.reset();
      setFile(null);
    } catch (error) {
      toast.error('Failed to upload question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is PDF
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  // Mock data
  const recentlyUploaded = [
    { id: '1', title: 'WAEC 2023 Mathematics', date: '2023-09-15', downloads: 45 },
    { id: '2', title: 'JAMB Physics 2022-2023', date: '2023-09-10', downloads: 32 },
    { id: '3', title: 'NECO Biology 2023', date: '2023-09-05', downloads: 28 },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="glass-panel p-6 rounded-xl">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Settings className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-medium">Admin Panel</h2>
                <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  variant={activeTab === 'upload' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('upload')}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Questions
                </Button>
                <Button 
                  variant={activeTab === 'manage' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('manage')}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manage Questions
                </Button>
                <Button 
                  variant={activeTab === 'users' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('users')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Button>
                <Button 
                  variant={activeTab === 'settings' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="glass-panel p-6 rounded-xl">
              {activeTab === 'upload' && (
                <>
                  <h2 className="text-2xl font-medium mb-6">Upload Questions</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Question Details</CardTitle>
                        <CardDescription>
                          Enter information about the questions you're uploading
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} id="upload-form" className="space-y-4">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. WAEC Physics 2023" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="examType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Exam Type</FormLabel>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="waec">WAEC</SelectItem>
                                        <SelectItem value="jamb">JAMB</SelectItem>
                                        <SelectItem value="neco">NECO</SelectItem>
                                        <SelectItem value="university">University</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Subject</FormLabel>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="mathematics">Mathematics</SelectItem>
                                        <SelectItem value="english">English</SelectItem>
                                        <SelectItem value="physics">Physics</SelectItem>
                                        <SelectItem value="chemistry">Chemistry</SelectItem>
                                        <SelectItem value="biology">Biology</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Year</FormLabel>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="2023">2023</SelectItem>
                                        <SelectItem value="2022">2022</SelectItem>
                                        <SelectItem value="2021">2021</SelectItem>
                                        <SelectItem value="2020">2020</SelectItem>
                                        <SelectItem value="2019">2019</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Price (₦)</FormLabel>
                                    <FormControl>
                                      <Input type="number" placeholder="e.g. 1500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description (Optional)</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Describe what's included in these questions" 
                                      className="resize-none" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Upload File</CardTitle>
                        <CardDescription>
                          Select the PDF file containing the questions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border-2 border-dashed rounded-lg p-10 text-center">
                          {file ? (
                            <div className="space-y-2">
                              <FileText className="h-10 w-10 mx-auto text-primary" />
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setFile(null)}
                              >
                                Change File
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                              <p className="text-muted-foreground">
                                Drag & drop your PDF file here, or click to browse
                              </p>
                              <Input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="max-w-xs mx-auto"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-6 space-y-2">
                          <p className="text-sm font-medium">Recently Uploaded</p>
                          {recentlyUploaded.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-2 text-sm rounded-md hover:bg-muted/50">
                              <span>{item.title}</span>
                              <span className="text-muted-foreground text-xs">{item.date}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button
                          form="upload-form"
                          type="submit"
                          className="w-full mt-6"
                          disabled={isSubmitting || !file}
                        >
                          {isSubmitting ? 'Uploading...' : 'Upload Question'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
              
              {activeTab === 'manage' && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-medium">Manage Questions</h2>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-8 w-[250px]" placeholder="Search questions..." />
                      </div>
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add New
                      </Button>
                    </div>
                  </div>
                  
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Title</th>
                          <th className="text-left p-3">Exam Type</th>
                          <th className="text-left p-3">Subject</th>
                          <th className="text-left p-3">Year</th>
                          <th className="text-left p-3">Price</th>
                          <th className="text-left p-3">Downloads</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-3">WAEC Mathematics {2023 - i}</td>
                            <td className="p-3">WAEC</td>
                            <td className="p-3">Mathematics</td>
                            <td className="p-3">{2023 - i}</td>
                            <td className="p-3">₦1,500</td>
                            <td className="p-3">{Math.floor(Math.random() * 100)}</td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              
              {activeTab === 'users' && (
                <>
                  <h2 className="text-2xl font-medium mb-6">User Management</h2>
                  <div className="flex gap-4 mb-6">
                    <Card className="flex-1">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-2xl">253</CardTitle>
                        <CardDescription>Total Users</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="flex-1">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-2xl">42</CardTitle>
                        <CardDescription>New This Month</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="flex-1">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-2xl">87%</CardTitle>
                        <CardDescription>Retention Rate</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                  
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Name</th>
                          <th className="text-left p-3">Email</th>
                          <th className="text-left p-3">Joined</th>
                          <th className="text-left p-3">Purchases</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-3">User {i + 1}</td>
                            <td className="p-3">user{i + 1}@example.com</td>
                            <td className="p-3">Sep {i + 1}, 2023</td>
                            <td className="p-3">{Math.floor(Math.random() * 10)}</td>
                            <td className="p-3">
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500">
                                Active
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">View</Button>
                                <Button variant="ghost" size="sm" className="text-destructive">Suspend</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              
              {activeTab === 'settings' && (
                <>
                  <h2 className="text-2xl font-medium mb-6">Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>System Settings</CardTitle>
                        <CardDescription>
                          Configure general system settings
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Default Question Price</label>
                          <Input type="number" placeholder="1500" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Commission Rate (%)</label>
                          <Input type="number" placeholder="10" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Referral Bonus (₦)</label>
                          <Input type="number" placeholder="500" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Save Settings</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Notification Settings</CardTitle>
                        <CardDescription>
                          Configure notifications for your account
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Email Notifications</label>
                          <input type="checkbox" className="toggle" checked />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">SMS Notifications</label>
                          <input type="checkbox" className="toggle" />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">New Question Alerts</label>
                          <input type="checkbox" className="toggle" checked />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Save Settings</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
