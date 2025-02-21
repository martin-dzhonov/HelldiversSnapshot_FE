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
import { isDev, itemCategoryColors, weaponsDict, strategems } from "../constants";
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

const StrategemChart = ({ barData, filters, options, showCount, type = "strategem" }) => {
    const chartRef = useRef(null);
    const navigate = useNavigate();

    const [images, setImages] = useState({});
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [showFull, setShowFull] = useState(false);

    const barDataTrimmed = useMemo(() => {
        if (barData) {
            if (!showFull) {
                return Object.fromEntries(Object.entries(barData).slice(0, type === "strategem" ? 15 :10));
            } else {
                return barData;
            }
        }
    }, [barData, type, showFull]);

    const chartHeight = useMemo(() => {
        if (barDataTrimmed) {
            return Object.keys(barDataTrimmed).length * options.sectionSize;
        }
    }, [barDataTrimmed]);

    const data = useMemo(() => {
        if (barDataTrimmed) {
            const weapons = { ...strategems, ...weaponsDict }
            return {
                labels: Object.keys(barDataTrimmed).map((item) => weapons[item].name),
                datasets: [
                    {
                        data: Object.values(barDataTrimmed).map((item) => item?.value),
                        backgroundColor: type === "strategem" ? Object.keys(barDataTrimmed).map((item) => getItemColor(item)) : "#49adc9",
                        total: Object.values(barDataTrimmed).map((item) => item?.total),
                        currValue: Object.values(barDataTrimmed).map((item) => item?.currValue),
                        pastValue: Object.values(barDataTrimmed).map((item) => item?.pastValue),
                        barThickness: options.barSize,
                    },
                ],
            };
        }
    }, [barDataTrimmed]);

    useMemo(() => {
        if (strategems && weaponsDict) {
            const images = {};
            let loadedCount = 0;
            const allDict = { ...strategems, ...weaponsDict }
            Object.keys(allDict).forEach((imageKey) => {
                const image = new Image();
                image.src = allDict[imageKey]?.image;

                image.onload = () => {
                    images[imageKey] = image;
                    loadedCount += 1;

                    if (loadedCount === Object.keys(allDict).length) {
                        setImages(images);
                        setImagesLoaded(true);
                    }
                };
            });
        }
    }, [strategems, weaponsDict]);

    const handleDrawImage = (chart) => {
        const { ctx } = chart;
        const chartHeight = chart.chartArea?.height;
        const dataLength = Object.keys(barDataTrimmed).length;
        const step = (chartHeight - options.barSize * dataLength) / dataLength;
        const yOffset = step / 2 + ((options.barSize - options.imageHeight) / 2);

        ctx.save();

        Object.keys(barDataTrimmed).forEach((imageKey, i) => {
            const imageY = i * (options.barSize + step) + yOffset;
            const image = images[imageKey];
            const imageW = options.imageWidth;
            const imageH = options.imageHeight;

            if (image && !isDev) {
                ctx.drawImage(
                    image,
                    0,
                    imageY,
                    imageW,
                    imageH,
                );
            }
        });

        ctx.restore();
    };

    const onClick = (event) => {
        if (type === "strategem") {
            const { current: chart } = chartRef;
            if (!chart) { return; }

            const elementAtEvent = getElementAtEvent(chart, event);
            if (elementAtEvent.length > 0) {
                const itemId = Object.keys(barDataTrimmed)[elementAtEvent[0].index];
                navigate(`/armory/${filters.faction}/${itemId}`);
                window.scrollTo(0, 0);
            }
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
            <>
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
                <div
                    className='text-small text-faction-show-all'
                    onClick={() => setShowFull(!showFull)}>
                    Show {showFull ? "Less" : "All"}
                </div>
            </>
        }
    </>);
};

export default StrategemChart;