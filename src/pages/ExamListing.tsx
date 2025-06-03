
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Star, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserWallet, debitWallet } from '@/services/walletService';
import { initializePayment } from '@/services/paystackService';

interface QuestionPack {
  id: string;
  title: string;
  examType: string;
  subject: string;
  year: number;
  price: number;
  questions: number;
  downloads: number;
  rating: number;
  preview: string;
  description: string;
}

const ExamListing = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [purchasedPacks, setPurchasedPacks] = useState<string[]>([]);
  const [loadingPurchase, setLoadingPurchase] = useState<string | null>(null);

  const questionPacks: QuestionPack[] = [
    {
      id: '1',
      title: 'WAEC Mathematics 2023 Complete Pack',
      examType: 'WAEC',
      subject: 'Mathematics',
      year: 2023,
      price: 1500,
      questions: 50,
      downloads: 1247,
      rating: 4.8,
      preview: 'Sample questions on algebra, geometry, and calculus...',
      description: 'Complete collection of WAEC Mathematics questions with detailed solutions'
    },
    {
      id: '2',
      title: 'JAMB Physics 2023 Questions',
      examType: 'JAMB',
      subject: 'Physics',
      year: 2023,
      price: 2000,
      questions: 60,
      downloads: 890,
      rating: 4.7,
      preview: 'Questions covering mechanics, electricity, and waves...',
      description: 'Comprehensive JAMB Physics questions with explanations'
    },
    {
      id: '3',
      title: 'NECO English 2023 Pack',
      examType: 'NECO',
      subject: 'English',
      year: 2023,
      price: 1200,
      questions: 40,
      downloads: 765,
      rating: 4.6,
      preview: 'Grammar, comprehension, and essay questions...',
      description: 'Complete NECO English questions with model answers'
    },
    {
      id: '4',
      title: 'WAEC Chemistry 2023 Complete',
      examType: 'WAEC',
      subject: 'Chemistry',
      year: 2023,
      price: 1800,
      questions: 55,
      downloads: 623,
      rating: 4.9,
      preview: 'Organic, inorganic, and physical chemistry questions...',
      description: 'Detailed chemistry questions with step-by-step solutions'
    }
  ];

  const handlePurchase = async (pack: QuestionPack) => {
    if (!currentUser) {
      toast.error('Please log in to purchase questions');
      navigate('/auth');
      return;
    }

    setLoadingPurchase(pack.id);

    try {
      // Check wallet balance first
      const wallet = getUserWallet(currentUser.id);
      
      if (wallet.balance >= pack.price) {
        // Pay from wallet
        const success = debitWallet(currentUser.id, pack.price, `Purchase: ${pack.title}`);
        if (success) {
          setPurchasedPacks(prev => [...prev, pack.id]);
          toast.success(`Successfully purchased ${pack.title}!`);
          // Simulate download
          setTimeout(() => {
            toast.success('Download started!');
          }, 1000);
        }
      } else {
        // Insufficient wallet balance, redirect to Paystack
        toast.info('Insufficient wallet balance. Redirecting to payment...');
        
        const paymentResponse = await initializePayment({
          email: currentUser.email,
          amount: pack.price,
          metadata: {
            userId: currentUser.id,
            packId: pack.id,
            service: 'Question Pack Purchase'
          }
        });

        if (paymentResponse.status) {
          // Redirect to Paystack
          window.location.href = paymentResponse.data.authorization_url;
        } else {
          throw new Error('Payment initialization failed');
        }
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Purchase failed. Please try again.');
    } finally {
      setLoadingPurchase(null);
    }
  };

  const handleDownload = (pack: QuestionPack) => {
    toast.success(`Downloading ${pack.title}...`);
    // Simulate download
    setTimeout(() => {
      toast.success('Download completed!');
    }, 2000);
  };

  const isPurchased = (packId: string) => purchasedPacks.includes(packId);

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Past Question Papers</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access comprehensive collection of past questions from WAEC, JAMB, NECO, and more. 
              Practice with real exam questions and boost your preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionPacks.map((pack) => (
              <Card key={pack.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{pack.examType}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{pack.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{pack.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{pack.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{pack.questions} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{pack.downloads} downloads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{pack.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₦{pack.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-sm text-muted-foreground italic">
                      Preview: {pack.preview}
                    </p>
                  </div>

                  {isPurchased(pack.id) ? (
                    <Button 
                      onClick={() => handleDownload(pack)} 
                      className="w-full"
                      variant="default"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handlePurchase(pack)} 
                      className="w-full"
                      disabled={loadingPurchase === pack.id}
                    >
                      {loadingPurchase === pack.id ? 'Processing...' : `Buy for ₦${pack.price.toLocaleString()}`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {!currentUser && (
            <div className="text-center mt-12 p-8 bg-primary/5 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Ready to start practicing?</h3>
              <p className="text-muted-foreground mb-6">
                Sign up now to access thousands of past questions and boost your exam preparation.
              </p>
              <Button onClick={() => navigate('/auth')} size="lg">
                Sign Up Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ExamListing;
