
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload, Mail, Phone, School, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfileProps {
  user: any;
}

const UserProfile = ({ user }: UserProfileProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    school: user?.school || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          school: formData.school,
          location: formData.location,
          bio: formData.bio,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    setIsUploading(true);
    
    try {
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicURL.publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">My Profile</h2>
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile photo</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={user?.avatar_url} alt={user?.name} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user?.name?.split(' ').map((n: string) => n[0]).join('') || user?.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="w-full">
              <Label htmlFor="avatar" className="cursor-pointer w-full">
                <div className="flex items-center justify-center w-full p-2 border-2 border-dashed rounded-md border-muted-foreground/25 hover:border-primary/50">
                  <Upload className="w-4 h-4 mr-2" />
                  <span>{isUploading ? 'Uploading...' : 'Upload New Picture'}</span>
                </div>
                <Input 
                  id="avatar" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                />
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={true} // Email should not be editable
                    placeholder="Your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="school" className="flex items-center gap-2">
                    <School className="w-4 h-4" /> School/Institution
                  </Label>
                  <Input
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Your school or institution"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Your city/state"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Tell us a bit about yourself"
                  rows={4}
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
