import { turso } from "@/helpers/config";
import { generateID } from "@/helpers/generateID";
import { parseInsertArray } from "@/helpers/parseFunctions";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    const formData = await req.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (!email || !password || !confirmPassword) {
        return NextResponse.json({ message: "Email, password, and confirm password are required" }, { status: 400 });
    }

    if (password !== confirmPassword) {
        return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    try {
        const query = await turso.execute({
            sql: "SELECT * FROM users WHERE email = ?",
            args: [email],
        });
        const rows = query.rows[0];
        if (rows) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        const id = generateID();
        const queryInsert = parseInsertArray("users", { id, email, password: hashedPassword, token_password: null });
        await turso.batch(queryInsert, "write");
        const token = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        return NextResponse.json({ message: "User created successfully", token, id }, { status: 201 });
    } catch (error) {

        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}