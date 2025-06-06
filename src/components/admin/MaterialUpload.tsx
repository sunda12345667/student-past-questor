
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Video, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { addMaterial, updateMaterial, getAllMaterials, deleteMaterial, StudyMaterial } from '@/services/materialsService';
import { useAuth } from '@/contexts/AuthContext';

export default function MaterialUpload() {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'past-question' | 'video' | 'ebook'>('past-question');
  const [examType, setExamType] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [price, setPrice] = useState(0);
  const [instructor, setInstructor] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [isUploading, setIsUploading] = useState(false);

  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch materials on component mount
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materialsData = await getAllMaterials();
        setMaterials(materialsData);
      } catch (error) {
        console.error('Failed to fetch materials:', error);
        toast.error('Failed to load materials');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !type || !examType || !subject || price <= 0) {
      toast.error('Please fill in all required fields and set a valid price');
      return;
    }

    if (!currentUser) {
      toast.error('You must be logged in to upload materials');
      return;
    }

    setIsUploading(true);
    
    try {
      const materialData = {
        title,
        description,
        type,
        subject: `${subject} - ${examType}`, // Combine subject and exam type
        price,
        seller_id: currentUser.id,
        status: status === 'active' ? 'approved' : 'pending',
        format: 'PDF',
        featured: false,
        downloads: 0
      };

      if (editingId) {
        await updateMaterial(editingId, materialData);
        toast.success('Material updated successfully');
        setEditingId(null);
      } else {
        await addMaterial(materialData);
        toast.success('Material uploaded successfully');
      }

      // Reset form
      setTitle('');
      setDescription('');
      setType('past-question');
      setExamType('');
      setSubject('');
      setYear(new Date().getFullYear());
      setPrice(0);
      setInstructor('');
      setAuthor('');
      setStatus('active');
      
      // Refresh materials list
      const materialsData = await getAllMaterials();
      setMaterials(materialsData);
    } catch (error) {
      console.error('Failed to upload material:', error);
      toast.error('Failed to upload material');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (material: StudyMaterial) => {
    setTitle(material.title);
    setDescription(material.description || '');
    setType(material.type as 'past-question' | 'video' | 'ebook');
    setExamType(''); // Reset exam type as it's combined in subject
    setSubject(material.subject);
    setYear(year || new Date().getFullYear());
    setPrice(material.price);
    setInstructor('');
    setAuthor('');
    setStatus(material.status === 'approved' ? 'active' : 'draft');
    setEditingId(material.id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      try {
        await deleteMaterial(id);
        toast.success('Material deleted successfully');
        const materialsData = await getAllMaterials();
        setMaterials(materialsData);
      } catch (error) {
        console.error('Failed to delete material:', error);
        toast.error('Failed to delete material');
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'past-question':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'ebook':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {editingId ? 'Edit Educational Material' : 'Upload Educational Material'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter material title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Material Type *</Label>
                <Select value={type} onValueChange={(value: 'past-question' | 'video' | 'ebook') => setType(value)}>
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
                <Input
                  id="examType"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  placeholder="e.g., WAEC, JAMB, NECO"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Mathematics, English"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  placeholder="2024"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {type === 'video' && (
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="Instructor name"
                  />
                </div>
              )}

              {type === 'ebook' && (
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: 'active' | 'draft') => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter material description"
                rows={3}
                required
              />
            </div>

            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? 'Uploading...' : editingId ? 'Update Material' : 'Upload Material'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Materials List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Materials</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading materials...</div>
          ) : (
            <div className="space-y-4">
              {materials.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No materials uploaded yet.
                </div>
              ) : (
                materials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(material.type)}
                      <div>
                        <h3 className="font-medium">{material.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {material.subject} • ₦{material.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(material)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(material.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
