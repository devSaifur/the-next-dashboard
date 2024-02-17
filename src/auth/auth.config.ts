import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'

import type { NextAuthConfig } from 'next-auth'

export default {
  providers: [Google, Facebook],
} satisfies NextAuthConfig
