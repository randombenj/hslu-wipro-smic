import useFetch, { CachePolicies } from "use-http";
import { Measurement } from "../model/measurement";
import { Meter } from "../model/meter";

export function useGetMeasurements(meterId: number) {
    return useFetch<Measurement[]>(`/meters/${meterId}/measurements`, { 
        method: "GET",
        cachePolicy: CachePolicies.NETWORK_ONLY,
    }, [meterId]);

}

export function useGetMeters() {
    return useFetch<Meter[]>(`/meters`, { method: "GET" }, []);
}