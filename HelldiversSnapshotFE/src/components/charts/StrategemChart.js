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
import { isDev, weaponsDict, strategemsDict } from "../../constants";
import { getItemColor } from "../../utils";
import useMobile from "../../hooks/useMobile";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

const StrategemChart = ({ barData, filters, options, onChartLoad = ()=>{}, type = "strategem", expandable=false }) => {
    const chartRef = useRef(null);
    const navigate = useNavigate();
    const { isMobile } = useMobile();

    const chartLoaded = { current: false };
    const [images, setImages] = useState({});
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [showFull, setShowFull] = useState(false);

    const data = useMemo(() => {
        if (barData) {
            if (expandable && !showFull) {
                return Object.fromEntries(Object.entries(barData).slice(0, type === "strategem" ? 15 : 10));
            } else {
                return barData;
            }
        }
    }, [barData, type, showFull]);

    const chartHeight = useMemo(() => {
        if (data) {
            return Object.keys(data).length * options.sectionSize;
        }
    }, [data]);

    const chartData = useMemo(() => {
        if (data) {
            const allItems = { ...strategemsDict, ...weaponsDict }
            return {
                labels: Object.keys(data).map((item) => allItems[item].name),
                datasets: [
                    {
                        data: Object.values(data).map((item) => item?.value),
                        backgroundColor:  Object.keys(data).map((item) => type === "strategem" ? getItemColor(item) : getItemColor(item)),
                        total: Object.values(data).map((item) => item?.loadouts),
                        currValue: Object.values(data).map((item) => item?.currValue),
                        pastValue: Object.values(data).map((item) => item?.pastValue),
                        barThickness: options.barSize,
                    },
                ],
            };
        }
    }, [data]);

    useMemo(() => {
        if (strategemsDict && weaponsDict) {
            const images = {};
            let loadedCount = 0;
            const allDict = { ...strategemsDict, ...weaponsDict }
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
    }, [strategemsDict, weaponsDict]);

    const handleDrawImage = (chart) => {
        const { ctx } = chart;
        const chartHeight = chart.chartArea?.height;
        const dataLength = Object.keys(data).length;
        const step = (chartHeight - options.barSize * dataLength) / dataLength;
        const yOffset = step / 2 + ((options.barSize - options.imageHeight) / 2);

        ctx.save();

        Object.keys(data).forEach((imageKey, i) => {
            const imageY = i * (options.barSize + step) + yOffset;
            const image = images[imageKey];
            let imageX = 0;
            let imageW = options.imageWidth;
            let imageH = options.imageHeight;
            if (type === "weapons") {
                if(filters.category === "Throwable"){
                    imageW = 60;
                    imageH = 60;
                    imageX = 60;
                }
            }

            if (image && !isDev) {
                ctx.drawImage(
                    image,
                    imageX,
                    imageY,
                    imageW,
                    imageH,
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
            const itemId = Object.keys(data)[elementAtEvent[0].index];
            navigate(`/${type}/${itemId}/${filters.faction}`);
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

    return (
        <>
            {isDev && (
                <div className="text-small" onClick={() => downloadChart()}>
                    Download
                </div>
            )}
            {chartData ? (
                chartData.labels.length === 0 ? (
                    <div className="empty-chart-text-wrapper">
                        <div className="empty-chart-text">
                            No Data Available
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ width: "100%", height: `${chartHeight}px` }}>
                            <div className="bar-chart-wrapper">
                                <Bar
                                    ref={chartRef}
                                    data={chartData}
                                    options={options}
                                    redraw={true}
                                    onClick={onClick}
                                    plugins={[
                                        {
                                            beforeDraw: (chart) => handleDrawImage(chart),
                                            afterDraw: (chart) => {
                                                if (!chartLoaded.current) {
                                                    chartLoaded.current = true;
                                                    onChartLoad(chart); 
                                                }
                                            },
                                            resize: (chart) => handleDrawImage(chart),
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                        {expandable && <div
                            className="text-small text-faction-show-all"
                            onClick={() => setShowFull(!showFull)}>
                            Show {showFull ? "Less" : "All"}
                        </div>}
                    </>
                )
            ) : null}
        </>
    );
 };

export default StrategemChart;