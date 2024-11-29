import { NextResponse } from "next/server";
import { turso } from "@/helpers/config";
import { parseUpdateArray } from "@/helpers/parseFunctions";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

export async function POST(req) {
    const formData = await req.formData();
    const email = formData.get("email");

    if (!email) {
        return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    try {
        const query = await turso.execute({
            sql: "SELECT * FROM users WHERE email = ?",
            args: [email],
        });
        const rows = query.rows[0];

        if (!rows) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const token_password = Math.floor(100000 + Math.random() * 900000); // Random 6-digit code
        const queryUpdate = parseUpdateArray("users", { token_password }, { index: "email", value: email });
        await turso.batch(queryUpdate, "write");

        const mail = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Forgot password",
            html: `<html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Forgot password</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    main {
                        background: #497D40;
                        color: #fff;
                        text-align: center;
                    }
                    code {
                        background: #fff;
                        color: #000;
                        padding: 5px;
                        font-size: 1.2rem;
                    }
                </style>
            </head>
            <body>
                <main>
                    <h1>Hola ${rows.email.split("@")[0]}, olvidaste tu contraseña?</h1> 
                    <p>Ingresa el siguiente código para restablecer tu contraseña</p>
                    <code>${token_password}</code>
                    <p>Si no solicitaste restablecer tu contraseña, ignora este mensaje</p>
                    <p>Gracias. Atentamente, el equipo de soporte. PITW</p>
                </main>
            </body>
            </html>`
        };

        await transporter.sendMail(mail);

        return NextResponse.json({ message: "Code sent successfully" }, { status: 200 });
    } catch (error) {

        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}