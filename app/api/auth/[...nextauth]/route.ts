import { authoptions } from "@/lib/authoptions"
import NextAuth from "next-auth"
const handler = NextAuth(authoptions)

export { handler as GET , handler as POST } 