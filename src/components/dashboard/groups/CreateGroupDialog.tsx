
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, Plus } from 'lucide-react';

interface CreateGroupDialogProps {
  onCreateGroup: (group: { name: string; description: string; isPrivate: boolean }) => void;
}

const CreateGroupDialog = ({ onCreateGroup }: CreateGroupDialogProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    isPrivate: false
  });
  
  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) {
      toast({
        title: "Group name required",
        description: "Please provide a name for your study group.",
        variant: "destructive"
      });
      return;
    }
    
    onCreateGroup(newGroup);
    setNewGroup({ name: '', description: '', isPrivate: false });
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Study Group</DialogTitle>
          <DialogDescription>
            Create a new study group to collaborate with other students.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input 
              id="group-name" 
              placeholder="e.g., JAMB Physics Study Group"
              value={newGroup.name}
              onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group-description">Description</Label>
            <Textarea 
              id="group-description" 
              placeholder="Describe the purpose of your group"
              value={newGroup.description}
              onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="private-group" 
              checked={newGroup.isPrivate}
              onCheckedChange={(checked) => 
                setNewGroup(prev => ({ ...prev, isPrivate: checked === true }))
              }
            />
            <Label htmlFor="private-group" className="flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Make this group private (invite only)
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
