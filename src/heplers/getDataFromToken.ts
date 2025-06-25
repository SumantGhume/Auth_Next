import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define expected structure of your token payload
interface TokenPayload extends JwtPayload {
  id: string;
}

export const getDataFromToken = (request: NextRequest): string | null => {
  try {
    const token = request.cookies.get("token")?.value || '';
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenPayload;

    return decodedToken.id;
  } catch {
    return null;
  }
};
