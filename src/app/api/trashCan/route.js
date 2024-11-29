import { turso } from "@/helpers/config";
import { generateID } from "@/helpers/generateID";
import { parseInsertArray, parseUpdateArray } from "@/helpers/parseFunctions";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/helpers/auth.middleware";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id_user');

    if (!id) {
        return NextResponse.json({ error: 'id_user is required' }, { status: 400 });
    }

    try {
        const query = turso.execute({
            sql: `SELECT * FROM bins WHERE user_id = ?`,
            args: [id]
        });
        const bins = await query.rows;

        if (!bins) {
            return NextResponse.json({ error: 'No bins found' }, { status: 404 });
        }

        return NextResponse.json(bins, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req) {
    const formData = await req.formData();
    const user_id = formData.get('user_id');
    const name = formData.get('name');
    const id = generateID();

    if (!user_id || !name) {
        return NextResponse.json({ error: "user_id and name are required" }, { status: 400 });
    }

    try {
        const header = req.headers;
        const middleware = await authMiddleware(header);

        if (middleware.status !== 200)
            return NextResponse.json({ status: middleware.status, message: middleware.message });

        const query = parseInsertArray("bins", { id, user_id, name });
        await turso.batch(query, "write");

        return NextResponse.json({ message: "Bin created" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id_bin');

    if (!id) {
        return NextResponse.json({ error: 'id_bin is required' }, { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get('name');

    if (!name) {
        return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    try {
        const header = req.headers;
        const middleware = await authMiddleware(header);

        if (middleware.status !== 200)
            return NextResponse.json({ status: middleware.status, message: middleware.message });

        const query = parseUpdateArray("bins", { name }, { value: id, index: "id" });
        await turso.batch(query, "write");

        return NextResponse.json({ message: 'Bin updated' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id_bin');

    if (!id) {
        return NextResponse.json({ error: 'id_bin is required' }, { status: 400 });
    }

    try {
        const query = await turso.execute({
            sql: `SELECT * FROM bins WHERE id = ?`,
            args: [id]
        });
        const bin = await query.rows;
        if (!bin) {
            return NextResponse.json({ error: 'Bin not found' }, { status: 404 });
        }

        await turso.batch({
            sql: `DELETE FROM bins WHERE id = ?`,
            args: [id]
        }, "write");

        return NextResponse.json({ message: 'Bin deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}