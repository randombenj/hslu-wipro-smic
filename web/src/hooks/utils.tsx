
import { DateTime, ToISOTimeOptions } from 'luxon'
const toIsoOptions: ToISOTimeOptions = { suppressMilliseconds: true, includeOffset: false };

export default function formatDate(date: DateTime): string {
    return date.toISO(toIsoOptions);
}