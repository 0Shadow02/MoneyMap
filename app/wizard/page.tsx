import { CurrencySelector } from "@/components/CurrencySelector";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authoptions } from "@/lib/authoptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function page(){
    const session = await getServerSession(authoptions)
    const user = session?.user
    !user && redirect("/api/auth/signin")
    return <div className=" container flex max-w-2xl flex-col items-center justify-center gap-4">
        <div>

        <h1 className=" text-center text-3xl">
            Welcome, <span className=" ml-2 font-bold">
                {user.name} („• ֊ •„)
            </span> 
            </h1>
            <h2 className=" mt-4 text-center text-base text-muted-foreground">
            Ready to roll? Let&apos;s set up your currency and get things moving!
            </h2>
            <h3 className=" mt-2 text-center text-sm text-muted-foreground">
             You can always change your currency later in settings.
            </h3>
       
        </div>
            <Separator/>
        <Card className=" w-full">
            <CardHeader>
                <CardTitle>
                    Currency
                </CardTitle>
                <CardDescription>
                    Select your preferred currency for your account.
                </CardDescription>

            </CardHeader>
            <CardContent>
                <CurrencySelector/>
            </CardContent>
        </Card>
        <Separator/>
        <Button className=" w-full" asChild>
        <Link href={"/"}>All set! Let&apos;s go to the dashboard</Link>
        </Button>
        <div className=" mt-8">
            <Logo />
        </div>
    </div>
}


