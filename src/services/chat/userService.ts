
import { supabase } from "@/integrations/supabase/client";

// Fetch profiles for message senders
export const fetchMessageSenders = async (senderIds: string[]) => {
  if (senderIds.length === 0) return [];
  
  try {
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, avatar_url")
      .in("id", senderIds);
      
    if (profileError) throw profileError;
    return profiles || [];
  } catch (error) {
    console.error("Error fetching sender profiles:", error);
    return [];
  }
};

// Get current user's profile
export const getCurrentUserProfile = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return null;
    }
    
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, name, avatar_url")
      .eq("id", user.user.id)
      .single();
      
    if (error) throw error;
    return profile;
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    return null;
  }
};
