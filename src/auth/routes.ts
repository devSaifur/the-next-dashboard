/**
 * Routes that are available for everyone, and doesn't require authentication
 * @type {string[]}
 *  */
export const publicRoutes: string[] = ['/', '/auth/new-verification']

/**
 * Routes that are used for authentication, those routes will redirect users to /settings
 * @type {string[]}
 * */
export const authRoutes: string[] = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/error',
  '/auth/reset',
  '/auth/new-password',
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
export const DEFAULT_LOGIN_REDIRECT: string = '/settings'