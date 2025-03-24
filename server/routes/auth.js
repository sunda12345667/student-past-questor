
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || "https://mincssuyfzyrtuwooeyo.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""; // This should be set in your server environment

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
      email_confirm: true
    });
    
    if (authError) {
      console.error('Signup error:', authError);
      return res.status(400).json({ error: authError.message });
    }
    
    console.log('Server: User created successfully');
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message || 'An error occurred during signup' });
  }
});

// Login - This is handled directly by the client with Supabase
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log(`Server: Fetching user profile for email: ${email}`);
    
    // Get user by email (for compatibility with old code)
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (userError && userError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Login error:', userError);
      return res.status(400).json({ error: userError.message });
    }
    
    if (!user) {
      console.log(`Server: No profile found for email: ${email}`);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('Server: User profile retrieved successfully');
    res.status(200).json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'An error occurred during login' });
  }
});

module.exports = router;
