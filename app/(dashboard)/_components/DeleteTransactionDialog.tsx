"use client"
import { DeleteTransaction } from "@/app/actions/server-actions/DeleteTransaction";
import { AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    transactionId: string;
}

export default function DeleteTransactionDialog({ open, setOpen, transactionId }: Props) {
    
    const queryClient = useQueryClient()
    const deleteMutation = useMutation({
        mutationFn: DeleteTransaction,
        onSuccess: async ()=> {
            toast.success("Transactions deleted successfully",{
                id:transactionId
            })
            await queryClient.invalidateQueries({
                queryKey: ["transactions"],
            })
        },
        onError: () => {
            toast.error("Something went wrong" ,{
                id: transactionId
            })
        }

    })
    return <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
            <AlertDescription>
                This action cannot be undone. This will permanently delete your transaction
            </AlertDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>{
                    toast.loading("Deleting transaction...",{
                        id: transactionId
                    })
                    deleteMutation.mutate(transactionId)
                }}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}