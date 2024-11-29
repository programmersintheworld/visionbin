import jwt from "jsonwebtoken";
import { turso } from "./config";

export async function authMiddleware(header) {
    const headerArray = Array.from(header).find(([key]) => key === "authorization");
    if (!headerArray)
        return { status: 401, message: "Unauthorized" };
    const type = headerArray[1].split(" ")[0];
    const token = headerArray[1].split(" ")[1];
    if (type !== "Bearer" || !token)
        return { status: 401, message: "Unauthorized" };
    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!verify)
        return { status: 401, message: "Unauthorized" };
    const query = await turso.execute({
        sql: "SELECT * FROM users WHERE id = ?",
        args: [verify.id],
    });
    const user = query.rows[0];
    if (!user)
        return { status: 404, message: "User not found" };
    return { status: 200 };
}