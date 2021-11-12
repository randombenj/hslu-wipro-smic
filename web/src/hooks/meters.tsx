import useFetch, { CachePolicies } from "use-http";
import { Measurement } from "../model/Measurement";
import { Meter } from "../model/Meter";
import { DateTime, ToISOTimeOptions } from 'luxon'

export function useGetMeasurements(meterId: number, startDate: DateTime | null, endDate: DateTime | null, refetchIndex:number) {
    const toIsoOptions: ToISOTimeOptions = { suppressMilliseconds: true, includeOffset: false };
    let request = `/meters/${meterId}/measurements`;
    if (startDate) {
        request += `?start_date=${startDate.toISO(toIsoOptions)}`;
    }
    if (endDate) {
        request += `&end_date=${endDate.toISO(toIsoOptions)}`;
    }

    return useFetch<Measurement[]>(request, {
        method: "GET",
        cachePolicy: CachePolicies.NETWORK_ONLY,
    }, [meterId, startDate, endDate, refetchIndex]);

}

export function useGetMeters(refetchIndex:number) {
    return useFetch<Meter[]>(`/meters`, { method: "GET" }, [refetchIndex]);
}