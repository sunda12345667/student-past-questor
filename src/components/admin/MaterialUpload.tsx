
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileInput } from '@/components/ui/file-input';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Video, BookOpen, Trash2, Edit, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Material {
  id: number;
  title: string;
  description: string;
  type: 'past-question' | 'video' | 'ebook';
  examType: string;
  subject: string;
  year?: number;
  price: number;
  file?: File;
  fileName?: string;
  fileSize?: string;
  duration?: string;
  pages?: number;
  downloads: number;
  uploadDate: string;
  status: 'active' | 'draft' | 'archived';
}

const MaterialUpload = () => {
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: 1,
      title: 'WAEC Mathematics 2023',
      description: 'Complete WAEC Mathematics past questions with detailed solutions',
      type: 'past-question',
      examType: 'WAEC',
      subject: 'Mathematics',
      year: 2023,
      price: 1500,
      fileName: 'waec-math-2023.pdf',
      fileSize: '2.3 MB',
      pages: 45,
      downloads: 156,
      uploadDate: '2024-05-15',
      status: 'active'
    },
    {
      id: 2,
      title: 'JAMB Physics Video Course',
      description: 'Comprehensive video course covering all JAMB Physics topics',
      type: 'video',
      examType: 'JAMB',
      subject: 'Physics',
      price: 3500,
      fileName: 'jamb-physics-course.mp4',
      fileSize: '850 MB',
      duration: '4:30:00',
      downloads: 89,
      uploadDate: '2024-05-10',
      status: 'active'
    }
  ]);

  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    type: 'past-question' as const,
    examType: '',
    subject: '',
    year: new Date().getFullYear(),
    price: 0,
    file: null as File | null,
    duration: '',
    pages: 0,
    status: 'active' as const
  });

  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const examTypes = ['WAEC', 'JAMB', 'NECO', 'GCE', 'NABTEB'];
  const subjects = [
    'Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology',
    'Economics', 'Government', 'Literature', 'Geography', 'History',
    'Commerce', 'Accounting', 'Computer Science', 'Agricultural Science'
  ];

  const handleFileUpload = (file: File | null) => {
    if (file) {
      setNewMaterial(prev => ({ ...prev, file }));
      toast.success(`File "${file.name}" selected for upload`);
    }
  };

  const handleAddMaterial = () => {
    if (!newMaterial.title || !newMaterial.examType || !newMaterial.subject || !newMaterial.file) {
      toast.error('Please fill in all required fields and select a file');
      return;
    }

    const material: Material = {
      id: Date.now(),
      title: newMaterial.title,
      description: newMaterial.description,
      type: newMaterial.type,
      examType: newMaterial.examType,
      subject: newMaterial.subject,
      year: newMaterial.type === 'past-question' ? newMaterial.year : undefined,
      price: newMaterial.price,
      fileName: newMaterial.file.name,
      fileSize: `${(newMaterial.file.size / (1024 * 1024)).toFixed(1)} MB`,
      duration: newMaterial.type === 'video' ? newMaterial.duration : undefined,
      pages: newMaterial.type !== 'video' ? newMaterial.pages : undefined,
      downloads: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      status: newMaterial.status
    };

    setMaterials([...materials, material]);
    setNewMaterial({
      title: '',
      description: '',
      type: 'past-question',
      examType: '',
      subject: '',
      year: new Date().getFullYear(),
      price: 0,
      file: null,
      duration: '',
      pages: 0,
      status: 'active'
    });
    toast.success('Material uploaded successfully!');
  };

  const handleUpdateMaterial = () => {
    if (!editingMaterial) return;

    setMaterials(materials.map(material => 
      material.id === editingMaterial.id ? editingMaterial : material
    ));
    setEditingMaterial(null);
    toast.success('Material updated successfully!');
  };

  const deleteMaterial = (id: number) => {
    setMaterials(materials.filter(material => material.id !== id));
    toast.success('Material deleted successfully');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'past-question': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'ebook': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'past-question': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-red-100 text-red-800';
      case 'ebook': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {editingMaterial ? 'Edit Material' : 'Upload New Material'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Material title"
              value={editingMaterial ? editingMaterial.title : newMaterial.title}
              onChange={(e) => 
                editingMaterial 
                  ? setEditingMaterial({ ...editingMaterial, title: e.target.value })
                  : setNewMaterial({ ...newMaterial, title: e.target.value })
              }
            />
            
            <Select 
              value={editingMaterial ? editingMaterial.type : newMaterial.type}
              onValueChange={(value: 'past-question' | 'video' | 'ebook') => 
                editingMaterial 
                  ? setEditingMaterial({ ...editingMaterial, type: value })
                  : setNewMaterial({ ...newMaterial, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Material type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="past-question">Past Questions</SelectItem>
                <SelectItem value="video">Video Course</SelectItem>
                <SelectItem value="ebook">E-Book</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select 
              value={editingMaterial ? editingMaterial.examType : newMaterial.examType}
              onValueChange={(value) => 
                editingMaterial 
                  ? setEditingMaterial({ ...editingMaterial, examType: value })
                  : setNewMaterial({ ...newMaterial, examType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Exam type" />
              </SelectTrigger>
              <SelectContent>
                {examTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={editingMaterial ? editingMaterial.subject : newMaterial.subject}
              onValueChange={(value) => 
                editingMaterial 
                  ? setEditingMaterial({ ...editingMaterial, subject: value })
                  : setNewMaterial({ ...newMaterial, subject: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Price (₦)"
              value={editingMaterial ? editingMaterial.price : newMaterial.price}
              onChange={(e) => 
                editingMaterial 
                  ? setEditingMaterial({ ...editingMaterial, price: parseInt(e.target.value) || 0 })
                  : setNewMaterial({ ...newMaterial, price: parseInt(e.target.value) || 0 })
              }
            />
          </div>

          {(editingMaterial?.type === 'past-question' || newMaterial.type === 'past-question') && (
            <Input
              type="number"
              placeholder="Year"
              value={editingMaterial ? editingMaterial.year || '' : newMaterial.year}
              onChange={(e) => 
                editingMaterial 
                  ? setEditingMaterial({ ...editingMaterial, year: parseInt(e.target.value) })
                  : setNewMaterial({ ...newMaterial, year: parseInt(e.target.value) })
              }
            />
          )}

          {(editingMaterial?.type === 'video' || newMaterial.type === 'video') && (
            <Input
              placeholder="Duration (e.g., 4:30:00)"
              value={editingMaterial ? editingMaterial.duration || '' : newMaterial.duration}
              onChange={(e) => 
                editingMaterial 
                  ? setEditingMaterial({ ...editingMaterial, duration: e.target.value })
                  : setNewMaterial({ ...newMaterial, duration: e.target.value })
              }
            />
          )}

          {(editingMaterial?.type !== 'video' || newMaterial.type !== 'video') && (
            <Input
              type="number"
              placeholder="Number of pages"
              value={editingMaterial ? editingMaterial.pages || '' : newMaterial.pages}
              onChange={(e) => 
                editingMaterial 
                  ? setEditingMaterial({ ...editingMaterial, pages: parseInt(e.target.value) })
                  : setNewMaterial({ ...newMaterial, pages: parseInt(e.target.value) })
              }
            />
          )}

          <Textarea
            placeholder="Description"
            value={editingMaterial ? editingMaterial.description : newMaterial.description}
            onChange={(e) => 
              editingMaterial 
                ? setEditingMaterial({ ...editingMaterial, description: e.target.value })
                : setNewMaterial({ ...newMaterial, description: e.target.value })
            }
            rows={3}
          />

          {!editingMaterial && (
            <div>
              <label className="block text-sm font-medium mb-2">Upload File</label>
              <FileInput
                accept={newMaterial.type === 'video' ? 'video/*' : '.pdf,.doc,.docx'}
                onFileChange={handleFileUpload}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {newMaterial.type === 'video' 
                  ? 'Supported formats: MP4, AVI, MOV' 
                  : 'Supported formats: PDF, DOC, DOCX'
                }
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {editingMaterial ? (
              <>
                <Button onClick={handleUpdateMaterial} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Update Material
                </Button>
                <Button variant="outline" onClick={() => setEditingMaterial(null)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleAddMaterial} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Material
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Materials List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Materials ({materials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getTypeColor(material.type)} flex items-center gap-1`}>
                        {getTypeIcon(material.type)}
                        {material.type === 'past-question' ? 'Past Question' : 
                         material.type === 'video' ? 'Video Course' : 'E-Book'}
                      </Badge>
                      <Badge variant="outline">{material.examType}</Badge>
                      <Badge variant="secondary">{material.subject}</Badge>
                      {material.year && <Badge variant="outline">{material.year}</Badge>}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-1">{material.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{material.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Price:</span> ₦{material.price.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">File:</span> {material.fileName}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span> {material.fileSize}
                      </div>
                      <div>
                        <span className="font-medium">Downloads:</span> {material.downloads}
                      </div>
                      {material.duration && (
                        <div>
                          <span className="font-medium">Duration:</span> {material.duration}
                        </div>
                      )}
                      {material.pages && (
                        <div>
                          <span className="font-medium">Pages:</span> {material.pages}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Uploaded:</span> {material.uploadDate}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> 
                        <Badge variant={material.status === 'active' ? 'default' : 'secondary'} className="ml-1">
                          {material.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingMaterial(material)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteMaterial(material.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialUpload;
