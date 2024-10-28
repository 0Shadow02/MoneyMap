"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TransactionType } from "@/lib/types"
import { Category } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"
import CategoryDialog from "./CategoryDialog"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"


interface Props {
    type: TransactionType
    onChange: (value: string) => void;
}

export default function CategoryPicker({type , onChange}:Props){
    const [isOpen, setIsOpen] = useState(false)
    const [value, setValue] = useState("")

    useEffect(()=>{
        if(!value) return;
        onChange(value);
    },[onChange,value])
    const categoriesQuery = useQuery<Category[]>({
     queryKey: ["categories",type],
        queryFn: async () => {
           const res = await fetch(`/api/categories?type=${type}`);
           return res.json();
        }
    })

    const selectedCategory = categoriesQuery.data?.find((category: Category) => category.name === value);

    const successCallback = useCallback( (category:Category) => {
        setValue(category.name)
        setIsOpen((prev)=>!prev)
    },[setValue , setIsOpen])
    return <Popover open={isOpen} onOpenChange={setIsOpen}> 
            <PopoverTrigger asChild>
                <Button variant={"outline"}
                    role="combobox"
                    aria-expanded={isOpen}
                    className="w-[200px] justify-between"
                >
                    {selectedCategory? (
                        <CategoryRow category={selectedCategory} />
                    ):(
                        "Select a category"
                    )}
                <ChevronsUpDown className=" ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command onSubmit={e =>{e.preventDefault()}}>
                    <CommandInput placeholder="Search category..." />
                    <CategoryDialog type={type}  onSuccessCallback={successCallback}/>
                    <CommandEmpty>
                        <p>
                            No categories found
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Tip: Create a new category
                        </p>
                    </CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {
                                categoriesQuery.data?.map((category: Category) => (
                                    <CommandItem 
                                        key={category.name}
                                        onSelect={()=>{
                                            setValue(category.name)
                                            setIsOpen((prev)=>!prev)
                                        }}
                                    >
                                       <CategoryRow category={category} />
                                       <Check className={cn("mr-2 w-4 h-4 opacity-0", value === category.name && "opacity-100")} />
                                    </CommandItem>
                                ))
                            }
                        </CommandList>
                    </CommandGroup>
                </Command>

            </PopoverContent>
    </Popover>
     
}

 function CategoryRow({category}: {category: Category}){
    return <div className="flex items-center  gap-2">
        <span role="img">{category.icon}</span>
        <span>{category.name}</span>
    </div>
}