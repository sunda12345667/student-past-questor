
import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileDown, FileText, Clock, BarChart, ThumbsUp } from 'lucide-react';
import { Question, fetchQuestionsByPackId, QuestionPack, downloadQuestionPack } from '@/services/questionsService';
import { toast } from 'sonner';

const QuestionView = () => {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [packDetails, setPackDetails] = useState<QuestionPack | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!packId) return;
      
      try {
        setLoading(true);
        const fetchedQuestions = await fetchQuestionsByPackId(packId);
        setQuestions(fetchedQuestions);
        
        // Set pack details (in a real app, we would fetch this separately)
        setPackDetails({
          id: packId,
          title: `${fetchedQuestions[0]?.examType || 'Exam'} ${fetchedQuestions[0]?.subject || 'Subject'} ${fetchedQuestions[0]?.year || 'Year'}`,
          description: 'Complete set of past questions with detailed solutions.',
          subject: fetchedQuestions[0]?.subject || 'Subject',
          examType: fetchedQuestions[0]?.examType || 'Exam',
          year: fetchedQuestions[0]?.year || 'Year',
          questionCount: fetchedQuestions.length,
          price: 1500,
          status: 'Downloaded',
          purchasedDate: '2023-09-20'
        });
      } catch (error) {
        toast.error('Failed to load questions');
        console.error('Error loading questions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [packId]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const toggleExplanation = (questionId: string) => {
    setShowExplanation(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleDownload = async () => {
    if (!packId) return;
    
    try {
      setDownloading(true);
      await downloadQuestionPack(packId);
    } catch (error) {
      toast.error('Failed to download questions');
      console.error('Error downloading questions:', error);
    } finally {
      setDownloading(false);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const isCorrect = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    return selectedAnswers[questionId] === question?.correctAnswer;
  };

  const calculateProgress = () => {
    const answered = Object.keys(selectedAnswers).length;
    return questions.length > 0 ? (answered / questions.length) * 100 : 0;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-64 bg-muted rounded mb-4"></div>
              <div className="h-4 w-48 bg-muted rounded"></div>
            </div>
          </div>
        ) : (
          <>
            {packDetails && (
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{packDetails.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-primary/10">
                    {packDetails.subject}
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10">
                    {packDetails.examType}
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10">
                    {packDetails.year}
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10">
                    {packDetails.questionCount} Questions
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <Button 
                    variant="outline" 
                    onClick={handleDownload}
                    disabled={downloading}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    {downloading ? 'Downloading...' : 'Download PDF'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Clock className="h-6 w-6 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Time</p>
                          <p className="font-medium">{questions.length * 2} minutes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Questions</p>
                          <p className="font-medium">{questions.length} questions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <BarChart className="h-6 w-6 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Your Progress</p>
                          <p className="font-medium">{calculateProgress().toFixed(0)}% completed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          
            <Tabs defaultValue="practice">
              <TabsList className="mb-6">
                <TabsTrigger value="practice">Practice Mode</TabsTrigger>
                <TabsTrigger value="all">All Questions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="practice">
                {questions.length > 0 ? (
                  <div className="glass-panel rounded-xl p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <Badge variant="outline">
                        Question {currentQuestion + 1} of {questions.length}
                      </Badge>
                      {selectedAnswers[questions[currentQuestion].id] && (
                        <Badge 
                          variant={isCorrect(questions[currentQuestion].id) ? "default" : "destructive"}
                        >
                          {isCorrect(questions[currentQuestion].id) ? 'Correct' : 'Incorrect'}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-medium mb-4">{questions[currentQuestion].question}</h3>
                      
                      <div className="space-y-3">
                        {questions[currentQuestion].options.map((option, index) => (
                          <div 
                            key={index} 
                            className={`
                              p-4 rounded-lg border cursor-pointer transition-colors
                              ${selectedAnswers[questions[currentQuestion].id] === option 
                                ? (isCorrect(questions[currentQuestion].id) 
                                  ? 'border-green-500 bg-green-500/10' 
                                  : 'border-red-500 bg-red-500/10')
                                : 'hover:border-primary hover:bg-primary/5'}
                              ${option === questions[currentQuestion].correctAnswer && 
                                selectedAnswers[questions[currentQuestion].id] && 
                                !isCorrect(questions[currentQuestion].id) 
                                ? 'border-green-500 bg-green-500/10'
                                : ''}
                            `}
                            onClick={() => handleAnswerSelect(questions[currentQuestion].id, option)}
                          >
                            <div className="flex items-start">
                              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-muted mr-3">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span>{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {selectedAnswers[questions[currentQuestion].id] && (
                      <div className="mb-6">
                        <Button 
                          variant="outline" 
                          onClick={() => toggleExplanation(questions[currentQuestion].id)}
                        >
                          {showExplanation[questions[currentQuestion].id] ? 'Hide Explanation' : 'Show Explanation'}
                        </Button>
                        
                        {showExplanation[questions[currentQuestion].id] && (
                          <div className="mt-4 p-4 bg-muted rounded-lg">
                            <div className="flex items-center mb-2">
                              <ThumbsUp className="h-4 w-4 mr-2 text-primary" />
                              <h4 className="font-medium">Explanation</h4>
                            </div>
                            <p>{questions[currentQuestion].explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={goToPreviousQuestion} 
                        disabled={currentQuestion === 0}
                      >
                        Previous
                      </Button>
                      <Button 
                        onClick={goToNextQuestion} 
                        disabled={currentQuestion === questions.length - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <p className="text-muted-foreground">No questions available.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="all">
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <Card key={question.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                          {selectedAnswers[question.id] && (
                            <Badge 
                              variant={isCorrect(question.id) ? "default" : "destructive"}
                            >
                              {isCorrect(question.id) ? 'Correct' : 'Incorrect'}
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{question.question}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          {question.options.map((option, optIndex) => (
                            <div 
                              key={optIndex} 
                              className={`
                                p-3 rounded-lg border cursor-pointer transition-colors
                                ${selectedAnswers[question.id] === option 
                                  ? (isCorrect(question.id) 
                                    ? 'border-green-500 bg-green-500/10' 
                                    : 'border-red-500 bg-red-500/10')
                                  : 'hover:border-primary hover:bg-primary/5'}
                                ${option === question.correctAnswer && 
                                  selectedAnswers[question.id] && 
                                  !isCorrect(question.id) 
                                  ? 'border-green-500 bg-green-500/10'
                                  : ''}
                              `}
                              onClick={() => handleAnswerSelect(question.id, option)}
                            >
                              <div className="flex items-start">
                                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-muted mr-3">
                                  {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span>{option}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {selectedAnswers[question.id] && (
                          <div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toggleExplanation(question.id)}
                            >
                              {showExplanation[question.id] ? 'Hide Explanation' : 'Show Explanation'}
                            </Button>
                            
                            {showExplanation[question.id] && (
                              <div className="mt-4 p-4 bg-muted rounded-lg">
                                <div className="flex items-center mb-2">
                                  <ThumbsUp className="h-4 w-4 mr-2 text-primary" />
                                  <h4 className="font-medium">Explanation</h4>
                                </div>
                                <p>{question.explanation}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};

export default QuestionView;
