
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const examTypes = ['All', 'WAEC', 'JAMB', 'NECO', 'Cambridge', 'University'];
const subjects = ['All Subjects', 'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics'];
const years = ['All Years', '2023', '2022', '2021', '2020', '2019', '2018'];

export function SearchBar() {
  const [examType, setExamType] = useState('All');
  const [subject, setSubject] = useState('All Subjects');
  const [year, setYear] = useState('All Years');

  return (
    <div className="w-full p-4 glass-panel rounded-2xl">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Search for questions..."
            className="w-full h-12 pl-10 pr-4 bg-background rounded-lg border border-input focus-ring"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 md:w-auto">
          <select 
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="h-12 px-4 rounded-lg border border-input bg-background focus-ring"
          >
            {examTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-12 px-4 rounded-lg border border-input bg-background focus-ring"
          >
            {subjects.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
          
          <select 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="h-12 px-4 rounded-lg border border-input bg-background focus-ring"
          >
            {years.map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
          
          <Button className="h-12 px-6">
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
