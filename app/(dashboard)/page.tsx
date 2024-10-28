import { Button } from "@/components/ui/button"
import { authoptions } from "@/lib/authoptions"
import prisma from "@/lib/prismadb"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { TransactionsCard } from "./_components/TransactionsCard"
import Overview from "./_components/Overview"
import History from "./_components/History"


export default async function page(){
    const session = await getServerSession(authoptions)
    const user = session?.user
    !user && redirect("/api/auth/signin")

    const userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!userSettings) {
        redirect("/wizard")
    }

    return <div className=" h-full bg-background">
                <div className=" border-b bg-card">
                    <div className=" container mx-auto px-4 flex flex-wrap items-center justify-between gap-6 py-8">
                      <p className=" text-3xl font-bold ml-2">
                          hello, {user.name}! 🚀
                      </p>
                      <div className="flex items-center gap-3">
                        <TransactionsCard trigger={
                             <Button variant={"outline"}
                             className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white">
                                + income 💰
                             </Button>
                              } 
                            type="income"
                        />

                           
                        <TransactionsCard
                        trigger={
                            <Button variant={"outline"}
                            className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white">
                               + expense 💸
                            </Button>}
                             type="expense"
                            />
                      </div>
                    </div>
                    
                </div>
                <Overview userSettings={userSettings} />
                <History userSettings={userSettings} />
    </div>
}