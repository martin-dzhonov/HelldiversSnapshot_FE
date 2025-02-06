import { useEffect, useMemo, useState, useRef } from "react";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import * as settings from "../settings/chartSettings";
import { isDev, itemCategoryColors, strategems } from "../constants";
import { getItemColor } from "../utils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

const StrategemChart = ({ barData, filters, options}) => {
    const chartRef = useRef(null);
    const navigate = useNavigate();

    const [images, setImages] = useState({});
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const chartHeight = useMemo(() => {
        if (barData) {
            return Object.keys(barData).length * options.sectionSize;
        }
    }, [barData]);

    const data = useMemo(() => {
        if (barData) {
            return {
                labels: Object.keys(barData).map((item) => strategems[item].name),
                datasets: [
                    {
                        data: Object.values(barData).map((item) => item.value),
                        backgroundColor: Object.keys(barData).map((item) => getItemColor(item)),
                        total: Object.values(barData).map((item) => item.total),
                        currValue: Object.values(barData).map((item) => item.currValue),
                        pastValue: Object.values(barData).map((item) => item.pastValue),
                        barThickness: options.barSize,
                    },
                ],
            };
        }
    }, [barData]);

    useMemo(() => {
        if (strategems) {
            const images = {};
            let loadedCount = 0;

            Object.keys(strategems).forEach((imageKey) => {
                const image = new Image();
                image.src = strategems[imageKey]?.svg;

                image.onload = () => {
                    images[imageKey] = image;
                    loadedCount += 1;

                    if (loadedCount === Object.keys(strategems).length) {
                        setImages(images);
                        setImagesLoaded(true);
                    }
                };
            });
        }
    }, [strategems]);

    const handleDrawImage = (chart) => {
        const { ctx } = chart;
        const chartHeight = chart.chartArea?.height;
        const dataLength = Object.keys(barData).length;
        const step = (chartHeight - options.barSize * dataLength) / dataLength;
        const yOffset = step / 2 + ((options.barSize - options.imageSize) / 2);

        ctx.save();

        Object.keys(barData).forEach((imageKey, i) => {
            const imageY = i * (options.barSize + step) + yOffset;
            const image = images[imageKey];
            const imageSize = options.imageSize;

            if (image && !isDev) {
                ctx.drawImage(
                    image,
                    0,
                    imageY,
                    imageSize,
                    imageSize
                );
            }
        });

        ctx.restore();
    };

    const onClick = (event) => {
        const { current: chart } = chartRef;
        if (!chart) { return; }

        const elementAtEvent = getElementAtEvent(chart, event);
        if (elementAtEvent.length > 0) {
            const itemId = Object.keys(barData)[elementAtEvent[0].index];
            navigate(`/armory/${filters.faction}/${itemId}`);
            window.scrollTo(0, 0);
        }
    }

    const downloadChart = (event) => {
        const { current: chart } = chartRef;
        if (!chart) { return; }
        const url = chart.toBase64Image();
        const link = document.createElement("a");
        link.href = url;
        link.download = "chart.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (!imagesLoaded) {
        return null;
    }

    return (<>
        {isDev && <div
            className="text-small"
            onClick={() => downloadChart()}>
            Download
        </div>}
        {data && chartHeight &&
            <div style={{ width: "100%", height: `${chartHeight}px` }}>
                <div className="bar-chart-wrapper">
                    <Bar
                        ref={chartRef}
                        data={data}
                        options={options}
                        redraw={true}
                        onClick={onClick}
                        plugins={[{
                            beforeDraw: (chart) => handleDrawImage(chart),
                            resize: (chart) => handleDrawImage(chart),
                        }]}
                    />
                </div>
            </div>
        }
    </>);
};

export default StrategemChart;