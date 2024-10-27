"use client"

import { DeleteCategory } from "@/app/actions/server-actions/categories";
import { AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { TransactionType } from "@/lib/types";
import { Category } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { toast } from "sonner";

interface Props {
    trigger: ReactNode;
    category: Category;
}

export const DeleteCategoryDialog=({category , trigger}:Props)=> {
    const categoryIdentifier = `${category.name}-${category.type}`
    const queryClient = useQueryClient()
    const deleteMutation = useMutation({
        mutationFn: DeleteCategory,
        onSuccess: async ()=> {
            toast.success("Category deleted successfully",{
                id:categoryIdentifier
            })
            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            })
        },
        onError: () => {
            toast.error("Something went wrong" ,{
                id: categoryIdentifier
            })
        }

    })
    return <AlertDialog>
        <AlertDialogTrigger asChild>
            {trigger}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
            <AlertDescription>
                This action cannot be undone. This will permanently delete your category
            </AlertDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>{
                    toast.loading("Deleting category...",{
                        id: categoryIdentifier
                    })
                    deleteMutation.mutate({
                        name: category.name,
                        type: category.type as TransactionType
                    })
                }}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}
