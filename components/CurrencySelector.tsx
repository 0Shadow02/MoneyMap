"use client"

import * as React from "react"
import axios from "axios"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Currencies, Currency } from "@/lib/currency"
import { useMutation, useQuery } from "@tanstack/react-query"
import Skeletonwrap from "./Skeleton"
import { User, UserSettings } from "@prisma/client"
import { set } from "date-fns"
import { UpdateUserCurrency } from "@/app/actions/server-actions/userSettings"
import { toast } from "sonner"


const fetchuserSettings = async () => {
  const response = await axios.get("/api/user_settings")
  return response.data
}

export function CurrencySelector() {
   
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
    null
  )

  const userSettings = useQuery<UserSettings>({
      queryKey: ["userSettings"],
      queryFn: fetchuserSettings
})
 React.useEffect(() => { 
    if(!userSettings.data) return ;
    const userCurrency = Currencies.find((currency) => currency.value === userSettings.data.currency);
    if (userCurrency) setSelectedOption(userCurrency)
      
    
 } , [userSettings.data])
 const mutation = useMutation({
  mutationFn: UpdateUserCurrency,
  onSuccess: (data:UserSettings) => {
    toast.success("Currency updated successfully",{
      id:"update-currency",
    })
  setSelectedOption(
    Currencies.find((currency) => currency.value === data.currency) || null
  )
  },
  onError: (error:any) => {
    toast.error("Failed to update currency",{
      id:"update-currency"
    })
  }
 })

 const selectOption = React.useCallback( (currency: Currency | null) =>{
  if (!currency) {
    toast.error("Please select a currency")
    return;
  }
  toast.loading("Updating currency...",{
    id:"update-currency"
  })
  mutation.mutate(currency.value)
 },[mutation])
  if (isDesktop) {
    return (
    <Skeletonwrap isLoading={userSettings.isFetching} >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
            {selectedOption ? <>{selectedOption.label}</> : <>
            Set currency </>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Optionlist setOpen={setOpen} setSelectedOption={selectOption} />
        </PopoverContent>
      </Popover>
     </Skeletonwrap>
    )
  }

  return (
    
  <Skeletonwrap isLoading={userSettings.isFetching} >
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
          {selectedOption ? <>{selectedOption.label}</> : <> Set currency</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <Optionlist setOpen={setOpen} setSelectedOption={selectOption} />
        </div>
      </DrawerContent>
    </Drawer>
  </Skeletonwrap>
  )
}

function Optionlist({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void
  setSelectedOption: (status: Currency | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency:Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(
                  Currencies.find((priority) => priority.value === value) || null
                )
                setOpen(false)
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
