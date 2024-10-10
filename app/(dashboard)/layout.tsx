import Navbar from "@/components/Navbar"

export default function RootProviders({children}:{children:React.ReactNode}){
    return <div className=" relative flex h-screen w-full flex-col">
        <Navbar/>
        <div 
         className="w-full"
        >
        {children}
        </div>
    </div>
}