import { useEffect, useMemo, useState, useRef } from "react";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

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
import { strategems } from "../constants";
import { getItemColor } from "../utils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = ({ barData, filters }) => {
    const chartRef = useRef(null);
    const navigate = useNavigate();

    const [loadedImages, setLoadedImages] = useState({});
    const [isAllImagesLoaded, setIsAllImagesLoaded] = useState(false);

    const chartHeight = useMemo(() => {
        if (barData) {
            return Object.keys(barData).length * 40;
        }
    }, [barData]);

    const data = useMemo(() => {
        if (barData) {
            return {
                labels: Object.keys(barData).map((item) => strategems[item].name),
                datasets: [
                    {
                        data: Object.values(barData).map((item) => item.percentageLoadouts),
                        backgroundColor: Object.keys(barData).map((item) => getItemColor(item)),
                        total: Object.values(barData).map((item) => item.total),
                        barThickness: settings.barSize,
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
                        setLoadedImages(images);
                        setIsAllImagesLoaded(true);
                    }
                };
            });
        }
    }, [strategems]);

    const handleDrawImage = (chart) => {
        const { ctx } = chart;
        const chartHeight = chart.chartArea?.height;
        const dataLength = Object.keys(barData).length;
        const step = (chartHeight - settings.barSize * dataLength) / dataLength;
        const yOffset = step / 2 + settings.imageBarOffset;

        ctx.save();

        Object.keys(barData).forEach((imageKey, i) => {
            const imageY = i * (settings.barSize + step) + yOffset;
            const image = loadedImages[imageKey];

            if (image) {
                ctx.drawImage(
                    image,
                    0,
                    imageY,
                    settings.imageWidth,
                    settings.imageHeight
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
            console.log(elementAtEvent);
            const itemId = Object.keys(barData)[elementAtEvent[0].index];
            navigate(`/armory/${filters.faction}/${itemId}`);
        }
    }

    if (!isAllImagesLoaded) {
        return null;
    }

    return (<>
        {data && chartHeight &&
            <div style={{ width: "100%", height: `${chartHeight}px` }}>
                <div style={{ width: "100%", height: "100%", position: "relative" }}>
                    <Bar
                        ref={chartRef}
                        data={data}
                        options={settings.snapshotChartOptions}
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

export default BarChart;