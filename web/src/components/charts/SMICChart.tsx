
import Paper from '@mui/material/Paper';
import { Line } from '../../model/Line'
import { LabelClickedType, useDrawLabels } from './useDrawLabels';
import { useDrawAxis } from './useDrawAxis';
import { getScales } from './getScales';
import { useSelectRangeWithDrag } from './useSelectRangeWithDrag';
import { useCreateBase } from './useCreateBase';
import { useDrawLines } from './useDrawLines';
import { Margin } from './Margin';
import { SetRangeType } from './SelectedRange';
import { LabelAssignment } from '../../hooks/labels';

interface porps {
    lines: Line[];
    yAxisName: string;
    setSelectedRange: SetRangeType;
    onLabelClicked: LabelClickedType;
    labels: LabelAssignment[];
    labelMode: string;
}

const SMICChart = (props: porps) => {
    const top = 80;
    const bottom = 80;
    const left = 60;
    const right = 20;
    const width = 500;
    const height = width;
    const margin: Margin = { top, bottom, left, right };

    const [svg, baseChartElement] = useCreateBase(height, width, margin);
    const scales = getScales(props.lines, height, width);
    const dragEnabled = props.labelMode === 'add_label';

    const range = useSelectRangeWithDrag(svg, scales, props.setSelectedRange, dragEnabled);

    useDrawAxis("Time", props.yAxisName, svg, scales, height, width, margin);
    useDrawLines(svg, props.lines, scales);
    useDrawLabels(svg, scales, height, props.labels, props.onLabelClicked);

    return (
        <Paper elevation={3} style={{ width: width + left + right }}>
            {baseChartElement}

        </Paper>
    )
}
export default SMICChart;

export type Svg = any;


