import { authoptions } from "@/lib/authoptions";
import prisma from "@/lib/prismadb";
import { OverviewQuerySchema } from "@/zod/schema/overview";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest,) {
   const session = await getServerSession(authoptions)
   const user = session?.user
   !user && redirect("/api/auth/signin")


   const {searchParams} = new URL(req.url)
   const from = searchParams.get("from")
   const to = searchParams.get("to")

   const queryParams = OverviewQuerySchema.safeParse({from, to})
   if (!queryParams.success) {
       throw new Error(queryParams.error.message)
   }
   const stats = await getCategoriesStats(
         user.id,
         queryParams.data.from,
         queryParams.data.to
   )
   return NextResponse.json(stats)  
}

export type getCategoriesStatsResponseType = Awaited<ReturnType<typeof getCategoriesStats>>
async function getCategoriesStats(userId:string, from:Date, to:Date){
    const stats = await prisma.transaction.groupBy({
        by:["type", "category","categoryIcon"],
        where:{
            userId,
            date:{
                gte: from,
                lte: to
            }
        },
        _sum:{
            amount: true
        },
        orderBy:{
            _sum:{
                amount: "desc"
            }
        }
    })

    return stats
}