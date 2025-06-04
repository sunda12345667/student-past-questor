import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileInput } from '@/components/ui/file-input';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Video, BookOpen, Trash2, Edit, Download, Star } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getAllMaterials, 
  addMaterial, 
  updateMaterial, 
  deleteMaterial, 
  type Material 
} from '@/services/materialsService';

const MaterialUpload = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newMaterial, setNewMaterial] = useState<{
    title: string;
    description: string;
    type: 'past-question' | 'video' | 'ebook';
    examType: string;
    subject: string;
    year: number;
    price: number;
    file: File | null;
    duration: string;
    pages: number;
    status: 'active' | 'draft' | 'archived';
    instructor: string;
    author: string;
    lessons: number;
  }>({
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
    status: 'active',
    instructor: '',
    author: '',
    lessons: 0
  });

  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const examTypes = ['WAEC', 'JAMB', 'NECO', 'GCE', 'NABTEB', 'Cambridge', 'Post-UTME'];
  const subjects = [
    'Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology',
    'Economics', 'Government', 'Literature', 'Geography', 'History',
    'Commerce', 'Accounting', 'Computer Science', 'Agricultural Science',
    'General', 'Science', 'Arts', 'Engineering'
  ];

  // Load materials on component mount
  useEffect(() => {
    setMaterials(getAllMaterials());
  }, []);

  const handleFileUpload = (file: File | null) => {
    if (file) {
      setNewMaterial(prev => ({ ...prev, file }));
      toast.success(`File "${file.name}" selected for upload`);
    }
  };

  const handleAddMaterial = () => {
    if (!newMaterial.title || !newMaterial.examType || !newMaterial.subject || !newMaterial.file || newMaterial.price <= 0) {
      toast.error('Please fill in all required fields including price and select a file');
      return;
    }

    const materialData = {
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
      status: newMaterial.status,
      instructor: newMaterial.type === 'video' ? newMaterial.instructor : undefined,
      author: newMaterial.type === 'ebook' ? newMaterial.author : undefined,
      lessons: newMaterial.type === 'video' ? newMaterial.lessons : undefined,
      rating: 0
    };

    const addedMaterial = addMaterial(materialData);
    setMaterials(getAllMaterials());
    
    // Reset form
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
      status: 'active',
      instructor: '',
      author: '',
      lessons: 0
    });

    toast.success(`${materialData.title} uploaded successfully with price ₦${materialData.price.toLocaleString()}`);
  };

  const handleUpdateMaterial = () => {
    if (!editingMaterial || editingMaterial.price <= 0) {
      toast.error('Please ensure all fields are filled and price is greater than 0');
      return;
    }

    updateMaterial(editingMaterial.id, editingMaterial);
    setMaterials(getAllMaterials());
    setEditingMaterial(null);
    toast.success('Material updated successfully');
  };

  const handleDeleteMaterial = (id: string) => {
    deleteMaterial(id);
    setMaterials(getAllMaterials());
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

  const getTypeName = (type: string) => {
    switch (type) {
      case 'past-question': return 'Past Question';
      case 'video': return 'Video Course';
      case 'ebook': return 'E-Book';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {editingMaterial ? 'Edit Material' : 'Upload New Educational Material'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Material title *"
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
                <SelectValue placeholder="Material type *" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="past-question">Past Questions</SelectItem>
                <SelectItem value="video">Video Course</SelectItem>
                <SelectItem value="ebook">E-Book</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select 
              value={editingMaterial ? editingMaterial.examType : newMaterial.examType}
              onValueChange={(value) => 
                editingMaterial 
                  ? setEditingMaterial({ ...editingMaterial, examType: value })
                  : setNewMaterial({ ...newMaterial, examType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Exam type *" />
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
                <SelectValue placeholder="Subject *" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Price (₦) *"
              min="1"
              value={editingMaterial ? editingMaterial.price : newMaterial.price}
              onChange={(e) => 
                editingMaterial 
                  ? setEditingMaterial({ ...editingMaterial, price: parseInt(e.target.value) || 0 })
                  : setNewMaterial({ ...newMaterial, price: parseInt(e.target.value) || 0 })
              }
            />

            <Select 
              value={editingMaterial ? editingMaterial.status : newMaterial.status}
              onValueChange={(value: 'active' | 'draft' | 'archived') => 
                editingMaterial 
                  ? setEditingMaterial({ ...editingMaterial, status: value })
                  : setNewMaterial({ ...newMaterial, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional fields based on material type */}
          {(editingMaterial?.type === 'past-question' || newMaterial.type === 'past-question') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Year *"
                value={editingMaterial ? editingMaterial.year || '' : newMaterial.year}
                onChange={(e) => 
                  editingMaterial 
                    ? setEditingMaterial({ ...editingMaterial, year: parseInt(e.target.value) })
                    : setNewMaterial({ ...newMaterial, year: parseInt(e.target.value) })
                }
              />
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
            </div>
          )}

          {(editingMaterial?.type === 'video' || newMaterial.type === 'video') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Duration (e.g., 4:30:00) *"
                value={editingMaterial ? editingMaterial.duration || '' : newMaterial.duration}
                onChange={(e) => 
                  editingMaterial 
                    ? setEditingMaterial({ ...editingMaterial, duration: e.target.value })
                    : setNewMaterial({ ...newMaterial, duration: e.target.value })
                }
              />
              <Input
                placeholder="Instructor name *"
                value={editingMaterial ? editingMaterial.instructor || '' : newMaterial.instructor}
                onChange={(e) => 
                  editingMaterial 
                    ? setEditingMaterial({ ...editingMaterial, instructor: e.target.value })
                    : setNewMaterial({ ...newMaterial, instructor: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Number of lessons"
                value={editingMaterial ? editingMaterial.lessons || '' : newMaterial.lessons}
                onChange={(e) => 
                  editingMaterial 
                    ? setEditingMaterial({ ...editingMaterial, lessons: parseInt(e.target.value) })
                    : setNewMaterial({ ...newMaterial, lessons: parseInt(e.target.value) })
                }
              />
            </div>
          )}

          {(editingMaterial?.type === 'ebook' || newMaterial.type === 'ebook') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Author name *"
                value={editingMaterial ? editingMaterial.author || '' : newMaterial.author}
                onChange={(e) => 
                  editingMaterial 
                    ? setEditingMaterial({ ...editingMaterial, author: e.target.value })
                    : setNewMaterial({ ...newMaterial, author: e.target.value })
                }
              />
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
            </div>
          )}

          <Textarea
            placeholder="Description *"
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
              <label className="block text-sm font-medium mb-2">Upload File *</label>
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

          <div className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-md">
            <p className="font-medium mb-1">Required fields are marked with *</p>
            <p>• Price must be greater than ₦0</p>
            <p>• Past Questions: Year and pages are recommended</p>
            <p>• Video Courses: Duration and instructor are required</p>
            <p>• E-Books: Author and pages are recommended</p>
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
                        {getTypeName(material.type)}
                      </Badge>
                      <Badge variant="outline">{material.examType}</Badge>
                      <Badge variant="secondary">{material.subject}</Badge>
                      {material.year && <Badge variant="outline">{material.year}</Badge>}
                      <Badge variant={material.status === 'active' ? 'default' : 'secondary'}>
                        {material.status}
                      </Badge>
                      {material.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          <span className="text-sm">{material.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-1">{material.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{material.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium text-primary text-lg">Price:</span> ₦{material.price.toLocaleString()}
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
                      {material.lessons && (
                        <div>
                          <span className="font-medium">Lessons:</span> {material.lessons}
                        </div>
                      )}
                      {material.instructor && (
                        <div>
                          <span className="font-medium">Instructor:</span> {material.instructor}
                        </div>
                      )}
                      {material.pages && (
                        <div>
                          <span className="font-medium">Pages:</span> {material.pages}
                        </div>
                      )}
                      {material.author && (
                        <div>
                          <span className="font-medium">Author:</span> {material.author}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Uploaded:</span> {material.uploadDate}
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
                      onClick={() => handleDeleteMaterial(material.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {materials.length === 0 && (
              <div className="text-center py-12">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No materials uploaded yet</h3>
                <p className="text-muted-foreground">Upload your first educational material to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialUpload;
