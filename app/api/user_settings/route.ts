import { authoptions } from "@/lib/authoptions";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
        const session = await getServerSession(authoptions)
        const user = session?.user
        !user && redirect("/api/auth/signin")
        try {
            const userSettings = await prisma.userSettings.upsert({
                where:{
                    userId: user.id
                },
                create:{
                    userId: user.id,
                    currency: "usd"
                },
                update:{}
                
            })
            revalidatePath("/")
            return NextResponse.json(userSettings)
        } catch (error:any) {
            return NextResponse.json({error:error.message})
        }

}