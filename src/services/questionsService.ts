
import { toast } from 'sonner';

// Define question types
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
  year: string;
  examType: string;
}

export interface QuestionPack {
  id: string;
  title: string;
  description: string;
  subject: string;
  examType: string;
  year: string;
  questionCount: number;
  price: number;
  purchasedDate?: string;
  status?: 'Available' | 'Downloaded';
}

// For the SampleQuestions component
export interface SampleQuestion {
  id: number;
  subject: string;
  examType: string;
  year: number;
  title: string;
  content: string;
  price: number;
}

// Sample question data
const sampleQuestionPacks: QuestionPack[] = [
  { 
    id: '1', 
    title: 'WAEC 2023 Mathematics', 
    description: 'Complete set of WAEC 2023 Mathematics past questions with detailed solutions.',
    subject: 'Mathematics',
    examType: 'WAEC',
    year: '2023',
    questionCount: 50,
    price: 1500,
    purchasedDate: '2023-07-15',
    status: 'Downloaded',
  },
  { 
    id: '2', 
    title: 'JAMB Physics 2022-2023', 
    description: 'Comprehensive JAMB Physics past questions with explanations and solutions.',
    subject: 'Physics',
    examType: 'JAMB',
    year: '2022-2023',
    questionCount: 40,
    price: 1200,
    purchasedDate: '2023-06-22',
    status: 'Available',
  },
  { 
    id: '3', 
    title: 'NECO Biology 2023', 
    description: 'Full set of NECO Biology past questions with answers and explanations.',
    subject: 'Biology',
    examType: 'NECO',
    year: '2023',
    questionCount: 60,
    price: 1800,
    purchasedDate: '2023-08-10',
    status: 'Available',
  },
  { 
    id: '4', 
    title: 'Cambridge IGCSE Chemistry 2023', 
    description: 'Cambridge IGCSE Chemistry past papers with mark schemes and solutions.',
    subject: 'Chemistry',
    examType: 'Cambridge',
    year: '2023',
    questionCount: 45,
    price: 2500,
  },
  { 
    id: '5', 
    title: 'WAEC 2023 English Language', 
    description: 'Complete WAEC English Language past questions with answers and comprehension passages.',
    subject: 'English',
    examType: 'WAEC',
    year: '2023',
    questionCount: 55,
    price: 1500,
  },
  { 
    id: '6', 
    title: 'JAMB Economics 2023', 
    description: 'Full JAMB Economics past questions with explanations and graphs.',
    subject: 'Economics',
    examType: 'JAMB',
    year: '2023',
    questionCount: 40,
    price: 1200,
  },
  { 
    id: '7', 
    title: 'UNILAG Post-UTME 2023', 
    description: 'Complete set of University of Lagos Post-UTME past questions for all courses.',
    subject: 'General',
    examType: 'Post-UTME',
    year: '2023',
    questionCount: 100,
    price: 2000,
  },
  { 
    id: '8', 
    title: 'UI Post-UTME Science 2023', 
    description: 'University of Ibadan Post-UTME past questions for science courses with solutions.',
    subject: 'Science',
    examType: 'Post-UTME',
    year: '2023',
    questionCount: 80,
    price: 1800,
  },
  { 
    id: '9', 
    title: 'OAU Post-UTME Arts & Humanities 2023', 
    description: 'Obafemi Awolowo University Post-UTME past questions for arts and humanities.',
    subject: 'Arts',
    examType: 'Post-UTME',
    year: '2023',
    questionCount: 70,
    price: 1700,
  },
  { 
    id: '10', 
    title: 'UNIBEN Post-UTME Engineering 2023', 
    description: 'University of Benin Post-UTME engineering past questions with solutions.',
    subject: 'Engineering',
    examType: 'Post-UTME',
    year: '2023',
    questionCount: 85,
    price: 1900,
  }
];

