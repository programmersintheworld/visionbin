import { turso } from "@/helpers/config";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
    const formData = await req.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
        return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }
    try {
        const query = await turso.execute({
            sql: "SELECT * FROM users WHERE email = ?",
            args: [email],
        })
        const rows = query.rows[0];
        if (!rows) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const validPassword = await bcrypt.compare(password, rows.password);
        if (!validPassword) return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        const token = jwt.sign({ id: rows.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        return NextResponse.json({ message: "Login successful", token }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}