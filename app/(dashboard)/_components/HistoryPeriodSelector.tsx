"use client"

import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import Skeletonwrap from "@/components/Skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Period, Timeframe } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface Props {
    period: Period;
    setPeriod: (period: Period) => void;
    timeframe: Timeframe;
    setTimeframe: (timeframe: Timeframe) => void;
}

export default function HistoryPeriodSelector({ period, setPeriod, timeframe, setTimeframe }:Props) {
    const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
        queryKey: ["overview", "history" ,"periods"],
        queryFn: async () => {
            const response = await fetch("/api/history-periods")
            return response.json()
        }
    })
    return (
        <div className=" flex flex-wrap items-center gap-4">
            <Skeletonwrap isLoading={historyPeriods.isFetching} fullwidth={false} >
                <Tabs value={timeframe}
                      onValueChange={(value) => setTimeframe(value as Timeframe)}
                >
                    <TabsList>
                        <TabsTrigger value="year">Year</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                    </TabsList>
                </Tabs>
            </Skeletonwrap>
            <div className="flex flex-wrap items-center gap-2">
                <Skeletonwrap isLoading={historyPeriods.isFetching}  >
                   <YearSelector period={period} setPeriod={setPeriod} years={historyPeriods.data || []} />
                </Skeletonwrap>
                {timeframe === "month" && (
                    <Skeletonwrap isLoading={historyPeriods.isFetching} fullwidth={false}>
                        <MonthSelector period={period} setPeriod={setPeriod} />
                    </Skeletonwrap>
                )}
            </div>

        </div>
    )

}

function YearSelector({ period, setPeriod, years }: { period: Period; setPeriod: (period: Period) => void; years: GetHistoryPeriodsResponseType }) {
    return (
        <Select
            value={period.year.toString()}
           onValueChange={(value) =>{
            setPeriod({
                month: period.month,
                year: parseInt(value),
            })
           }} >
            <SelectTrigger className=" w-[180px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}


function MonthSelector({ period, setPeriod }: { period: Period; setPeriod: (period: Period) => void; }) {
    return (
        <Select
            value={period.month.toString()}
           onValueChange={(value) =>{
            setPeriod({
                year: period.year,
                month: parseInt(value),
            })
           }} >
            <SelectTrigger className=" w-[180px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {[0,1,2,3,4,5,6,7,8,9,10,11].map((month) => {
                    const monthStr = new Date(period.year,month ,1).toLocaleString("default", { month: "long" })

                    return (
                    <SelectItem key={month} value={month.toString()}>
                        {monthStr}
                    </SelectItem>
                )})}
            </SelectContent>
        </Select>
    )
}