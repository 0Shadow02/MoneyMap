import { cn } from "@/lib/utils"
import { Skeleton } from "./ui/skeleton"

export default function Skeletonwrap({
    children,
    isLoading,
    fullwidth = true,
}:{
    children: React.ReactNode,
    isLoading: boolean,
    fullwidth?: boolean,
}) {
    if (!isLoading) {
        return children

    }
    return (
        <Skeleton className={cn(fullwidth && "w-full")}>
            <div className=" opacity-0">
                {children}
            </div>
        </Skeleton>
    )

}
