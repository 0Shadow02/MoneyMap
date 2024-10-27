"use server"

import { authoptions } from "@/lib/authoptions";
import prisma from "@/lib/prismadb";
import { CategorySchema, DeleteCategorySchema, DeleteCategorySchemaType } from "@/zod/schema/categories";
import { UpdatedUserSchema } from "@/zod/schema/userSettings"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function CreateCategory(form:CategorySchema){
    const session = await getServerSession(authoptions);
    const user = session?.user;
    const parsedBody = CategorySchema.safeParse(form)
    if(!parsedBody.success) throw new Error("bad request");

    try {
        if (!user) redirect("/api/auth/signin");
        const {name, icon, type} = parsedBody.data;
        return await prisma.category.create({ 
            data:{
                userId: user.id,
                name,
                icon,
                type,
            }
        })
       
    } catch (error:any) {
        throw error;
        
    }
  
}

export async function DeleteCategory(form:DeleteCategorySchemaType){
    const session = await getServerSession(authoptions);
    const user = session?.user;
    const parsedBody = DeleteCategorySchema.safeParse(form)
    if(!parsedBody.success) throw new Error("bad request")
      

  try {
      if (!user) redirect("/api/auth/signin");
      const categories = await prisma.category.delete({
        where:{
            name_userId_type:{
                userId: user.id ,
                name: parsedBody.data.name,
                type: parsedBody.data.type
            }
        }
      })
  } catch (error) {
    throw error;
  }

}