import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Single-admin store: credentials are checked against ADMIN_EMAIL /
// ADMIN_PASSWORD_HASH in .env rather than a User table, since there is
// exactly one admin account and no self-service signup.
export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD_HASH is not set in .env");
        }

        if (credentials.email.toLowerCase() !== adminEmail.toLowerCase()) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(credentials.password, adminPasswordHash);
        if (!isValidPassword) {
          return null;
        }

        return { id: "admin", email: adminEmail };
      },
    }),
  ],
  callbacks: {
    // Carries the admin email onto the JWT and out to the session object,
    // since there's no database user record to look it up from.
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // token.email is always set by jwt() above whenever authorize() succeeds.
      session.user.email = token.email ?? "";
      return session;
    },
  },
};
