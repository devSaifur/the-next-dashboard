import { NextResponse } from 'next/server'

import NextAuth from 'next-auth'
import authConfig from './auth/auth.config'
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from './auth/routes'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
  }

  // if (!isLoggedIn && !isPublicRoute) {
  //   let callbackUrl = nextUrl.pathname

  //   if (nextUrl.search) {
  //     callbackUrl += nextUrl.search
  //   }

  //   const encodedCallbackUrl = encodeURIComponent(callbackUrl)

  //   return NextResponse.redirect(
  //     new URL(`/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl)
  //   )
  // }

  return
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
