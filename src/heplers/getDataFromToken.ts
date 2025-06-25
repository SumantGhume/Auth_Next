import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest): string | null => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN!) as JwtPayload;
    return decodedToken.id as string;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};
