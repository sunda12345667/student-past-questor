
import { academicKnowledgeBase } from './academicKnowledgeBase';

// Generate more intelligent responses for academic questions
export const generateAcademicResponse = (query: string, subject: string, level: string): string => {
  const queryLower = query.toLowerCase();
  
  // First check if query contains keywords from our knowledge base
  for (const item of academicKnowledgeBase) {
    if (subject !== 'general' && item.subject !== subject.toLowerCase()) continue;
    
    for (const keyword of item.keywords) {
      if (queryLower.includes(keyword)) {
        // Customize response based on education level
        let levelPrefix = "";
        if (level === 'primary') {
          levelPrefix = "Let me explain this in simple terms that are easy to understand. ";
        } else if (level === 'university') {
          levelPrefix = "Here's a university-level analysis of this problem. ";
        }
        
        return levelPrefix + item.response;
      }
    }
  }
  
  // If no specific match, provide a subject and level-appropriate response
  const subjectResponses: Record<string, string> = {
    'general': "That's an interesting question! Let me help you work through this step by step.",
    'mathematics': "To solve this math problem, we need to apply the following principles...",
    'physics': "This physics problem can be solved by applying the relevant laws and equations...",
    'chemistry': "Let's analyze this chemistry question by looking at the molecular structure and reactions...",
    'biology': "For this biology question, we need to consider the biological processes and structures...",
    'literature': "To analyze this text, let's look at the themes, characters, and literary devices...",
    'history': "Let's examine this historical question by considering the context and events of the period...",
    'geography': "To answer this geography question, we'll need to consider the regional characteristics...",
    'languages': "For this language question, let's examine the grammar, vocabulary, and context..."
  };
  
  let levelModifier = "";
  if (level === 'primary') {
    levelModifier = "Here's a simple explanation: ";
  } else if (level === 'secondary') {
    levelModifier = "Here's how you can solve this: ";
  } else if (level === 'university') {
    levelModifier = "Let me provide a detailed academic analysis: ";
  }
  
  return levelModifier + (subjectResponses[subject] || subjectResponses['general']);
};
