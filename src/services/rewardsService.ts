
import { supabase } from '@/integrations/supabase/client';

export interface UserRewards {
  id: string;
  user_id: string;
  coins: number;
  cash_balance: number;
  study_streak: number;
  last_daily_spin?: string;
  created_at: string;
}

export const fetchUserRewards = async (userId: string): Promise<UserRewards | null> => {
  try {
    const { data, error } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user rewards:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch user rewards:', error);
    return null;
  }
};

export const updateUserRewards = async (userId: string, updates: Partial<UserRewards>) => {
  try {
    const { data, error } = await supabase
      .from('user_rewards')
      .upsert({ 
        user_id: userId, 
        ...updates 
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating user rewards:', error);
      throw error;
    }

    console.log('User rewards updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to update user rewards:', error);
    throw error;
  }
};

export const addCoins = async (userId: string, amount: number) => {
  try {
    const currentRewards = await fetchUserRewards(userId);
    const newCoins = (currentRewards?.coins || 0) + amount;
    
    return await updateUserRewards(userId, { coins: newCoins });
  } catch (error) {
    console.error('Failed to add coins:', error);
    throw error;
  }
};

export const addCashback = async (userId: string, amount: number) => {
  try {
    const currentRewards = await fetchUserRewards(userId);
    const newBalance = (currentRewards?.cash_balance || 0) + amount;
    
    return await updateUserRewards(userId, { cash_balance: newBalance });
  } catch (error) {
    console.error('Failed to add cashback:', error);
    throw error;
  }
};
