import "../../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {  useMemo, useRef } from "react";

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
import { getChartGradient, getItemColor } from "../../utils";

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

const PatchChart = ({ data, itemID }) => {
    const chartRef = useRef(null);
    const chartData = useMemo(() => {
        if (data && itemID) {
            const itemColor = getItemColor(itemID);
            return {
                labels: data.labels,
                datasets: [
                    {
                        data: data.dataset,
                        pointRadius: 6,
                        pointHoverRadius: 12,
                        borderColor: itemColor,
                        pointBackgroundColor: itemColor,
                        pointBorderColor: itemColor,
                        fill: "start",
                        backgroundColor: (context) =>  getChartGradient(context, itemColor),
                    }
                ],
            };
        }
    }, [data, itemID]);

    return (
        <>
            {chartData && <Line
                ref={chartRef}
                data={chartData}
                options={data.options}
                redraw={false}
            />}
        </>
    );
};

export default PatchChart;
