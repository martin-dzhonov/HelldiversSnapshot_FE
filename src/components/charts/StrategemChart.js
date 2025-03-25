import { useEffect, useMemo, useState, useRef } from "react";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import trendUpIcon from "../../assets/icons/trendUp.svg";
import trendDownIcon from "../../assets/icons/trendDown.svg";
import rankIcon from "../../assets/icons/rank.svg";
import playedIcon from "../../assets/icons/people.svg";
import levelIcon from "../../assets/icons/level.svg";

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

const StrategemChart = ({ barData, filters, options, type = "base", limit = 0, showDetails = false, showTrends = false }) => {
    const chartRef = useRef(null);
    const navigate = useNavigate();
    const { isMobile } = useMobile();

    const chartLoaded = { current: false };
    const [images, setImages] = useState({});
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [icons, setIcons] = useState({});
    const [iconsLoaded, setIconsLoaded] = useState(false);
    const [showFull, setShowFull] = useState(false);

    const data = useMemo(() => {
        if (barData) {
            if (limit && !showFull) {
                return Object.fromEntries(Object.entries(barData).slice(0, limit));
            } else {
                return barData;
            }
        }
    }, [barData, limit, showFull]);

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
                        data: Object.values(data).map((item) => item?.values?.loadouts),
                        total: Object.values(data).map((item) => item?.total?.loadouts),
                        pastValue: Object.values(data).map((item) => item?.pastValues?.loadouts),
                        backgroundColor: Object.keys(data).map((item) => getItemColor(item)),
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

            const iconsArr = [playedIcon, levelIcon, rankIcon, trendUpIcon, trendDownIcon];
            const iconsKeys = ['loadouts', 'avg_lvl', 'trend_rank', 'trend_pick_rate', 'trend_pick_rate_down'];
            const iconsAssets = iconsArr.map((icon) => {
                const img = new Image();
                img.src = icon;
                return img;
            });
            const iconsObj = iconsKeys.reduce((acc, key, index) => {
                acc[key] = iconsAssets[index];
                return acc;
            }, {})

            setIcons(iconsObj);
            setIconsLoaded(true);
        }
    }, [strategemsDict, weaponsDict]);

    const getValueColor = (value) => {
        if (typeof value === 'number') {
            if (value > 0) return "#679552";
            if (value < -1000) { return "#fff000" }
            if (value < 0) return "#de7b6c";
            return "#fff000";
        }
        return "#FFFFFF";
    };

    const getImageDimensions = () => {
        let width = options.imageWidth;
        let height = options.imageHeight;
        let xOffset = 0;

        if (type === "weapons" && filters.category === "Throwable") {
            width = 60;
            height = 60;
        }

        return { width, height, xOffset };
    };

    const getFomattedValue = (value) => {
        switch (value.name) {
            case 'loadouts':
                return value.value.toString()
            case 'avg_lvl':
                return value.value
            case 'trend_rank':
                if (value.value < -1000) {
                    return 'New'
                }
                return `${value.value > 0 ? '+' : ''}${value.value}`
            case 'trend_pick_rate':
                return `${value.value > 0 ? '+' : ''}${value.value}%`
            case 'trend_pick_rate_down':
                return `${value.value > 0 ? '+' : ''}${value.value}%`
            default:
                break;
        }
    };


    const handleDrawImage = (chart) => {
        const { ctx } = chart;
        const chartHeight = chart.chartArea?.height;
        const dataLength = Object.keys(data).length;
        const step = (chartHeight - options.barSize * dataLength) / dataLength;
        let yOffset = step / 2 + ((options.barSize - options.imageHeight) / 2);

        ctx.save();
        ctx.font = "16px CustomFont";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";

        const labelsXOffset = type === "weapons" ? filters.category === "Throwable" ? 90 : 150 : 70;
        const labelsYOffset = type === "weapons" ? 50 : 42;

        Object.keys(data).forEach((key, i) => {
            const valuesRaw = data[key];
            const valuesObj = [{
                name: 'loadouts',
                value: valuesRaw.total.loadouts.toString()
            }]
            if (valuesRaw.values.avgLevel) {
                valuesObj.push({
                    name: 'avg_lvl',
                    value: valuesRaw.values.avgLevel.toString()
                })
            }
            if (showTrends) {
                valuesObj.push({
                    name: 'trend_rank',
                    value: valuesRaw.pastValues.rank - valuesRaw.values.rank
                })
                const pickRateValue = Number((valuesRaw.values.loadouts - valuesRaw.pastValues.loadouts).toFixed(2));
                valuesObj.push({
                    name: pickRateValue < 0 ? 'trend_pick_rate_down' : 'trend_pick_rate',
                    value: pickRateValue
                })
            }

            const image = images[key];
            const { width, height, xOffset } = getImageDimensions();
            const imageY = i * (options.barSize + step) + yOffset;

            if (image && !isDev) {
                ctx.drawImage(image, xOffset, imageY, width, height);

                if (showDetails) {
                    let currentX = xOffset + labelsXOffset;

                    valuesObj.forEach((value, j) => {
                        let icon = icons[value.name];
                        ctx.drawImage(icon, currentX, imageY + labelsYOffset, 20, 20);
                        currentX += 22;
                        if(value.name === 'trend_rank') {
                            currentX += 3;
                        }

                        ctx.fillStyle = getValueColor(value.value);
                        ctx.fillText(getFomattedValue(value), currentX, imageY + labelsYOffset + 15);
                        currentX += ctx.measureText(value.value).width + 15;
                    })
                }
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

    if (!imagesLoaded || !iconsLoaded) {
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
                                                }
                                            },
                                            resize: (chart) => handleDrawImage(chart),
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                        {limit && <div
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