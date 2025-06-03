
import React from 'react';
import UserProfile from './UserProfile';
import { useAuth } from '@/contexts/AuthContext';

const ProfileTab = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <div>Loading profile...</div>;
  }
  
  return <UserProfile user={currentUser} />;
};

export default ProfileTab;
