import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import clientPromise from "@services/mongodb";
import NextAuth from "next-auth";

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
          followers: profile.followers,
          verified: true,
        };
      },
    }),
    /**
     * @notes
     *  this is added just to mock a user data and to have all functionalities
     *  without login in with a Github account. This user is a mock user and
     *  credentials provider is not fully implemented.
     */
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = {
          id: "999",
          name: "J Smith",
          email: "jsmith@example.com",
          username: "jsmith@example.com",
        };

        if (user) return user;
        else return null;
      },
    }),
  ],
  /**
   * @notes
   *  callbacks are working in a compatible way to have the mock account (using
   *  credentials provider) and using real account using GithubProvider.
   */
  callbacks: {
    async jwt(params) {
      const session = params.token;
      session.user = params.user;

      return session;
    },
    async session({ session, user, token }) {
      session.username = user?.username;
      session.user = { ...(user || {}) } as any;

      if (token) {
        session.user = token as any;
        session.user.id = token.sub!;
        session.username = token.sub;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
