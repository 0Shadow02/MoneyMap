"use client"

import { Period, Timeframe } from "@/lib/types";

interface Props {
    period: Period;
    setPeriod: (period: Period) => void;
    timeframe: Timeframe;
    setTimeframe: (timeframe: Timeframe) => void;
}

export default function HistoryPeriodSelector({ period, setPeriod, timeframe, setTimeframe }:Props) {

}