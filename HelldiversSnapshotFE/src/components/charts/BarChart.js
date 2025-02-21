import "../../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRef } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend
} from "chart.js";
import { Bar, getElementAtEvent } from "react-chartjs-2";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartTooltip,
    Legend
);

const BarChart = ({ data, options, onBarClick, redraw = false }) => {
    const chartRef = useRef(null);
    const onClick = (event) => {
        const { current: chart } = chartRef;
        if (!chart) { return; }
        const elementAtEvent = getElementAtEvent(chart, event);
        onBarClick && onBarClick(elementAtEvent[0]);
    }

    return (
        <Bar
            ref={chartRef}
            data={data}
            options={options}
            redraw={true}
            onClick={onClick}
        />
    );
};

export default BarChart;
