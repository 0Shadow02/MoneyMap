"use client"
import { usePathname } from "next/navigation"
import { Logo } from "./logo"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "./ui/button"
import { Avatar } from "./Avatar"
import { ThemeSwitcherBtn } from "./ThemeSwitcherBtn"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Menu } from "lucide-react"
import { signOut } from "next-auth/react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export default function(){
    return <>
       <DesktopNavbar/>
       <MobileNavbar/>
    </>
}

const items = [
    {label :"Dashboard" , link:"/"},
    {label :"Transactions" , link:"/transactions"},
    {label :"Manage" , link:"/manage"},
]

function MobileNavbar(){
    const [isOpen , setIsOpen] = useState(false)
    
    return <div className="block border-separate bg-background md:hidden">
        <nav className=" container flex items-center justify-between px-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild >
                    <Button variant={"ghost"} size={"icon"}>
                        <Menu/>
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-[280px] sm:w-[640px]" side="left">
                    <Logo/>
                    <div className=" flex flex-col gap-1 pt-4">
                        {items.map(item=> <NavbarItem
                            clickCallback={()=> setIsOpen((prev)=>!prev)}
                            key={item.label}
                            link={item.link}
                            label={item.label}
                        />)}
                    </div>
                </SheetContent>
            </Sheet>
            <div className=" flex h-[80px] min-h-[60px] items-center gap-x-4">
                <Logo />
              
            </div>
            <div className="flex items-center gap-2">
               <ThemeSwitcherBtn />
               <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                    <Avatar />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-18 flex justify-center items-center top-full mt-2 mr-2 shadow-lg rounded">
                    <Button onClick={() => signOut()} size="sm" type="button" variant="default">
                    Signout
                    </Button>
                </PopoverContent>
                </Popover>
            </div>
        </nav>
    </div>

}

function DesktopNavbar() {
    return (
        <div className="hidden border-separate border-b bg-background md:block lg:block ">
            <nav className="w-full container flex justify-between items-center px-8 h-[65px] min-h-[60px]">
                <Logo/>
               <div className=" flex h-full">
               {items.map((item)=> (
                <NavbarItem
                key={item.label}
                link={item.link}
                label={item.label}
                />
            ))}
               </div>
               <div  className=" flex items-center gap-5" >
               <ThemeSwitcherBtn />
                    <Avatar/>
               <Button  onClick={()=>signOut()} size={"sm"} type="button" variant={"default"} >
                Signout
               </Button>
               </div>
            </nav>

        </div>
    )
}


const NavbarItem=({link , label , clickCallback}:{
    link: string;
    label: string;
    clickCallback? : () => void
})=>{
    const pathname = usePathname();
    const isActive = pathname === link;

    return <div className=" relative flex items-center">
        <Link href={link} className={cn(
         buttonVariants({
            variant:"ghost"
         }),
         "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
         isActive && "text-foreground"
        )}
        onClick={()=>{
            if(clickCallback) clickCallback()
        }}
        >
          {label}
        </Link>
        {
            isActive && (
                <div className=" absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block">

                </div>
            )
        }
    </div>

}