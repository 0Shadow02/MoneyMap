import { authoptions } from "@/lib/authoptions";
import { GetFormatterForCurrency } from "@/lib/helpers";
import prisma from "@/lib/prismadb";
import { OverviewQuerySchema } from "@/zod/schema/overview";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const session = await getServerSession(authoptions)
    const user = session?.user;
    !user && redirect("api/auth/signin")

    const {searchParams} = new URL(request.url)
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const queryParams = OverviewQuerySchema.safeParse({
        from,
        to
    })

    if (!queryParams.success){
        return NextResponse.json(queryParams.error, {status: 400})
    }

    const transactions = await getTransactionsHistory(user.id, queryParams.data.from, queryParams.data.to)

    return NextResponse.json(transactions)
}

export type GetTransactionsHistoryResponseType = Awaited<ReturnType<typeof getTransactionsHistory>>;

async function getTransactionsHistory(userId: string, from: Date, to: Date){
    const userSettings = await prisma.userSettings.findUnique({
        where:{
            userId,
        },
    });
    if (!userSettings) {
        throw new Error("User settings not found")
    }

    const formatter = GetFormatterForCurrency(userSettings.currency)

    const transactions = await prisma.transaction.findMany({
        where:{
            userId,
            date:{
                gte: from,
                lte: to
            }
        },
        orderBy:{
            date: "desc"
        },
    })

    return transactions.map(transaction => ({
       ...transaction,
       formattedAmount: formatter.format(transaction.amount),
       
    }))
}