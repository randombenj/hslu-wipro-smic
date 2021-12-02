import { DateTime } from "luxon";
import useFetch, { Res } from "use-http";
import Label from "../model/Label";
import formatDate from "./utils";

interface LabelAssignment {
    name: string;
    start_time: Date;
    end_time: Date;
}

export function useGetLabelAssignments(meterId: number, refetchIndex: number = 0) {
    return useFetch<LabelAssignment[]>(`/meters/${meterId}/labels`, { method: "GET" }, [refetchIndex, meterId]);

}

export function useGetLabels(refetchIndex: number = 0) {
    return useFetch<Label[]>(`/labels`, { method: "GET" }, [refetchIndex]);
}



export function useAddLabelAssignment(): { addLabel: any, response: Res<string>, loading: boolean, error: any } {
    const { post, response, loading, error } = useFetch<string>('meters', { method: "POST" });
    const fun = (meterId: number, labelId: number, startDate: DateTime, endDate: DateTime):Promise<string>  =>{
        return post(`/${meterId}/labels`, {
            body: {
                label_id: labelId,
                start_date: formatDate(startDate),
                end_date: formatDate(endDate)
            }
        });
    }
    return {
        addLabel: fun,
        response,
        loading,
        error
    }
}