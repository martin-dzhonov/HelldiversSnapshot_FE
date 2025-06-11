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
import { isDev, weaponsDict, strategemsDict, itemsDict } from "../../constants";
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

const StrategemChart = ({ barData, filters, options, type = "base", legendItems, limit = 0 }) => {
    const chartRef = useRef(null);
    const navigate = useNavigate();
    const { isMobile } = useMobile();

    const [images, setImages] = useState({});
    const [imagesLoaded, setImagesLoaded] = useState(false);
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
                labels: Object.keys(data).map((item) => allItems[item] ? allItems[item].name : item),
                datasets: [
                    {
                        data: Object.values(data).map((item) => item?.values?.loadouts),
                        total: Object.values(data).map((item) => item?.total?.loadouts),
                        pastValue: Object.values(data).map((item) => item?.pastValues?.loadouts),
                        backgroundColor: Object.keys(data).map((item) => type === "armor" ? '#ffe433' :getItemColor(item)),
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
            
            Object.keys(itemsDict).forEach((imageKey) => {
                const image = new Image();
                image.src = itemsDict[imageKey]?.image;

                image.onload = () => {
                    images[imageKey] = image;
                    loadedCount += 1;

                    if (loadedCount === Object.keys(itemsDict).length) {
                        setImages(images);
                        setImagesLoaded(true);
                    }
                };
            });
        }
    }, [strategemsDict, weaponsDict]);

    const getValueColor = (value) => {
        if (typeof value === 'number') {
            if (value > 0) return "#679552";
            if (value < -1000) { return "#fff000" }
            if (value < 0) return "#de7b6c";
            return "#fff000";
        }
        if(value === 'New'){
            return "#fff000";
        }
        return "#FFFFFF";
    };

    const getImageDimensions = () => {
        let width = options.imageWidth;
        let height = options.imageHeight;
        let xOffset = 0;

        if (type === "weapons" && filters.category === "Throwable") {
            width = isDev ? 200 : 60;
            height = isDev ? 200 : 60;
        }

        return { width, height, xOffset };
    };

    const getValueRaw = (name, valuesRaw) => {
        switch (name) {
            case 'Times played':
                return valuesRaw.total.loadouts.toString();
            case 'Avg. Level':
                return valuesRaw.values.avgLevel.toString()
            case 'Rank Trend':
                return valuesRaw.pastValues?.loadouts > 0 ? valuesRaw.pastValues.rank - valuesRaw.values.rank : 'New'
            case 'Pick Rate Trend':
                return valuesRaw.pastValues?.loadouts > 0 ? Number((valuesRaw.values.loadouts - valuesRaw.pastValues.loadouts).toFixed(2)) : 'New'
            default:
                break;
        }
    };

    const getValueFormatted = (name, value) => {
        switch (name) {
            case 'Rank Trend':
                if(value === 'New'){
                    return value;
                }
                return `${value > 0 ? '+' : ''}${value}`
            case 'Pick Rate Trend':
                if(value === 'New'){
                    return value;
                }
                return `${value > 0 ? '+' : ''}${value}%`
            default:
                return value;
        }
    };


    const handleDrawImage = (chart) => {
        const { ctx } = chart;
        const chartHeight = chart.chartArea?.height;
        const dataLength = Object.keys(data).length;
        const step = (chartHeight - options.barSize * dataLength) / dataLength;
        let yOffset = step / 2 + ((options.barSize - options.imageHeight) / 2);

        ctx.save();

        ctx.font = `${isDev ? '42px' : '16px'} CustomFont`;

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";

        let labelsXOffset = type === "weapons" ? filters.category === "Throwable" ? 90 : 150 : 70;
        let labelsYOffset = type === "weapons" ? 50 : 42;
        let iconSize = isDev ? 42 : 20;

        if (isDev) {
            if (type === 'weapons') {
                labelsYOffset = labelsYOffset + 95;
                if(filters.category === "Throwable"){
                    labelsXOffset = labelsXOffset + 330;
                } else {
                    labelsXOffset = labelsXOffset + 270;  
                }
            }
            if (type === 'strategem') {
                labelsXOffset = labelsXOffset + 70;  
                labelsYOffset = labelsYOffset + 50;
            }
        }
        Object.keys(data).forEach((key, i) => {
            const image = images[key];
            const { width, height, xOffset } = getImageDimensions();
            const imageY = i * (options.barSize + step) + yOffset;

            if (image) {
                ctx.drawImage(image, xOffset, type !== 'armor' ? imageY : imageY + 8, width, height);//xOffset + 100
            }

            const valuesRaw = data[key];
            let currentX = xOffset + labelsXOffset;
            legendItems.forEach((item, j) => {

                let valueRaw = getValueRaw(item.name, valuesRaw);
                if (item.name === 'Name') {
                    valueRaw = itemsDict[key].name;
                }
                const valueFormatted = getValueFormatted(item.name, valueRaw);
                if (item.check) {
                    if (item.src) {
                        let icon = item.src;
                        if (item.name === 'Pick Rate Trend') {
                            if (valueRaw < 0) {
                                icon = item.altSrc
                            }
                        }
                        ctx.drawImage(icon, currentX, imageY + labelsYOffset, iconSize, iconSize);//imageY + labelsYOffset - iconSize/2
                        currentX += 22;
                    }

                    ctx.fillStyle = getValueColor(valueRaw);
                    ctx.fillText(valueFormatted, currentX, imageY + labelsYOffset + 15);//currentX + iconSize/2
                    currentX += ctx.measureText(valueFormatted).width + 15;// + 15 + iconSize
                }
            })
        });

        ctx.restore();
    };
    //labelsXOffset = labelsXOffset + 50;
    //labelsYOffset = labelsYOffset + 40;
    //     ctx.fillStyle = getValueColor(value.value);
    //     ctx.fillText(getFomattedValue(value), currentX, imageY + labelsYOffset + 15);
    //     currentX += ctx.measureText(value.value).width + 15;
    // })
    // const valuesObj = []
    // if (valuesRaw.values.avgLevel) {
    //     valuesObj.push({
    //         name: 'avg_lvl',
    //         value: valuesRaw.values.avgLevel.toString()
    //     })
    // }
    // if (showTrends) {
    //     valuesObj.push({
    //         name: 'trend_rank',
    //         value: valuesRaw.pastValues.rank - valuesRaw.values.rank
    //     })
    //     const pickRateValue = Number((valuesRaw.values.loadouts - valuesRaw.pastValues.loadouts).toFixed(2));
    //     valuesObj.push({
    //         name: pickRateValue < 0 ? 'trend_pick_rate_down' : 'trend_pick_rate',
    //         value: pickRateValue
    //     })
    // }

    // let currentX = xOffset + labelsXOffset;
    // valuesObj.forEach((value, j) => {
    //     let icon = icons[value.name];
    //     ctx.drawImage(icon, currentX, imageY + labelsYOffset, 20, 20);
    //     currentX += 22;
    //     if (value.name === 'trend_rank') {
    //         currentX += 3;
    //     }

    //     ctx.fillStyle = getValueColor(value.value);
    //     ctx.fillText(getFomattedValue(value), currentX, imageY + labelsYOffset + 15);
    //     currentX += ctx.measureText(value.value).width + 15;
    // })

    const onClick = (event) => {
        const { current: chart } = chartRef;
        if (!chart) { return; }
        if (type === 'armor') {return;}
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

    if (!imagesLoaded || !legendItems) {
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