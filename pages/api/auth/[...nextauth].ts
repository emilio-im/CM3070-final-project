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
  ],
  callbacks: {
    async session({ session, user }) {
      session.username = user.username;
      return session;
    },
  },
});
