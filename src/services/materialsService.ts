
import { toast } from 'sonner';

export interface Material {
  id: string;
  title: string;
  description: string;
  type: 'past-question' | 'video' | 'ebook';
  examType: string;
  subject: string;
  year?: number;
  price: number;
  fileName?: string;
  fileSize?: string;
  duration?: string;
  pages?: number;
  downloads: number;
  uploadDate: string;
  status: 'active' | 'draft' | 'archived';
  rating?: number;
  instructor?: string;
  author?: string;
  lessons?: number;
}

// Sample materials data
const sampleMaterials: Material[] = [
  {
    id: '1',
    title: 'WAEC Mathematics 2023 Past Questions',
    description: 'Complete WAEC Mathematics past questions with detailed solutions and marking scheme.',
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
    status: 'active',
    rating: 4.8
  },
  {
    id: '2',
    title: 'JAMB Physics Complete Video Course',
    description: 'Comprehensive video course covering all JAMB Physics topics with practical examples.',
    type: 'video',
    examType: 'JAMB',
    subject: 'Physics',
    price: 4500,
    fileName: 'jamb-physics-course.mp4',
    fileSize: '850 MB',
    duration: '8 hours',
    lessons: 24,
    downloads: 89,
    uploadDate: '2024-05-10',
    status: 'active',
    rating: 4.7,
    instructor: 'Dr. Michael Okafor'
  },
  {
    id: '3',
    title: 'Complete WAEC Mathematics Study Guide',
    description: 'Comprehensive e-book covering all WAEC Mathematics topics with solved examples.',
    type: 'ebook',
    examType: 'WAEC',
    subject: 'Mathematics',
    price: 2200,
    fileName: 'waec-math-guide.pdf',
    fileSize: '15.2 MB',
    pages: 180,
    downloads: 234,
    uploadDate: '2024-05-08',
    status: 'active',
    rating: 4.5,
    author: 'Mathematics Academy'
  }
];

// Local storage key
const MATERIALS_STORAGE_KEY = 'irapidbusiness_materials';

// Initialize materials in localStorage if not exists
const initializeMaterials = () => {
  const stored = localStorage.getItem(MATERIALS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(sampleMaterials));
    return sampleMaterials;
  }
  return JSON.parse(stored);
};

// Get all materials
export const getAllMaterials = (): Material[] => {
  return initializeMaterials();
};

// Get materials by type
export const getMaterialsByType = (type: 'past-question' | 'video' | 'ebook'): Material[] => {
  return getAllMaterials().filter(material => material.type === type && material.status === 'active');
};

// Get materials by exam type
export const getMaterialsByExamType = (examType: string): Material[] => {
  return getAllMaterials().filter(material => material.examType === examType && material.status === 'active');
};

// Add new material
export const addMaterial = (material: Omit<Material, 'id' | 'downloads' | 'uploadDate'>): Material => {
  const materials = getAllMaterials();
  const newMaterial: Material = {
    ...material,
    id: Date.now().toString(),
    downloads: 0,
    uploadDate: new Date().toISOString().split('T')[0]
  };
  
  materials.push(newMaterial);
  localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(materials));
  
  toast.success('Educational material uploaded successfully!');
  return newMaterial;
};

// Update material
export const updateMaterial = (id: string, updates: Partial<Material>): Material | null => {
  const materials = getAllMaterials();
  const index = materials.findIndex(m => m.id === id);
  
  if (index === -1) return null;
  
  materials[index] = { ...materials[index], ...updates };
  localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(materials));
  
  toast.success('Material updated successfully!');
  return materials[index];
};

// Delete material
export const deleteMaterial = (id: string): boolean => {
  const materials = getAllMaterials();
  const filteredMaterials = materials.filter(m => m.id !== id);
  
  if (filteredMaterials.length === materials.length) return false;
  
  localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(filteredMaterials));
  toast.success('Material deleted successfully!');
  return true;
};

// Search materials
export const searchMaterials = (query: string): Material[] => {
  if (!query.trim()) return getAllMaterials().filter(m => m.status === 'active');
  
  const lowerQuery = query.toLowerCase();
  return getAllMaterials().filter(material =>
    material.status === 'active' && (
      material.title.toLowerCase().includes(lowerQuery) ||
      material.description.toLowerCase().includes(lowerQuery) ||
      material.subject.toLowerCase().includes(lowerQuery) ||
      material.examType.toLowerCase().includes(lowerQuery)
    )
  );
};

// Purchase material (simulate)
export const purchaseMaterial = async (materialId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const material = getAllMaterials().find(m => m.id === materialId);
  if (!material) return false;
  
  updateMaterial(materialId, { downloads: material.downloads + 1 });
  
  toast.success(`Successfully purchased ${material.title}!`);
  return true;
};

// Download material (simulate)
export const downloadMaterial = async (materialId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const material = getAllMaterials().find(m => m.id === materialId);
  if (!material) return false;
  
  toast.success(`Downloaded ${material.title} successfully!`);
  return true;
};
