
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, Search, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/SearchBar';
import { fetchPurchasedQuestionPacks, QuestionPack, downloadQuestionPack } from '@/services/questionsService';
import { toast } from 'sonner';

export const QuestionsTab = () => {
  const navigate = useNavigate();
  const [purchasedQuestions, setPurchasedQuestions] = useState<QuestionPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const loadPurchasedQuestions = async () => {
      try {
        setLoading(true);
        const questions = await fetchPurchasedQuestionPacks();
        setPurchasedQuestions(questions);
      } catch (error) {
        toast.error('Failed to load your purchased questions');
        console.error('Error loading questions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPurchasedQuestions();
  }, []);

  const handleDownload = async (packId: string) => {
    try {
      setDownloading(packId);
      await downloadQuestionPack(packId);
      
      // Update local state to reflect download
      setPurchasedQuestions(prev => 
        prev.map(q => q.id === packId ? { ...q, status: 'Downloaded' } : q)
      );
    } catch (error) {
      toast.error('Failed to download questions');
      console.error('Error downloading questions:', error);
    } finally {
      setDownloading(null);
    }
  };

  const handleViewQuestions = (packId: string) => {
    navigate(`/questions/${packId}`);
  };

  return (
    <>
      <h2 className="text-2xl font-medium mb-6">My Questions</h2>
      
      <div className="mb-6 flex justify-between items-center">
        <SearchBar />
        <Button 
          variant="outline" 
          onClick={() => navigate('/exams')}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Browse More
        </Button>
      </div>
      
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="animate-pulse border rounded-lg p-4">
              <div className="h-5 w-3/4 bg-muted rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      ) : purchasedQuestions.length > 0 ? (
        <div className="grid gap-4">
          {purchasedQuestions.map((question) => (
            <div key={question.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{question.title}</h3>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <span>Purchased: {question.purchasedDate}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDownload(question.id)}
                  disabled={downloading === question.id}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  {downloading === question.id ? 'Downloading...' : 'Download'}
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleViewQuestions(question.id)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Questions Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't purchased any questions yet. Browse our catalog to get started.
          </p>
          <Button onClick={() => navigate('/exams')}>
            Browse Question Packs
          </Button>
        </div>
      )}
    </>
  );
};
