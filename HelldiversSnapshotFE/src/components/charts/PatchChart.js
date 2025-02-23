import "../../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useMemo, useRef } from "react";

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
import { patchPeriods } from "../../constants";
import * as chartsSettings from "../../settings/chartSettings";

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

const PatchChart = ({ data, itemID, options }) => {
    const chartRef = useRef(null);

    const chartData = useMemo(() => {
        if (data && itemID) {
            const itemColor = getItemColor(itemID);
            return {
                labels: patchPeriods.map((item) => item.name).reverse(),
                datasets: [
                    {
                        data: data.reverse(),
                        fill: 'origin',
                        pointRadius: 6,
                        pointHoverRadius: 12,
                        borderColor: itemColor,
                        pointBackgroundColor: itemColor,
                        pointBorderColor: itemColor,
                        backgroundColor: (context) => getChartGradient(context, itemColor),
                    }
                ],
                chartsSettings: chartsSettings.strategemPatch
            };
        }
    }, [data, itemID]);

    return (
        <>
            {chartData && <Line
                ref={chartRef}
                data={chartData}
                options={options}
                redraw={false}
            />}
        </>
    );
};

export default PatchChart;
