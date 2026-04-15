import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../db/index.js";
import * as schema from "../db/schema/auth.js";

export const auth = betterAuth({
    // --- 1. CRITICAL: The backend URL so OAuth knows where to redirect ---
    baseURL: process.env.BETTER_AUTH_URL || "https://modern-dashboard-backend-production.up.railway.app",

    // --- 2. CRITICAL: Trusted frontend URLs to allow cookies and redirects ---
    trustedOrigins: [
        process.env.FRONTEND_URL || "https://modern-dashboard-smoky.vercel.app",
        "http://localhost:5173" // Kept for local development
    ],

    // --- 3. CRITICAL: Cross-site cookie settings (Vercel <-> Railway) ---
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
        },
    },

    secret: process.env.BETTER_AUTH_SECRET!,

    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),

    emailAndPassword: {
        enabled: true,
        // Restored your password reset logic!
        sendResetPassword: async ({ user, url, token }) => {
            console.log(`\n=========================================`);
            console.log(`🎉 SUCCESS! Password reset requested`);
            console.log(`User: ${user.email}`);
            console.log(`Reset Link: ${url}`);
            console.log(`=========================================\n`);
        },
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "student",
                input: true,
            },
            imageCldPubId: {
                type: "string",
                required: false,
                input: true,
            },
        },
    },
});