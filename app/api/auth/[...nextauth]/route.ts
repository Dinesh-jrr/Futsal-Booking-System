// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Define the type for the user object returned by the login endpoint
interface UserType {
  id: string;
  email: string;
  role: string;
  // Add any other properties you expect from your backend here
}

// Define the JWT token shape
interface JWT extends Record<string, unknown> {
  id: string;
  email: string;
  role: string;
}

// Define the session shape (this is the session data available in the app)
interface SessionType {
  user: UserType;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        // Implement your authentication logic here (e.g., check credentials with your backend)
        const res = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          return null;
        }

        const user: UserType = await res.json();
        console.log("user",user)

        if (user) {
          //@ts-ignore
          return user.user; // Return user object if credentials are valid
        }

        return null; // Return null if authentication failed
      },
    }),
  ],
  pages: {
    signIn: '/login',  // Specify custom sign-in page
  },
  session: {
    strategy: 'jwt',  // Use JWT-based session strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Attach user data to the JWT token
        token.id = user.id;
        token.email = user.email;
         //@ts-ignore
        token.role = user.role;
      }
      return token as JWT; // Ensure the returned token is typed correctly
    },
     //@ts-ignore
    async session({ session, token }) {
      if (token) {
        // Attach JWT token data to the session
         //@ts-ignore
        session.user.id = token.id as string;
         //@ts-ignore
        session.user.email = token.email as string;
         //@ts-ignore
        session.user.role = token.role as string;
      }
      //@ts-ignore
      return session as SessionType; // Ensure the session is typed correctly
    },
  },
}) as NextAuthOptions;

export { handler as GET, handler as POST };
