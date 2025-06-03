import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Upload,
  Eye,
  Trash2,
  Edit,
  LogOut,
  Key
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Question {
  id: string;
  title: string;
  subject: string;
  examType: string;
  year: string;
  status: string;
}

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  status: string;
  date: string;
}

const AdminPanel = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  
  // Mock data for demonstration
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', createdAt: '2023-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', createdAt: '2023-02-20' },
    { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: '2022-12-01' },
  ]);
  
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', title: 'Calculus Integration Problem', subject: 'Mathematics', examType: 'WAEC', year: '2022', status: 'published' },
    { id: '2', title: 'Newton\'s Laws of Motion', subject: 'Physics', examType: 'JAMB', year: '2023', status: 'published' },
    { id: '3', title: 'Organic Chemistry Compounds', subject: 'Chemistry', examType: 'NECO', year: '2021', status: 'draft' },
  ]);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', userId: '1', amount: 2500, type: 'purchase', status: 'completed', date: '2023-05-15' },
    { id: '2', userId: '2', amount: 1000, type: 'wallet_funding', status: 'completed', date: '2023-05-16' },
    { id: '3', userId: '1', amount: 500, type: 'bill_payment', status: 'completed', date: '2023-05-17' },
  ]);
  
  // Form states
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    subject: '',
    examType: '',
    year: '',
    content: '',
    file: null as File | null,
  });
  
  useEffect(() => {
    // Check if user is admin, if not redirect to home
    if (!isAdmin()) {
      navigate('/');
      toast.error('You do not have permission to access the admin panel');
    }
  }, [isAdmin, navigate]);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle question submission logic here
    toast.success('Question added successfully!');
    setNewQuestion({
      title: '',
      subject: '',
      examType: '',
      year: '',
      content: '',
      file: null,
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewQuestion({
        ...newQuestion,
        file: e.target.files[0],
      });
    }
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success('User deleted successfully');
  };
  
  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(question => question.id !== questionId));
    toast.success('Question deleted successfully');
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 gap-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts, roles, and permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium">Name</th>
                      <th className="p-2 text-left font-medium">Email</th>
                      <th className="p-2 text-left font-medium">Role</th>
                      <th className="p-2 text-left font-medium">Status</th>
                      <th className="p-2 text-left font-medium">Joined</th>
                      <th className="p-2 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-2">{user.name}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-2">{user.createdAt}</td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Question</CardTitle>
                <CardDescription>Upload new exam questions to the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleQuestionSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Question Title</Label>
                    <Input 
                      id="title" 
                      value={newQuestion.title}
                      onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                      placeholder="Enter question title"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select 
                        value={newQuestion.subject}
                        onValueChange={(value) => setNewQuestion({...newQuestion, subject: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="biology">Biology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="examType">Exam Type</Label>
                      <Select 
                        value={newQuestion.examType}
                        onValueChange={(value) => setNewQuestion({...newQuestion, examType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select exam" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="waec">WAEC</SelectItem>
                          <SelectItem value="jamb">JAMB</SelectItem>
                          <SelectItem value="neco">NECO</SelectItem>
                          <SelectItem value="gce">GCE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select 
                      value={newQuestion.year}
                      onValueChange={(value) => setNewQuestion({...newQuestion, year: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                        <SelectItem value="2019">2019</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Question Content</Label>
                    <Textarea 
                      id="content" 
                      value={newQuestion.content}
                      onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                      placeholder="Enter question content"
                      rows={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="file">Upload File (PDF, Image)</Label>
                    <Input 
                      id="file" 
                      type="file" 
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Question
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Manage Questions</CardTitle>
                <CardDescription>View and manage existing questions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Title</th>
                        <th className="p-2 text-left font-medium">Subject</th>
                        <th className="p-2 text-left font-medium">Exam</th>
                        <th className="p-2 text-left font-medium">Year</th>
                        <th className="p-2 text-left font-medium">Status</th>
                        <th className="p-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((question) => (
                        <tr key={question.id} className="border-b">
                          <td className="p-2">{question.title}</td>
                          <td className="p-2">{question.subject}</td>
                          <td className="p-2">{question.examType}</td>
                          <td className="p-2">{question.year}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              question.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {question.status}
                            </span>
                          </td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and manage payment transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium">Transaction ID</th>
                      <th className="p-2 text-left font-medium">User ID</th>
                      <th className="p-2 text-left font-medium">Amount</th>
                      <th className="p-2 text-left font-medium">Type</th>
                      <th className="p-2 text-left font-medium">Status</th>
                      <th className="p-2 text-left font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="p-2">{transaction.id}</td>
                        <td className="p-2">{transaction.userId}</td>
                        <td className="p-2">₦{transaction.amount.toLocaleString()}</td>
                        <td className="p-2">
                          <span className="capitalize">{transaction.type.replace('_', ' ')}</span>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="p-2">{transaction.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>View platform usage and performance metrics.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₦2,345,670</div>
                    <p className="text-xs text-muted-foreground">+8% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">567</div>
                    <p className="text-xs text-muted-foreground">+15% from last month</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Monthly Revenue</h3>
                <div className="h-[300px] bg-muted/20 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Chart placeholder - Revenue data visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure platform settings and security options.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Require admins to use 2FA</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Configure
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Password Policy</h4>
                        <p className="text-sm text-muted-foreground">Set password requirements</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Payment Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Payment Gateways</h4>
                        <p className="text-sm text-muted-foreground">Configure payment providers</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Transaction Fees</h4>
                        <p className="text-sm text-muted-foreground">Set platform transaction fees</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Content Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Content Moderation</h4>
                        <p className="text-sm text-muted-foreground">Configure content review process</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">File Upload Limits</h4>
                        <p className="text-sm text-muted-foreground">Set maximum file sizes</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
