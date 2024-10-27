import { Currencies } from '@/lib/currency';
import { z } from 'zod';
export const UpdatedUserSchema = z.object({
    currency: z.custom((value) => {
        const found = Currencies.find((currency) => currency.value === value);
        if (!found) throw new Error(`Invalid currency: ${value}`);
        return value;
     })
 })