import {Cat} from "lucide-react"
import Link from "next/link"
export const Logo=()=>{
    return <Link href={"/"} className="flex items-center gap-2">
     <Cat className=" str" />
    </Link>
}