// Sample sample questions for homepage display
const sampleQuestions: SampleQuestion[] = [
  {
    id: 1,
    subject: 'Mathematics',
    examType: 'WAEC',
    year: 2023,
    title: 'Algebra and Calculus',
    content: 'This sample pack contains questions on algebraic expressions, equations, and basic calculus concepts commonly tested in WAEC examinations.',
    price: 0 // Free sample
  },
  {
    id: 2,
    subject: 'Physics',
    examType: 'JAMB',
    year: 2023,
    title: 'Mechanics and Electricity',
    content: 'Sample physics questions covering mechanics, electricity, and magnetism as frequently tested in JAMB examinations.',
    price: 0 // Free sample
  },
  {
    id: 3,
    subject: 'Chemistry',
    examType: 'NECO',
    year: 2023,
    title: 'Organic Chemistry',
    content: 'Sample questions on organic chemistry, covering hydrocarbons, functional groups, and reactions from recent NECO examinations.',
    price: 0 // Free sample
  },
  {
    id: 4,
    subject: 'Biology',
    examType: 'WAEC',
    year: 2023,
    title: 'Ecology and Genetics',
    content: 'Sample biology questions focusing on ecological concepts and genetic principles frequently tested in WAEC examinations.',
    price: 0 // Free sample
  },
  {
    id: 5,
    subject: 'English',
    examType: 'JAMB',
    year: 2023,
    title: 'Comprehension and Grammar',
    content: 'Sample English language questions featuring reading comprehension passages and grammatical concepts from recent JAMB examinations.',
    price: 0 // Free sample
  }
];

// Sample questions for a pack
const questionsByPack: Record<string, Question[]> = {
  '1': [
    {
      id: '1-1',
      question: 'Simplify: (3x² + 4x - 2) - (x² - 3x + 5)',
      options: [
        '2x² + 7x - 7',
        '2x² + x - 7',
        '4x² + 7x - 7',
        '4x² + x - 3'
      ],
      correctAnswer: '2x² + 7x - 7',
      explanation: 'By removing brackets and combining like terms: (3x² + 4x - 2) - (x² - 3x + 5) = 3x² + 4x - 2 - x² + 3x - 5 = 2x² + 7x - 7',
      subject: 'Mathematics',
      year: '2023',
      examType: 'WAEC'
    },
    {
      id: '1-2',
      question: 'If f(x) = 2x² - 3x + 4, find f(2)',
      options: [
        '6',
        '8',
        '10',
        '12'
      ],
      correctAnswer: '6',
      explanation: 'f(2) = 2(2²) - 3(2) + 4 = 2(4) - 6 + 4 = 8 - 6 + 4 = 6',
      subject: 'Mathematics',
      year: '2023',
      examType: 'WAEC'
    },
    {
      id: '1-3',
      question: 'The angle subtended at the center of a circle is 60°. What is the angle subtended at any point on the alternate segment?',
      options: [
        '30°',
        '60°',
        '120°',
        '150°'
      ],
      correctAnswer: '30°',
      explanation: 'The angle subtended at any point on the alternate segment is half the angle subtended at the center. So, 60° ÷ 2 = 30°.',
      subject: 'Mathematics',
      year: '2023',
      examType: 'WAEC'
    }
  ]
};

// API functions to mimic backend operations
export const fetchQuestionPacks = async (): Promise<QuestionPack[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...sampleQuestionPacks];
};

export const fetchSampleQuestions = async (): Promise<SampleQuestion[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...sampleQuestions];
};

export const fetchPurchasedQuestionPacks = async (): Promise<QuestionPack[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return sampleQuestionPacks.filter(pack => pack.purchasedDate);
};

export const fetchQuestionsByPackId = async (packId: string): Promise<Question[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return questionsByPack[packId] || [];
};

export const purchaseQuestionPack = async (packId: string): Promise<QuestionPack> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const pack = sampleQuestionPacks.find(p => p.id === packId);
  if (!pack) {
    throw new Error('Question pack not found');
  }
  
  // Update the pack with purchase info
  const updatedPack = {
    ...pack,
    purchasedDate: new Date().toISOString().split('T')[0],
    status: 'Available' as const
  };
  
  // In a real app, we would update the backend here
  
  toast.success(`Successfully purchased ${updatedPack.title}`);
  return updatedPack;
};

export const downloadQuestionPack = async (packId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const pack = sampleQuestionPacks.find(p => p.id === packId);
  if (!pack) {
    throw new Error('Question pack not found');
  }
  
  // In a real app, we would create a PDF or other download format
  
  toast.success(`Downloaded ${pack.title} successfully`);
};

export const searchQuestionPacks = async (query: string): Promise<QuestionPack[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query.trim()) {
    return sampleQuestionPacks;
  }
  
  const lowerQuery = query.toLowerCase();
  return sampleQuestionPacks.filter(pack => 
    pack.title.toLowerCase().includes(lowerQuery) ||
    pack.description.toLowerCase().includes(lowerQuery) ||
    pack.subject.toLowerCase().includes(lowerQuery) ||
    pack.examType.toLowerCase().includes(lowerQuery) ||
    pack.year.toLowerCase().includes(lowerQuery)
  );
};
