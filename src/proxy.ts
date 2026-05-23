import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './lib/routing'
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const intl = createIntlMiddleware(routing)
const LOCALES = ['de', 'en', 'fr', 'it']

function secret() {
  return new TextEncoder().encode(process.env.JWT_SECRET || '')
}

function getLocale(pathname: string) {
  return LOCALES.find(l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`) ?? 'de'
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPortal = LOCALES.some(l => pathname.startsWith(`/${l}/portal`))
  const isLogin = LOCALES.some(l => pathname === `/${l}/portal/login`)

  if (isPortal && !isLogin) {
    const token = req.cookies.get('agrin-session')?.value
    const locale = getLocale(pathname)

    if (!token) return NextResponse.redirect(new URL(`/${locale}/portal/login`, req.url))

    try {
      const { payload } = await jwtVerify(token, secret())
      const role = payload.role as string
      const isAdmin = LOCALES.some(l => pathname.startsWith(`/${l}/portal/admin`))

      if (isAdmin && role !== 'admin') {
        return NextResponse.redirect(new URL(`/${locale}/portal/dashboard`, req.url))
      }
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL(`/${locale}/portal/login`, req.url))
    }
  }

  return intl(req)
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)', '/([\\w-]+)?/portal/:path*']
}
