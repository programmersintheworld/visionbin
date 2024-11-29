import { generateID } from "@/helpers/generateID";
import { authMiddleware } from "@/helpers/auth.middleware";
import { turso } from "@/helpers/config";
import { parseInsertArray, parseUpdateArray } from "@/helpers/parseFunctions";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id_bin');

    if (!id) {
        return NextResponse.json({ error: 'id_bin is required' }, { status: 400 });
    }

    try {
        const query = turso.execute({
            sql: `SELECT * FROM wastes WHERE bin_id = ?`,
            args: [id]
        });
        const waste = await query.rows;

        if (!waste) {
            return NextResponse.json({ error: 'No waste found' }, { status: 404 });
        }

        return NextResponse.json(waste, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req) {
    const formData = await req.formData();
    const bin_id = formData.get('bin_id');
    const name = formData.get('name');
    const type = formData.get('type');
    const isDangerous = formData.get('isDangerous');
    const user_id = formData.get('user_id');
    const id = generateID();

    if (!bin_id || !name || !type || !isDangerous || !user_id) {
        return NextResponse.json({ error: "bin_id, name, type, isDangerous and user_id are required" }, { status: 400 });
    }

    try {
        const header = req.headers;
        const middleware = await authMiddleware(header);

        if (middleware.status !== 200)
            return NextResponse.json({ status: middleware.status, message: middleware.message });

        const query = parseInsertArray("wastes", { id, bin_id, name, type, isDangerous, user_id });
        await turso.batch(query, "write");

        return NextResponse.json({ message: "Waste created" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id_waste');

    if (!id) {
        return NextResponse.json({ error: 'id_waste is required' }, { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get('name');
    const type = formData.get('type');
    const isDangerous = formData.get('isDangerous');

    if (!name && !type && !isDangerous) {
        return NextResponse.json({ error: "name, type and isDangerous are required" }, { status: 400 });
    }

    try {
        const header = req.headers;
        const middleware = await authMiddleware(header);

        if (middleware.status !== 200)
            return NextResponse.json({ status: middleware.status, message: middleware.message });

        const query = parseUpdateArray("wastes", { name, type, isDangerous }, { id });
        await turso.batch(query, "write");

        return NextResponse.json({ message: "Waste updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id_waste');

    if (!id) {
        return NextResponse.json({ error: 'id_waste is required' }, { status: 400 });
    }

    try {
        const header = req.headers;
        const middleware = await authMiddleware(header);

        if (middleware.status !== 200)
            return NextResponse.json({ status: middleware.status, message: middleware.message });

        const queryBings = turso.execute({
            sql: `SELECT * FROM wastes WHERE id = ?`,
            args: [id]
        });

        const waste = await queryBings.rows[0];
        if (!waste) {
            return NextResponse.json({ error: 'No waste found' }, { status: 404 });
        }

        const query = turso.batch({
            sql: `DELETE FROM wastes WHERE id = ?`,
            args: [id]
        });
        await turso.batch(query, "write");

        return NextResponse.json({ message: "Waste deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}