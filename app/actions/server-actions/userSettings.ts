"use server"

import { authoptions } from "@/lib/authoptions";
import prisma from "@/lib/prismadb";
import { UpdatedUserSchema } from "@/zod/schema/userSettings"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function UpdateUserCurrency(currency:string){
    const session = await getServerSession(authoptions);
    const user = session?.user;
    const parsedBody = UpdatedUserSchema.safeParse({currency})
    if(!parsedBody.success) throw parsedBody.error;

    try {
        if (!user) redirect("/api/auth/signin");
        const userSettings = await prisma.userSettings.update({
            where:{
                userId: user.id
            },
            data:{
                currency: parsedBody.data.currency
                
            }
        })
        return userSettings;
    } catch (error:any) {
        throw error;
        
    }
  
}