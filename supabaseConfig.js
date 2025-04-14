// supabaseConfig.js
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xjgeqmkexmvgusoheyve.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqZ2VxbWtleG12Z3Vzb2hleXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODA5NjgsImV4cCI6MjA2MDA1Njk2OH0.pUDwO_k2Rr8Dld81MjznP5ALH4-6icRCDEoo67eosgA'

export const supabase = createClient(supabaseUrl, supabaseKey)