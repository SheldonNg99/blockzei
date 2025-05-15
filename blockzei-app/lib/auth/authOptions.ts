// lib/auth/authOptions.ts
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from '@supabase/supabase-js';
import { compare } from "bcryptjs";
import { logger } from "../log/logger";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase Admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function getUserByEmail(email: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            logger.error('Error fetching user by email:', {
                email,
                error: error.message,
                code: error.code
            });
            return null;
        }

        return data;
    } catch (err) {
        logger.error('Exception in getUserByEmail:', {
            email,
            error: err instanceof Error ? err.message : String(err)
        });
        return null;
    }
}

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const user = await getUserByEmail(credentials.email);

                if (!user) {
                    throw new Error("Invalid email or password");
                }

                try {
                    const isValid = await compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Invalid email or password");
                    }

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.name,
                        image: user.image
                    };
                } catch (error) {
                    logger.error("Authentication error:", {
                        email: credentials.email,
                        error: error instanceof Error ? error.message : String(error)
                    });
                    throw new Error("Authentication error");
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            logger.info("Sign in callback initiated", {
                email: user.email,
                provider: account?.provider
            });

            try {
                if (account?.provider === 'google') {
                    // Check if user exists
                    const { data: existingUser, error: userError } = await supabaseAdmin
                        .from('users')
                        .select('id')
                        .eq('email', user.email)
                        .single();

                    if (userError) {
                        if (userError.code === 'PGRST116') { // "No rows found"
                            logger.info('Creating new user account for Google auth', { email: user.email });

                            const now = new Date().toISOString();

                            const { data, error } = await supabaseAdmin
                                .from('users')
                                .insert({
                                    email: user.email,
                                    name: user.name,
                                    image: user.image,
                                    created_at: now,
                                    updated_at: now
                                })
                                .select('id')
                                .single();

                            if (error) {
                                logger.error('Error creating user during Google auth:', {
                                    email: user.email,
                                    error: error.message,
                                    code: error.code
                                });
                                return false;
                            }

                            // Set user properties from newly created user
                            user.id = data.id;

                            logger.info('New Google user created', {
                                userId: user.id
                            });
                        } else {
                            // Some other database error occurred
                            logger.error('Error checking existing user during Google auth:', {
                                email: user.email,
                                error: userError.message,
                                code: userError.code
                            });
                            return true;
                        }
                    } else if (existingUser) {
                        // User exists, update user object with db data
                        user.id = existingUser.id;

                        logger.info('Existing user retrieved for Google auth', {
                            userId: user.id
                        });
                    }
                }
                return true;
            } catch (error) {
                logger.error("SignIn callback error:", {
                    email: user.email,
                    error: error instanceof Error ? error.message : String(error)
                });
                return true; // Still allow sign in even if there's an error
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;

                logger.debug("JWT callback: Token updated with user data", {
                    userId: user.id
                });
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.image = token.image as string;

                logger.debug("Session callback: Session updated with token data", {
                    userId: session.user.id
                });
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};