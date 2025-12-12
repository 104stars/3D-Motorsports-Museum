'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user - getUser() validates with server, so deleted users will return null
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) {
        // Check if project is paused (error code PGRST301 or similar)
        if (error.message?.includes('paused') || error.status === 503) {
          console.error('Supabase project appears to be paused:', error.message)
        }
        // Clear invalid session
        supabase.auth.signOut({ scope: 'local' })
        setUser(null)
      } else {
        setUser(user ?? null)
      }
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Validate user exists on server when session changes
        if (session) {
          const { data: { user }, error } = await supabase.auth.getUser()
          if (error || !user) {
            // User was deleted or session invalid
            setUser(null)
            await supabase.auth.signOut({ scope: 'local' })
          } else {
            setUser(user)
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

