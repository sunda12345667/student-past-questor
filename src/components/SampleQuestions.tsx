
import { SearchBar } from './SearchBar';
import { Eye, Download, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

const sampleQuestions = [
  {
    id: 1,
    subject: 'Mathematics',
    examType: 'WAEC',
    year: '2023',
    title: 'Algebra and Equations',
    questions: 45,
    preview: "Solve for x: If 2x + 5 = 11, then x = ?"
  },
  {
    id: 2,
    subject: 'Physics',
    examType: 'JAMB',
    year: '2023',
    title: 'Mechanics and Motion',
    questions: 38,
    preview: "A car moves with a constant acceleration of 2 m/s². If it starts from rest, what will be its velocity after 5 seconds?"
  },
  {
    id: 3,
    subject: 'English',
    examType: 'NECO',
    year: '2022',
    title: 'Comprehension and Grammar',
    questions: 60,
    preview: "Read the passage and answer: The author's main argument is best described as..."
  },
  {
    id: 4,
    subject: 'Chemistry',
    examType: 'Cambridge',
    year: '2022',
    title: 'Organic Chemistry',
    questions: 42,
    preview: "What is the molecular formula of benzene?"
  },
  {
    id: 5,
    subject: 'Biology',
    examType: 'WAEC',
    year: '2021',
    title: 'Cell Biology and Genetics',
    questions: 50,
    preview: "Which of the following is NOT a function of the cell membrane?"
  },
  {
    id: 6,
    subject: 'Economics',
    examType: 'University',
    year: '2023',
    title: 'Microeconomics Principles',
    questions: 35,
    preview: "Define price elasticity of demand and explain its determinants."
  }
];

export function SampleQuestions() {
  const [activeTab, setActiveTab] = useState<string>('All');
  
  const filteredQuestions = activeTab === 'All' 
    ? sampleQuestions 
    : sampleQuestions.filter(q => q.subject === activeTab);

  const handlePreviewQuestion = (questionId: number) => {
    toast.info(`Previewing question set #${questionId}`);
  };

  const handleSaveQuestion = (questionId: number) => {
    toast.success(`Question set #${questionId} saved to your library`);
  };

  const handleViewFullSet = (subject: string, examType: string) => {
    toast.info(`Loading full ${subject} ${examType} question set...`);
  };

  const handleViewAllQuestions = () => {
    toast.info('Loading complete question database...');
  };

  return (
    <section id="questions" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="heading-lg mb-4">Explore our question bank</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Search through thousands of past questions or browse our sample collection below.
          </p>
          
          <SearchBar />
        </div>
        
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            {['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Economics'].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question) => (
            <div 
              key={question.id} 
              className="glass-panel rounded-xl overflow-hidden card-hover"
            >
              <div className="p-5 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/20 rounded-full text-primary">
                    {question.examType} {question.year}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {question.questions} questions
                  </span>
                </div>
                <h3 className="text-xl font-medium">{question.subject}</h3>
                <p className="text-sm text-muted-foreground">{question.title}</p>
              </div>
              
              <div className="p-5 border-t border-border/60">
                <p className="text-sm mb-5">{question.preview}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 px-2"
                      onClick={() => handlePreviewQuestion(question.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 px-2"
                      onClick={() => handleSaveQuestion(question.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="h-8"
                    onClick={() => handleViewFullSet(question.subject, question.examType)}
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    View Full Set
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline"
            onClick={handleViewAllQuestions}
          >
            View all questions
          </Button>
        </div>
      </div>
    </section>
  );
}
