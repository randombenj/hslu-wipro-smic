import { DateTime } from "luxon";
import useFetch from "use-http";
import Label from "../model/Label";

export interface LabelAssignment {
    name: string;
    start_time: string;
    end_time: string;
    color: string;
}

export function useGetLabelAssignments(meterId: number, refetchIndex: number = 0) {
    return useFetch<LabelAssignment[]>(`/meters/${meterId}/labels`, { method: "GET" }, [refetchIndex, meterId]);

}

export function useGetLabels(refetchIndex: number = 0) {
    return useFetch<Label[]>(`/labels`, { method: "GET" }, [refetchIndex]);
}
