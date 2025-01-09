import "../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
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

const LineGraph = ({ data, options, chartRef, onLineClick, redraw = false }) => {
    return (
        <Line
            ref={chartRef}
            data={data}
            options={options}
            redraw={redraw}
            onClick={onLineClick}
            width="100%"
            style={{ backgroundColor: "#181818" }}
        />
    );
};

export default LineGraph;
