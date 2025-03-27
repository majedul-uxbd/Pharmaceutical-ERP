import axios from 'axios';
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth' {
    interface User {
        employee_id: string;
        full_name: string;
        designation_id: string;
        designation_name: string;
        depot_id: string;
        depot_name: string;
        module_id: string;
        module_name: string;
        profile_pic: string | null;
    }
    interface Session {
        user: User & { id: string };
    }
}

const credentialsConfig = CredentialsProvider({
    // name: "Credentials",
    // credentials: {
    //   username: { label: "Email" },
    //   password: { label: "Password", type: "password" },
    // },
    async authorize(credentials) {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                {
                    module_name: credentials.module_name,
                    username: credentials.username,
                    password: credentials.password,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    httpsAgent: new (require('https').Agent)({
                        rejectUnauthorized: false,
                    }),
                }
            );
            const { status, data } = response;
            // console.log('data 1', data);
            // console.log('status', status);
            if (status === 202) {
                return {
                    id: data.token,
                    employee_id: data.data.employee_id,
                    full_name: data.data.full_name,
                    designation_id: data.data.designation_id,
                    designation_name: data.data.designation_name,
                    depot_id: data.data.depot_id,
                    depot_name: data.data.depot_name,
                    module_id: data.data.module_id,
                    module_name: data.data.module_name,
                    profile_pic: data.data.profile_pic,
                };
            }
            return null;
        } catch (error) {
            // console.error("Login error:", error)
            return null;
        }
    },
});

const config = {
    providers: [credentialsConfig],
    callbacks: {
        async session({ session, token }) {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/get-user-data`,
                { lg: 'en' },
                {
                    headers: { Authorization: `Bearer ${token.sub}` },
                    httpsAgent: new (require('https').Agent)({
                        rejectUnauthorized: false,
                    }),
                }
            );
            const { status, data } = response;

            if (session.user) {
                session.user.employee_id = data.data.employee_id;
                session.user.full_name = data.data.full_name;
                session.user.designation_id = data.data.designation_id;
                session.user.designation_name = data.data.designation_name;
                session.user.depot_id = data.data.depot_id;
                session.user.depot_name = data.data.depot_name;
                session.user.module_id = data.data.module_id;
                session.user.module_name = data.data.module_name;
                session.user.profile_pic = data.data.profile_pic;
                session.user.id = token.sub!;
            }

            // //console.log("Session:", session)
            return session;
        },
        async jwt({ token }) {
            // //console.log("Token:", token)
            return token;
        },
    },
    session: { strategy: 'jwt' },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
