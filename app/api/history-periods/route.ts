import { authoptions } from "@/lib/authoptions";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    const session = await getServerSession(authoptions)
    const user = session?.user
    !user && redirect("/api/auth/signin")

    const periods = await getHistoryPeriods(user.id);
    return NextResponse.json(periods);

   
}

export type GetHistoryPeriodsResponseType= Awaited<ReturnType<typeof getHistoryPeriods>>

async function getHistoryPeriods(userId:string){
    const result = await prisma.monthHistory.findMany({
        where: {
            userId,
        },
        select: {
            year: true,
        },
        distinct: ["year"],
        orderBy:[
            {
                year: "asc",
            }
        ]
    })
    const years = result.map((r)=>r.year)
    if(years.length===0){
        return [new Date().getFullYear()]
    }
    return years;
}