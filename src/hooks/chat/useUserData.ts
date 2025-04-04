
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserData = (userId: string | undefined) => {
  const [userData, setUserData] = useState<{
    name: string;
    avatar?: string;
  } | null>(null);

  // Load current user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;
      
      try {
        const { data: user } = await supabase
          .from('profiles')
          .select('name, avatar_url')
          .eq('id', userId)
          .single();
          
        if (user) {
          setUserData({
            name: user.name,
            avatar: user.avatar_url
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [userId]);

  return userData;
};
