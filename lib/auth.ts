import { compare } from "bcryptjs";
import NextAuth, { type NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email }, include: { memberships: true } });
        if (!user) return null;
        const ok = await compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        const primaryMembership = user.memberships[0];
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: primaryMembership?.role,
          familyProjectId: primaryMembership?.familyProjectId
        } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.familyProjectId = (user as any).familyProjectId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).familyProjectId = token.familyProjectId;
      }
      return session;
    }
  },
  pages: { signIn: "/login" }
};

export const { handlers, auth } = NextAuth(authOptions);

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Não autenticado");
  return session;
}
