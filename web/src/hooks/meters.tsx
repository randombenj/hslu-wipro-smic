import { DateTime } from "luxon";
import useFetch, { CachePolicies } from "use-http";
import { Measurement } from "../model/Measurement";
import { Meter } from "../model/Meter";
import formatDate from "./utils";

export function useGetMeasurements(meterId: number, startDate: DateTime | null, endDate: DateTime | null, refetchIndex: number) {
    let request = `/meters/${meterId}/measurements`;
    if (startDate) {
        request += `?start_date=${formatDate(startDate)}`;
    }
    if (endDate) {
        request += `&end_date=${formatDate(endDate)}`;
    }

    return useFetch<Measurement[]>(request, {
        method: "GET",
        cachePolicy: CachePolicies.NETWORK_ONLY,
    }, [meterId, startDate, endDate, refetchIndex]);

}

export function useGetMeters(refetchIndex: number) {
    return useFetch<Meter[]>(`/meters`, { method: "GET" }, [refetchIndex]);
}