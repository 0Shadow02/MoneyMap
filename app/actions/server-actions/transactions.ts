"use server"

import { authoptions } from "@/lib/authoptions";
import prisma from "@/lib/prismadb";

import { TransactionCardSchema } from "@/zod/schema/transactioncard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: TransactionCardSchema) {
    const session = await getServerSession(authoptions)
    const user = session?.user;
    const parsedBody = TransactionCardSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error(parsedBody.error.message);
    }
    try {
        !user && redirect("api/auth/signin");
       const { amount, category, date, description, type } = parsedBody.data;
       const categoryRow = await prisma.category.findFirst({
              where:{
                userId: user.id,
                name: category,
              }
        }) 
        if(!categoryRow){
            throw new Error("Category not found")
        }

        await prisma.$transaction([
            prisma.transaction.create({
                data:{
                    userId: user.id,
                    amount,
                    date,
                    description :description || " ",
                    type,
                    category: categoryRow.name,
                    categoryIcon: categoryRow.icon,
                }
            }),
            prisma.monthHistory.upsert({
                where:{
                    day_month_year_userId:{
                        userId: user.id,
                        day: date.getUTCDate(),
                        month: date.getUTCMonth(),
                        year: date.getUTCFullYear()
                    }
                },
                create:{
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                    expense: type === "expense" ? amount : 0,
                    income: type === "income" ? amount : 0,
                },
                update:{
                   expense:{
                    increment: type === "expense" ? amount : 0,
                   },
                   income:{
                    increment: type === "income" ? amount : 0,
                },
            }
        }),


        prisma.yearHistory.upsert({
            where:{
                month_year_userId:{
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear()
                }
            },
            create:{
                userId: user.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "expense" ? amount : 0,
                income: type === "income" ? amount : 0,
            },
            update:{
               expense:{
                increment: type === "expense" ? amount : 0,
               },
               income:{
                increment: type === "income" ? amount : 0,
            },
        }
    })

        ])
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
   
}