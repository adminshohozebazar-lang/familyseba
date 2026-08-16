import "next-auth";
import "next-auth/jwt";

// Augments NextAuth's built-in types so `session.user.email` and
// `token.email` are typed without resorting to `any`.
declare module "next-auth" {
  interface Session {
    user: {
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email?: string;
  }
}
