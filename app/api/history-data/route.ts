import { authoptions } from "@/lib/authoptions";
import prisma from "@/lib/prismadb";
import { Period, Timeframe } from "@/lib/types";
import { getDaysInMonth } from "date-fns";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const getHistoryPeriodsSchema = z.object({
    timeframe: z.enum(["year", "month"]),
    month: z.coerce.number().min(0).max(11).default(0),
    year: z.coerce.number().min(2000).max(3000)
})

export async function GET(request: NextRequest) {
    const session = await getServerSession(authoptions)
    const user = session?.user
    !user && redirect("/api/auth/signin")

    const {searchParams} = new URL(request.url)
    const timeframe = searchParams.get("timeframe") 
    const year = searchParams.get("year")
    const month = searchParams.get("month")

    const queryParams = getHistoryPeriodsSchema.safeParse({
        timeframe,
        year,
        month
    })

    if(!queryParams.success){
        return NextResponse.json(queryParams.error.message, {status:400})
    
    }
   const data = await getHistoryData(user.id, queryParams.data.timeframe , {
         year: queryParams.data.year,
         month: queryParams.data.month
   })

   return NextResponse.json(data)
}



export type GetHistoryPeriodsResponseType = Awaited<ReturnType<typeof getHistoryData>>

async function getHistoryData( userId: string , timeframe:Timeframe , period: Period){
    switch (timeframe) {
        case "year":
            return await getYearHistoryData(userId, period.year)
        case "month":
            return await getMonthHistoryData(userId, period.year, period.month)
       
    }
}

type HistoryData ={
    expense: number;
    income: number;
    month: number;
    year: number;
    day?: number;
}

async function getYearHistoryData(userId: string, year: number) {
    const result = await prisma.yearHistory.groupBy({
        by: ["month"],
        where: {
            userId,
            year
        },
        _sum:{
            income: true,
            expense: true
        },
        orderBy: [
            {
                month: "asc"
            }
        ]
    })

    if (!result || result.length === 0) {
        return []
        
    }
    
    const history:HistoryData[] = [];

    for (let i = 0; i < 12; i++) {
        let expense = 0;
        let income = 0;

        const month = result.find((row)=> row.month === i)
        if(month){
            expense = month._sum.expense || 0
            income = month._sum.income || 0
        }
        
        history.push({
            month: i,
            year,
            expense,
            income
        })
    }
    return history;
}

async function getMonthHistoryData(userId: string, year: number, month: number) {
    const result = await prisma.monthHistory.groupBy({
        by: ["day"],
        where: {
            userId,
            year,
            month
        },
        _sum: {
            income: true,
            expense: true
        },
        orderBy: [
            {
                day: "asc"
            }
        ]
    })

    if (!result || result.length === 0) {
        return []
    }
   
    const history: HistoryData[] = [];

    const daysInMonth = getDaysInMonth(new Date(year, month))
    
    for (let i = 1; i <= daysInMonth; i++) {
        let expense = 0;
        let income = 0;

        const day = result.find((row) => row.day === i)
        if (day) {
            expense = day._sum.expense || 0
            income = day._sum.income || 0
        }

        history.push({
            month,
            year,
            day: i,
            expense,
            income
        })
    }
    return history;

}