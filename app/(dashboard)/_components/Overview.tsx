"use client"

import { UserSettings } from "@prisma/client"
import { useState } from "react";

export default function Overview({userSettings}:{userSettings:UserSettings}) {
    const [dateRange, setDateRange] = useState<{from:Date; to :Date}>({
        from: new Date(),
        to: new Date()
    })
    return <div>
        <h1>Overview</h1>
    </div>
}