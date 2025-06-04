
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Video, BookOpen, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { addMaterial, getAllMaterials, updateMaterial, deleteMaterial } from '@/services/materialsService';
import type { Material } from '@/services/materialsService';

const MaterialUpload = () => {
  const [materials, setMaterials] = useState<Material[]>(getAllMaterials());
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as 'past-question' | 'video' | 'ebook' | '',
    examType: '',
    subject: '',
    year: new Date().getFullYear(),
    price: 0,
    instructor: '',
    author: '',
    status: 'active' as 'active' | 'draft'
  });

  const examTypes = ['WAEC', 'JAMB', 'NECO', 'GCE', 'Cambridge', 'University'];
  const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government', 'Literature', 'Geography', 'History'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.examType || !formData.subject || formData.price <= 0) {
      toast.error('Please fill in all required fields including price');
      return;
    }

    if (editingMaterial) {
      const updated = updateMaterial(editingMaterial.id, formData);
      if (updated) {
        setMaterials(getAllMaterials());
        setEditingMaterial(null);
        resetForm();
      }
    } else {
      const newMaterial = addMaterial(formData);
      setMaterials(getAllMaterials());
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '' as any,
      examType: '',
      subject: '',
      year: new Date().getFullYear(),
      price: 0,
      instructor: '',
      author: '',
      status: 'active'
    });
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description || '',
      type: material.type,
      examType: material.examType,
      subject: material.subject,
      year: material.year || new Date().getFullYear(),
      price: material.price,
      instructor: material.instructor || '',
      author: material.author || '',
      status: material.status
    });
  };

  const handleDelete = (id: string) => {
    if (deleteMaterial(id)) {
      setMaterials(getAllMaterials());
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'past-question': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'ebook': return <BookOpen className="h-4 w-4" />;
      default: return <Upload className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {editingMaterial ? 'Edit Educational Material' : 'Upload Educational Material'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter material title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Material Type *</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="past-question">Past Question</SelectItem>
                    <SelectItem value="video">Video Course</SelectItem>
                    <SelectItem value="ebook">E-Book</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="examType">Exam Type *</Label>
                <Select value={formData.examType} onValueChange={(value) => setFormData({ ...formData, examType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map((exam) => (
                      <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="Enter price in Naira"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                />
              </div>

              {formData.type === 'video' && (
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    placeholder="Instructor name"
                  />
                </div>
              )}

              {formData.type === 'ebook' && (
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter material description"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {editingMaterial ? 'Update Material' : 'Upload Material'}
              </Button>
              {editingMaterial && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditingMaterial(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
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
                      {getTypeIcon(material.type)}
                      <h3 className="font-semibold">{material.title}</h3>
                      <Badge variant={material.status === 'active' ? 'default' : 'secondary'}>
                        {material.status}
                      </Badge>
                      <Badge variant="outline">₦{material.price.toLocaleString()}</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{material.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{material.examType} • {material.subject}</span>
                      {material.year && <span>Year: {material.year}</span>}
                      <span>{material.downloads} downloads</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(material)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(material.id)}
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
