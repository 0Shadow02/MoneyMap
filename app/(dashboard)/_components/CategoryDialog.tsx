"use client"

import { Button } from "@/components/ui/button"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TransactionType } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CategorySchema } from "@/zod/schema/categories"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog } from "@radix-ui/react-dialog"
import { CircleOff, Loader2, PlusSquare } from "lucide-react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import  Picker  from '@emoji-mart/react'
import data from "@emoji-mart/data"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateCategory } from "@/app/actions/server-actions/categories"
import { Category } from "@prisma/client"
import { toast } from "sonner"
import { useTheme } from "next-themes"


interface Props {
    type: TransactionType
    onSuccessCallback?:(category:Category)=>void
    trigger?: React.ReactNode
}

export default function  CategoryDialog({type , onSuccessCallback , trigger}:Props){
    const [isOpen, setIsOpen] = useState(false)
    const form = useForm<CategorySchema>({
        resolver: zodResolver(CategorySchema),
        defaultValues:{
            type,
        }
    });
    const queryClient = useQueryClient()
    const theme = useTheme();
    const {mutate , isPending} = useMutation({
        mutationFn: CreateCategory,
        onSuccess: async (data : Category) => {
            form.reset({
                name: "",
                icon: "",
                type,
            })
            toast.success(`Category ${data.name} created successfully 🎊`,{
                id:"category-created"
            })
            onSuccessCallback?.(data)

            await queryClient.invalidateQueries({
                queryKey:["categories"],
            })
            setIsOpen((prev)=>!prev)
        },
        onError:()=>{
            toast.error("An error occured while creating the category",{
                id:"category-created"
            })
        }

    })
    const onSubmit = useCallback((value: CategorySchema) => {
        toast.loading("Creating category...",{
            id:"category-created"
        })
        mutate(value)
    },[mutate]);

    return <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                   { trigger ? trigger: <Button variant={"ghost"}
                        role="combobox"
                        className="flex border-separate items-center justify-center rounded-none border-b px-3 py-3 text-muted-foreground"
                    >
                       <PlusSquare className=" mr-2 h-4 w-4" />
                        Create new 
                    </Button>}
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Create <span className={cn(
                                " m-1",
                                type === "income" ? "text-emerald-500" : "text-rose-500"
                            )}>
                                {type} 
                            </span>
                            category
                        </DialogTitle>
                        <DialogDescription>
                            Categories are used to group your transactions 
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                             render={({field})=>(
                                <FormItem>
                                   <FormLabel>Name</FormLabel>
                                     <FormControl>
                                            <Input placeholder="Category" {...field}>
                                            </Input>
                                     </FormControl>
                                     <FormDescription>
                                            This is how your category will be displayed
                                     </FormDescription>
                                </FormItem>
                              )}
                             />
                              <FormField
                                control={form.control}
                                name="icon"
                             render={({field})=>(
                                <FormItem>
                                    <FormLabel className="mr-2">Icon</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                  <Button variant={"outline"}
                                                  className=" h-[100px] w-full">
                                                    {form.watch("icon") ? (
                                                       <div className="flex flex-col items-center gap-2">
                                                        <span className=" text-5xl" role="img"> {field.value}</span>
                                                       <p className="text-xs text-muted-foreground">Click to change</p>
                                                   </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <CircleOff className="h-[48px] w-[48px]" />
                                                            <p className="text-xs text-muted-foreground">Click to select</p>
                                                        </div>
                                                    )}
                                                    
                                                    </Button>  
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full max-h-[50vh] md:max-h-[80vh] overflow-y-auto">
  <Picker
    data={data}
    theme={theme.resolvedTheme}
    onEmojiSelect={(emoji: { native: string }) => {
      field.onChange(emoji.native);
    }}
  />
</PopoverContent>
                                            </Popover>
                                        </FormControl>
                                    <FormDescription>
                                        This is hwo your category will be displayed
                                    </FormDescription>
                                    
                                </FormItem>
                            )}
                         />
                            </form>
                    </Form>
               
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant={"secondary"} onClick={()=>{
                            form.reset()
                        }} >Cancel</Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}> {!isPending && "Create" } 
                        {isPending && <Loader2 className=" animate-spin"></Loader2> } </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
     
}