import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // correspond a n'importe quelle chemin qui ne contient pas  les chemins : api , _next/static , _next/image ou qui se termine par .png
  // ?! : negation : sauf si
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$).*)"],
};