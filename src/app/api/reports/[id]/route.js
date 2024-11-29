import { NextResponse } from "next/server";
import { turso } from "@/helpers/config";

export async function GET(req, { params }) {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ message: "Report ID is required" }, { status: 400 });
    }

    try {
        const query = await turso.execute({
            sql: "SELECT * FROM reports WHERE id = ?",
            args: [id],
        });
        const rows = query.rows[0];

        if (!rows) {
            return NextResponse.json({ message: "Report not found" }, { status: 404 });
        }

        return NextResponse.json({ report: rows, message: "Report found" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}