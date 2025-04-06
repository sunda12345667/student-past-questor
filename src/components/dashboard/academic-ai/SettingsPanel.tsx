
import { School } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

interface SettingsPanelProps {
  subject: string;
  setSubject: (value: string) => void;
  educationLevel: string;
  setEducationLevel: (value: string) => void;
}

export const SettingsPanel = ({
  subject,
  setSubject,
  educationLevel,
  setEducationLevel
}: SettingsPanelProps) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Subject Area</label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
              <SelectItem value="literature">Literature & English</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="geography">Geography</SelectItem>
              <SelectItem value="languages">Languages</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Education Level</label>
          <Select value={educationLevel} onValueChange={setEducationLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primary School</SelectItem>
              <SelectItem value="secondary">Secondary School</SelectItem>
              <SelectItem value="university">University</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2 flex items-center">
            <School className="mr-2 h-4 w-4" />
            Current Settings
          </h3>
          <p className="text-sm">Subject: <span className="font-medium">{subject.charAt(0).toUpperCase() + subject.slice(1)}</span></p>
          <p className="text-sm">Level: <span className="font-medium">{educationLevel.charAt(0).toUpperCase() + educationLevel.slice(1)}</span></p>
        </div>
      </div>
    </div>
  );
};
