import { authoptions } from "@/lib/authoptions";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request:NextRequest){
    const session = await getServerSession(authoptions)
    const user = session?.user
    !user && redirect("/api/auth/signin")

    const { searchParams } = new URL(request.url);
    const paramType= searchParams.get("type");

    const validator = z.enum(["income","expense"]);
    const queryParam = validator.safeParse(paramType);
    if(!queryParam.success){
        return NextResponse.json(queryParam.error, {status:400})
    }
    const type = queryParam.data;
    const categories = await prisma.category.findMany({
        where:{
            userId: user.id,
            ...(type && {type}),
        },
        orderBy:{
            name:"asc"
        }
    });
    return NextResponse.json(categories)
}