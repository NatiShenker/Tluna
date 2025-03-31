import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Initialize dotenv
dotenv.config()

// Verify environment variables are loaded
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials in .env file')
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function testConnection() {
  try {
    // Try to fetch a count of users table
    const { data, error } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .limit(1)

    if (error) {
      console.error('Connection error:', error.message)
      return
    }

    console.log('Successfully connected to Supabase!')
    console.log('Test query result:', data)
    
  } catch (err) {
    console.error('Error:', err.message)
  }
}

// Run the test
testConnection() 