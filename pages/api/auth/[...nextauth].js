import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter, MongoDBAdapterOptions } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

export const adapterOptions = {
    collections: {
        accounts: "accounts",
        sessions: "sessions",
        users: "users",
        verificationTokens: "verificationTokens",
    },
    databaseName: "userDetails",
};

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async redirect(url, baseUrl) {
            return "/profile";
        },
    },
    session: {
        strategy: 'jwt',
    },
    adapter: MongoDBAdapter(clientPromise, adapterOptions)
};

export default NextAuth(authOptions);