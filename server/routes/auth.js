
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || "https://mincssuyfzyrtuwooeyo.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbmNzc3V5Znp5cnR1d29vZXlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjIwNTQwNSwiZXhwIjoyMDU3NzgxNDA1fQ.MvdkBvEaYqDQ1K2gTOXYv3K4a7wnoAKQc9PXOWDbIHM"; 

// Service role key is used only on the server side for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create a new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log(`Server: Creating user with email: ${email}`);
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'user' },
      email_confirm: true // Set to true to auto-confirm emails for testing
    });
    
    if (authError) {
      console.error('Signup error:', authError);
      return res.status(400).json({ error: authError.message });
    }
    
    console.log('Server: User created successfully', authData);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message || 'An error occurred during signup' });
  }
});

// Login endpoint - enhanced for better error handling
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`Server: Processing login for email: ${email}`);
    
    // Use Supabase auth to sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError) {
      console.error('Login auth error:', authError);
      return res.status(400).json({ 
        error: authError.message,
        code: authError.code 
      });
    }
    
    if (!authData.user) {
      console.error('Login error: No user returned');
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    // Get user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // Don't fail the login if profile fetch fails
    }
    
    // Combine user and profile data for response
    const userData = {
      id: authData.user.id,
      email: authData.user.email,
      name: profileData?.name || authData.user.user_metadata?.name || authData.user.email?.split('@')[0] || '',
      role: profileData?.role || authData.user.user_metadata?.role || 'user',
      ...profileData
    };
    
    console.log('Server: Login successful for user:', userData.email);
    res.status(200).json(userData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'An error occurred during login' });
  }
});

module.exports = router;
