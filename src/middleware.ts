import { verifyRequestOrigin } from 'lucia'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (
    request.nextUrl.pathname.match(
      /api\/webhooks\/stripe|api\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/checkout/
    )
  ) {
    return NextResponse.next() // Skip checks for excluded routes
  }

  // Just in case, For API routes, since Next.js does not implement CSRF protection for API routes,
  // CSRF protection must be implemented when dealing with forms if you're dealing with forms
  if (request.method === 'GET') {
    return NextResponse.next()
  }
  const originHeader = request.headers.get('Origin')
  const hostHeader = request.headers.get('X-Forwarded-Host') // or 'X-Forwarded-Host'

  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403,
    })
  }
  return NextResponse.next()
}

//optionally don't invoke middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
