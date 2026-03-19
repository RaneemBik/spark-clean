import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

type CookieToSet = {
  name: string
  value: string
  options?: Record<string, unknown>
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  console.log('🔐 API Route: Attempting auth for', email)
  
  const cookieStore = cookies()
  const cookiesToSet: CookieToSet[] = []
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet_: CookieToSet[]) {
          // Collect cookies to set on response
          cookiesToSet_.forEach((cookie: CookieToSet) => {
            cookiesToSet.push(cookie)
            console.log('🍪 Supabase returned cookie:', cookie.name)
          })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('❌ Auth failed:', error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 }
    )
  }

  console.log('✅ Auth successful for:', email)
  console.log('🔐 Session user:', data.session?.user.email)
  console.log('🔐 Access token:', data.session?.access_token ? 'YES' : 'NO')
  console.log('🔐 Refresh token:', data.session?.refresh_token ? 'YES' : 'NO')

  // Create response
  const response = NextResponse.json(
    { success: true, user: data.user },
    { status: 200 }
  )

  // Apply all cookies that Supabase wanted to set
  console.log('🍪 Total cookies to set in response:', cookiesToSet.length)
  cookiesToSet.forEach(({ name, value, options }) => {
    console.log('🍪 Setting cookie on response:', name)
    response.cookies.set(name, value, options)
  })

  return response
}
