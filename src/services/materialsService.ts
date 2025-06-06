
import { supabase } from '@/integrations/supabase/client';

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: string;
  format: string;
  price: number;
  file_url?: string;
  preview_text?: string;
  seller_id: string;
  status: string;
  featured: boolean;
  downloads: number;
  created_at: string;
}

export const fetchApprovedMaterials = async (): Promise<StudyMaterial[]> => {
  try {
    const { data, error } = await supabase
      .from('study_materials')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch materials:', error);
    throw error;
  }
};

export const fetchUserPurchases = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        study_materials (*)
      `)
      .eq('user_id', userId)
      .order('purchase_date', { ascending: false });

    if (error) {
      console.error('Error fetching user purchases:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch user purchases:', error);
    throw error;
  }
};

export const checkUserPurchase = async (userId: string, materialId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('material_id', materialId)
      .maybeSingle();

    if (error) {
      console.error('Error checking user purchase:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Failed to check user purchase:', error);
    return false;
  }
};

export const uploadMaterial = async (materialData: {
  title: string;
  description: string;
  subject: string;
  type: string;
  format?: string;
  price: number;
  seller_id: string;
  status?: string;
  featured?: boolean;
  downloads?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('study_materials')
      .insert([{
        ...materialData,
        format: materialData.format || 'PDF',
        status: materialData.status || 'pending',
        featured: materialData.featured || false,
        downloads: materialData.downloads || 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Error uploading material:', error);
      throw error;
    }

    console.log('Material uploaded successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to upload material:', error);
    throw error;
  }
};

// Add the missing functions that are imported in MaterialUpload.tsx
export const addMaterial = async (materialData: {
  title: string;
  description: string;
  subject: string;
  type: string;
  format?: string;
  price: number;
  seller_id: string;
  status?: string;
  featured?: boolean;
  downloads?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('study_materials')
      .insert([{
        ...materialData,
        format: materialData.format || 'PDF',
        status: materialData.status || 'pending',
        featured: materialData.featured || false,
        downloads: materialData.downloads || 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding material:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to add material:', error);
    throw error;
  }
};

export const updateMaterial = async (id: string, updates: Partial<StudyMaterial>) => {
  try {
    const { data, error } = await supabase
      .from('study_materials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating material:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update material:', error);
    throw error;
  }
};

export const getAllMaterials = async (): Promise<StudyMaterial[]> => {
  try {
    const { data, error } = await supabase
      .from('study_materials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all materials:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch all materials:', error);
    throw error;
  }
};

export const deleteMaterial = async (id: string) => {
  try {
    const { error } = await supabase
      .from('study_materials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting material:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete material:', error);
    throw error;
  }
};
