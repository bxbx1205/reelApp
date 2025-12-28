import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "./db";
import User, { ADMIN_EMAILS } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password")
                }
                try {
                   await connectToDatabase();
                    const user = await User.findOne({email:credentials.email})
                    if (!user) {
                        throw new Error("No user found")
                    }
                    if (!user.password) {
                        throw new Error("Please sign in with Google")
                    }
                   const isValid= await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if (!isValid) {
                        throw new Error("Invalid password")
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        role: user.role,
                    }
                } catch (error) {
                    throw error
                }
            },
        }),
    ],

    callbacks:{
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    await connectToDatabase();
                    
                    // Check if user exists
                    let existingUser = await User.findOne({ email: user.email });
                    
                    if (!existingUser) {
                        // Create new user for Google sign-in
                        const role = ADMIN_EMAILS.includes(user.email!) ? "admin" : "user";
                        existingUser = await User.create({
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            role,
                        });
                    } else {
                        // Update existing user's image/name from Google
                        existingUser.image = user.image || existingUser.image;
                        existingUser.name = user.name || existingUser.name;
                        // Update role if admin email
                        if (ADMIN_EMAILS.includes(user.email!)) {
                            existingUser.role = "admin";
                        }
                        await existingUser.save();
                    }
                    
                    // Attach MongoDB user id and role to the user object
                    user.id = existingUser._id.toString();
                    user.role = existingUser.role;
                } catch (error) {
                    console.error("Error during Google sign-in:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role || "user";
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role;
            }
            return session;
        }
    },
    pages:{
        signIn : "/login",
        error : "/login",
    },
    session:{
        strategy:"jwt",
        maxAge: 30*24*60*60
    },
    secret: process.env.NEXTAUTH_SECRET
};