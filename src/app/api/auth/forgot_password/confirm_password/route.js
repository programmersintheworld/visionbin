import { parseUpdateArray } from "@/helpers/parseFunctions";
import { NextResponse } from "next/server";
import { turso } from "@/helpers/config";
import bcrypt from "bcrypt";

export async function POST(req) {
    const formData = await req.formData();
    const code = formData.get("code");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const email = formData.get("email");

    if (!code || !password || !confirmPassword) {
        return NextResponse.json({ message: "Code, password, and confirm password are required" }, { status: 400 });
    }

    try {
        const query = await turso.execute({
            sql: "SELECT token_password FROM users WHERE email = ?",
            args: [email],
        });
        const rows = query.rows[0];
        
        if (!rows) {
            return NextResponse.json({ message: "Code not found" }, { status: 404 });
        }

        if (rows.token_password.toString() !== code) {
            return NextResponse.json({ message: "Invalid code" }, { status: 401 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        const queryUpdate = parseUpdateArray("users", { password: hashedPassword }, { index: "email", value: email });
        await turso.batch(queryUpdate, "write");

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}