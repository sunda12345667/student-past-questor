
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

export const uploadMaterial = async (materialData: Partial<StudyMaterial>) => {
  try {
    const { data, error } = await supabase
      .from('study_materials')
      .insert([materialData])
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
