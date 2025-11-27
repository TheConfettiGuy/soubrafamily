import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// ADMIN_EMAILS="a@x.com,b@y.com"
const allowlist = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            allowDangerousEmailAccountLinking: false,
          }),
        ]
      : []),
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const u = credentials?.username?.trim() ?? "";
        const p = credentials?.password ?? "";
        const adminUser = process.env.ADMIN_USER ?? "";
        const adminPass = process.env.ADMIN_PASS ?? "";
        if (adminUser && adminPass && u === adminUser && p === adminPass) {
          return { id: "admin", name: "Admin", email: adminUser, role: "admin" } as any;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "google") {
        const email = (profile as any)?.email?.toLowerCase() ?? "";
        if (allowlist.length > 0 && (email === "" || !allowlist.includes(email))) {
          return false;
        }
      }
      if (account?.provider === "credentials" && user) return true;
      return true;
    },
    async jwt({ token, user }) {
      if (user && (user as any).role) token.role = (user as any).role;
      if (!(token as any).role) (token as any).role = "user";
      return token;
    },
    async session({ session, token }) {
      (session as any).user = (session as any).user || {};
      (session as any).user.role = (token as any).role || "user";
      return session;
    },
  },
  pages: { signIn: "/login" },
};
