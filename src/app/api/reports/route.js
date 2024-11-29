import { generateID } from "@/helpers/generateID";
import { NextResponse } from "next/server";
import { turso } from "@/helpers/config";
import { parseInsertArray } from "@/helpers/parseFunctions";
import { uploadImage } from "@/helpers/imgur";
import { authMiddleware } from "@/helpers/auth.middleware";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("user_id");
    if (!id) {
        return NextResponse.json({ message: "User is required" }, { status: 400 });
    }

    try {
        const query = await turso.execute({
            sql: "SELECT * FROM reports WHERE user_id = ?",
            args: [id],
        });
        const rows = query.rows;

        if (!rows) {
            return NextResponse.json({ message: "No reports found" }, { status: 404 });
        }

        return NextResponse.json({ reports: rows, message: "Reports found" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req) {
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const user_id = formData.get("user_id");
    // const image = formData.get("image");
    const location_long = formData.get("location_long");
    const location_lat = formData.get("location_lat");
    const created_at = new Date().toISOString();
    const status = "pending";
    const id = generateID();


    if (!title || !description || !user_id || !location_long || !location_lat) {
        return NextResponse.json({ message: "Title, description, user, location longitude, and location latitude are required" }, { status: 400 });
    }

    try {
        const header = req.headers;
        const middleware = await authMiddleware(header);

        if (middleware.status !== 200)
            return NextResponse.json({ status: middleware.status, message: middleware.message });

        // const extractBase64 = (dataUrl) => {
        //     const base64Pattern = /^data:image\/\w+;base64,/;
        //     if (base64Pattern.test(dataUrl)) {
        //         return dataUrl.split(',')[1];
        //     }
        //     return null;
        // };
        // const base64String = extractBase64(image);
        // // Subir la imagen a imgur
        // const upload = await uploadImage(base64String);
        // const image_url = upload.data.link;
        const queryInsert = parseInsertArray("reports", { id, title, description, user_id, image: null, location_long, location_lat, created_at, status });
        await turso.batch(queryInsert, "write");

        return NextResponse.json({ message: "Report created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    const searchParams = new URLSearchParams(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ message: "Report is required" }, { status: 400 });
    }

    try {
        const header = req.headers;
        const middleware = await authMiddleware(header);

        if (middleware.status !== 200)
            return NextResponse.json({ status: middleware.status, message: middleware.message });

        const query = await turso.execute({
            sql: "DELETE FROM reports WHERE id = ?",
            args: [id],
        });

        if (query.affectedRows === 0) {
            return NextResponse.json({ message: "Report not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Report deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}