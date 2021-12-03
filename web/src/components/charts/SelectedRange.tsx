import { DateTime } from "luxon";

export type SetRangeType = (selectedRange: SelectedRange) => void;

export interface SelectedRange {
    start: DateTime;
    end: DateTime;
}
