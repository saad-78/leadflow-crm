import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@leadflow.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const demoEmail = process.env.DEMO_EMAIL || 'admin@leadflow.com';
        const demoPassword = process.env.DEMO_PASSWORD || 'admin123';

        if (
          credentials?.email === demoEmail &&
          credentials?.password === demoPassword
        ) {
          return {
            id: '1',
            email: demoEmail,
            name: 'Admin User',
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
