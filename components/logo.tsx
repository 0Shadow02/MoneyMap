import {Snail} from "lucide-react"
import Link from "next/link"
export const Logo=()=>{
    return <Link href={"/"} className="flex items-center gap-2">
     <Snail className="stroke h-10 w-10 stroke-emerald-400 stroke-[1.5]" />
     <p className=" bg-gradient-to-r from-emerald-500 to-emerald-900 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">MoneyMap</p>
    </Link>
}
export const LogoMobile=()=>{
    return <Link href={"/"} className="flex items-center gap-2">
     <p className=" bg-gradient-to-r from-emerald-500 to-emerald-900 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">MoneyMap</p>
    </Link>
}