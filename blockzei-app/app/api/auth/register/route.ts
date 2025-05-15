// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/supabase";
import { logger } from "@/lib/log/logger";

export async function POST(req: NextRequest) {
    try {
        const { email, name, password } = await req.json();

        // Input validation
        if (!email || !name || !password) {
            return NextResponse.json({
                error: "Missing required fields",
                details: "Email, name, and password are required"
            }, { status: 400 });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                error: "Invalid email format"
            }, { status: 400 });
        }

        // Check if user already exists
        const { data: existingUser, error: userError } = await supabaseAdmin
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (userError && userError.code !== "PGRST116") { // 'No rows found' is acceptable here
            logger.error("Error checking existing user", {
                error: userError.message,
                email: email
            });
            return NextResponse.json({
                error: "Failed to check user existence"
            }, { status: 500 });
        }

        if (existingUser) {
            return NextResponse.json({
                error: "User already exists"
            }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const now = new Date().toISOString();

        // Create user
        const { data: newUser, error: createError } = await supabaseAdmin
            .from("users")
            .insert({
                email,
                name,
                password: hashedPassword,
                created_at: now,
                updated_at: now
            })
            .select('id')
            .single();

        if (createError) {
            logger.error("Error registering user", {
                error: createError.message,
                email: email
            });
            return NextResponse.json({
                error: "Failed to create user account"
            }, { status: 500 });
        }

        // Log successful registration
        logger.info("User registered successfully", {
            userId: newUser.id,
            email: email
        });

        return NextResponse.json({
            success: true,
            userId: newUser.id
        });

    } catch (err) {
        logger.error("Registration failed", {
            error: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined
        });

        return NextResponse.json({
            error: "Internal server error during registration"
        }, { status: 500 });
    }
}