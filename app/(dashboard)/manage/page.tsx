"use client"
import { CurrencySelector } from "@/components/CurrencySelector"
import Skeletonwrap from "@/components/Skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { PlusSquare, TrashIcon, TrendingDown } from "lucide-react"
import CategoryDialog from "../_components/CategoryDialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Category } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { DeleteCategoryDialog } from "../_components/DeleteCategoryDialog"

export default function Page() {
    
    
    return (
        <>
        <div className="flex flex-col w-full h-full">
        {/* <div className=" border-b bg-card"> */}
            <div className="container flex flex-wrap items-center justify-between gap-6 p-8">
                <div className="container">
                    <p className="text-3xl font-bold">Manage</p>
                    <p className=" text-muted-foreground">Manage your account settings and categories</p>
                </div>

            </div>
            {/* <div className="container flex flex-wrap items-center justify-between gap-6 py-8"> */}
            <div className=" container mx-auto px-2 flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Currency 
                        </CardTitle>
                        <CardDescription>
                            Set your default currency for transactions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <CurrencySelector/>
                    </CardContent>
                </Card>
                <CategoryList type="income" />
                <CategoryList type="expense" />
            </div>
        </div>
        </>
    )
}

function CategoryList({type}: {type: "income" | "expense"}) {
    const categoriesQuery = useQuery({
        queryKey: ["categories", type],
        queryFn: async () => {
            const res = await fetch(`/api/categories?type=${type}`)
            return res.json()
        }
    })

    const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0 

    return (
        <Skeletonwrap isLoading={categoriesQuery.isLoading}>
            <Card>
                <CardHeader>
                    <CardTitle className=" flex flex-wrap items-center justify-between gap-2">
                        <div className=" flex items-center gap-2">
                            {type === "expense" ? <TrendingDown className=" h-12 w-12 items-center rounded-lg bg-red-400/10 text-red-500 " /> : <TrendingDown className=" h-12 w-12 items-center rounded-lg bg-green-400/10 text-green-500 " />}
                            <div>
                           {type === "income" ? "Income" : "Expense"} caegories
                           <div className=" text-sm text-muted-foreground">
                            Sorted by name 
                           </div>
                        </div>
                        </div>
                      
                        <CategoryDialog type={type} onSuccessCallback={()=>categoriesQuery.refetch()}
                          trigger={
                            <Button
                             className="gap-2 text-sm"
                            >
                             <PlusSquare className=" h-4 w-4" />
                                Create category
                            </Button>
                          }
                        />

                    </CardTitle>
                </CardHeader>
                <Separator />
                {
                    !dataAvailable && (
                        <div className=" flex h-40 w-full flex-col items-center justify-center">
                            <p>
                                No <span className={cn(
                                    "m-1",
                                    type === "income" ? "text-emerald-500" : "text-red-500"
                                )}>
                                    {type}
                                </span>
                                categories yet
                            </p>
                            <p className=" text-sm text-muted-foreground">
                                Create one target started
                            </p>
                        </div>
                    )}
                    {dataAvailable && (
                        <div className=" grid grid-flow-row gap-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {categoriesQuery.data.map((category:Category)=>(
                                <CategoryCard category={category} key={category.name}/>
                            ))}

                        </div>
                    )}
            </Card>
        </Skeletonwrap>
    )
}

function CategoryCard({category}: {category: Category}) {
    return (
        <div className="flex border-separate flex-col justify-center rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
            <div className="flex flex-col items-center gap-2 p-4">
                <span className="text-3xl" role="img">
                    {category.icon}
                </span>
                <span>{category.name}</span>
            </div>
            <DeleteCategoryDialog category={category} trigger={<Button className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20" variant={"secondary"} >
                <TrashIcon className=" h-4 w-4" />
                Remove
            </Button>
           }  />
            
        </div>
    )
}