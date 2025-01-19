import "../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRef } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

const LineGraph = ({ data, options, onLineClick }) => {

    const chartRef = useRef(null);

    return (
        <Line
            ref={chartRef}
            data={data}
            options={options}
            redraw={true}
            onClick={onLineClick}
        />
    );
};

export default LineGraph;
