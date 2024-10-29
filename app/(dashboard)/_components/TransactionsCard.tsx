"use client";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TransactionCardSchema } from "@/zod/schema/transactioncard";
import { ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "@/app/actions/server-actions/transactions";
import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helpers";

interface Props {
    trigger: ReactNode;
    type: TransactionType;
}

export const TransactionsCard = ({ trigger, type }: Props) => {
    const form = useForm<TransactionCardSchema>({
        resolver: zodResolver(TransactionCardSchema),
        defaultValues: {
            type,
            date: new Date(),
        }
    });
    const [isOpen, setIsOpen] = useState(false);

    const handleCategoryChange = useCallback((value: string) => {
        form.setValue("category", value);
    }, [form]);

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: CreateTransaction,
        onSuccess: () => {
            toast.success("Transaction created successfully 🎊", {
                id: "transaction-created",
            });
            form.reset({
                type,
                description: "",
                amount: 0,
                date: new Date(),
                category: undefined
            });

            queryClient.invalidateQueries({
                queryKey: ["overview"],
            });

            setIsOpen((prev: boolean) => !prev);
        },
    });

    const onSubmit = useCallback((values: TransactionCardSchema) => {
        toast.loading("Creating transaction...", {
            id: "transaction-created",
        });
        mutate({
            ...values,
            date: DateToUTCDate(values.date)
        });
    }, [mutate]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        Create a new <span className={cn("m-1", type === "income" ? "text-emerald-500" : "text-rose-500")}>{type}</span> transaction
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={""} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Transaction description (optional)
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={0} type="number" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Transaction amount (required)
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <CategoryPicker type={type} onChange={handleCategoryChange} />
                                        </FormControl>
                                        <FormDescription>
                                            Select a category for this transaction
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Transaction date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("w-full sm:w-[200px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? format(field.value, "PPP") : (<span>Select a date</span>)}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar mode="single" selected={field.value}
                                                    onSelect={(value) => {
                                                        if (!value) return;
                                                        field.onChange(value);
                                                    }} initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Select a date for this transaction
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant={"secondary"} onClick={() => {
                            form.reset();
                        }}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                        {!isPending && "Create"}
                        {isPending && <Loader2 className="animate-spin" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};