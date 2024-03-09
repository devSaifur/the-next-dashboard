/**
 * Routes that are available for everyone, and doesn't require authentication
 * @type {string[]}
 *  */
export const publicRoutes: string[] = [
  '/',
  '/new-verification',
  '/api/webhooks/stripe',
]

/**
 * Routes that are used for authentication, those routes will redirect users to /
 * @type {string[]}
 * */
export const authRoutes: string[] = [
  '/sign-in',
  '/sign-up',
  '/error',
  '/reset',
  '/new-password',
]

/** 
 *  The prefix for API authentication routes
Routes that start with this prefix are used for API authentication purposes
@type {string}
*/
export const apiAuthPrefix: string = '/api/auth'

/**  The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/'
