"use server"

import { authoptions } from "@/lib/authoptions"
import prisma from "@/lib/prismadb"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export async function DeleteTransaction(id: string) {
    const session = await getServerSession(authoptions)
    const user = session?.user
    !user && redirect("/api/auth/signin")

    const transaction = await prisma.transaction.findUnique({
        where: {
            userId: user.id,
            id,
        }
    })
    if (!transaction) {
        throw new Error("bad request")
        
    }
    await prisma.$transaction([
        prisma.transaction.delete({
            where: {
                id,
                userId: user.id,
            }
        }),
        prisma.monthHistory.update({
            where: {
                day_month_year_userId: {
                    userId: user.id,
                    day: transaction.date.getUTCDate(),
                    month: transaction.date.getUTCMonth(),
                    year: transaction.date.getUTCFullYear()
                }
            },
            data: {
               ...(transaction.type === "expense" && {
                expense:{
                    decrement: transaction.amount
                }
               }),
                ...(transaction.type === "income" && {
                 income:{
                      decrement: transaction.amount
                 }
                })
            }
        }),
        prisma.yearHistory.update({
            where: {
                month_year_userId: {
                    userId: user.id,
                    month: transaction.date.getUTCMonth(),
                    year: transaction.date.getUTCFullYear()
                }
            },
            data: {
               ...(transaction.type === "expense" && {
                expense:{
                    decrement: transaction.amount
                }
               }),
                ...(transaction.type === "income" && {
                 income:{
                      decrement: transaction.amount
                 }
                })
            }
        })
    ])
}