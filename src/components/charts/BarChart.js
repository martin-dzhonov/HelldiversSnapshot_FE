import "../../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRef, useMemo } from "react";
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

const BarChart = ({ data, options, onBarClick, autoHeight = true, onChartLoad = () => { } }) => {
    const chartRef = useRef(null);
    const chartLoaded = { current: false };

    const onClick = (event) => {
        const { current: chart } = chartRef;
        if (!chart) { return; }
        const elementAtEvent = getElementAtEvent(chart, event);
        onBarClick && onBarClick(elementAtEvent[0]);
    }

    const chartHeight = useMemo(() => {
        if (data) {
            return Object.keys(data.labels).length * options.sectionSize;
        }
    }, [data]);

    return (
        <>
            {data ? (
                data.labels.length === 0 ? (
                    <div className="empty-chart-text-wrapper">
                        <div className="empty-chart-text">
                            No Data Available
                        </div>
                    </div>
                ) : (
                    <div style={{ width: "100%", height: autoHeight ? `${chartHeight}px` : '100%' }}>
                        <div className="bar-chart-wrapper">
                            <Bar
                                ref={chartRef}
                                data={data}
                                options={options}
                                redraw={true}
                                onClick={onClick}
                                plugins={[
                                    {
                                        afterDraw: (chart) => {
                                            if (!chartLoaded.current) {
                                                chartLoaded.current = true;
                                                onChartLoad(chart);
                                            }
                                        },
                                    },
                                ]}
                            />
                        </div>
                    </div>
                )
            ) : null}
        </>
    );
};

export default BarChart;
