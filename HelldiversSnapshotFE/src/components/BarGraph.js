import "../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartTooltip,
    Legend
);

const BarGraph = ({ data, options, chartRef, onBarClick, redraw = false }) => {
    return (
        <Bar
            ref={chartRef}
            data={data}
            options={options}
            redraw={true}
            onClick={onBarClick}
        />
    );
};

export default BarGraph;
