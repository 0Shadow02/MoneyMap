import { authoptions } from "@/lib/authoptions";
import prisma from "@/lib/prismadb";
import { OverviewQuerySchema } from "@/zod/schema/overview";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
     const session = await getServerSession(authoptions)
     const user = session?.user

     !user && redirect("/api/auth/signin")

     const {searchParams} = new URL(request.url)
     const from = searchParams.get("from")
     const to = searchParams.get("to")

     const queryParams = OverviewQuerySchema.safeParse({from, to})

     if (!queryParams.success) {
         return NextResponse.json( { errors: queryParams.error.errors }, {status:400})
        
     }
     const stats = await getBalanceStats(
            user.id,
            queryParams.data.from,
            queryParams.data.to
     )
     return NextResponse.json(stats)

}

export type getBalanceStatsResponseType = Awaited<ReturnType<typeof getBalanceStats>>

async function getBalanceStats(userId:string, from:Date, to:Date){
    const totals = await prisma.transaction.groupBy({
        by: ["type"],
        where:{
            userId,
            date:{
                gte: from,
                lte: to
            },
        },                                   
        _sum:{
            amount: true,
        }
    })

    return {
        expense: totals.find(t=>t.type === "expense")?._sum.amount || 0,
        income: totals.find(t=>t.type === "income")?._sum.amount || 0,
      }
}