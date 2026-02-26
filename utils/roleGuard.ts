import jwt from "jsonwebtoken";
import { headers } from "next/headers";

export async function requireRole(roles: string[]) {
  const headerList = await headers();
  const authHeader = headerList.get("authorization");

  if (!authHeader) {
    return { error: "No token", status: 401 };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    if (!roles.includes(decoded.role)) {
      return { error: "Forbidden", status: 403 };
    }

    return { user: decoded };
  } catch {
    return { error: "Invalid token", status: 401 };
  }
}
