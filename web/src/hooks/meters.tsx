import useFetch from "use-http";
import { Measurement } from "../model/measurement";
import { Meter } from "../model/meter";

export function useGetMeasurements(meterId: number): { data: Measurement[], loading: boolean, error: any } {
    const { data, loading, error } = useFetch(`/meters/${meterId}/measurements`, { method: "GET" }, []);
    return { data, loading, error };
}

export function useGetMeters(): { data: Meter[], loading: boolean, error: any } {
    const { data, loading, error } = useFetch("/meters", { method: "GET" }, []);
    return { data, loading, error };
}