import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.app_metadata?.role === 'admin'

  if (request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  if (request.nextUrl.pathname === '/admin/login' && isAdmin) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Customer account area — require login (login & register stay public)
  const path = request.nextUrl.pathname
  const isAccountAuthPage = path === '/account/login' || path === '/account/register'
  if (path.startsWith('/account') && !isAccountAuthPage && !user) {
    return NextResponse.redirect(new URL('/account/login', request.url))
  }
  if (isAccountAuthPage && user) {
    return NextResponse.redirect(new URL('/account', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
