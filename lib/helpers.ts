import { Currencies } from "./currency"

export function DateToUTCDate(date:Date){
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds()

    )
}

export function GetFormatterForCurrency(currency:string){
    const locale = Currencies.find((c)=> c.value === currency)?.locale 

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency
    })
}