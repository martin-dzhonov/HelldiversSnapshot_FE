import { useMemo, useState, useRef } from "react";
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
import { isDev, itemsDict, itemsChartConfig as config } from "../../constants";
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

const ImageChart = ({ barData, filters, options, legendItems, limit = 0 }) => {
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

    const chartData = useMemo(() => {
        if (data) {
            return {
                labels: Object.keys(data).map((item) => itemsDict[item] ? itemsDict[item].name : item),
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

    const chartHeight = useMemo(() => {
        if (data) {
            return Object.keys(data).length * options.sectionSize;
        }
    }, [data]);

    useMemo(() => {
        if (itemsDict) {
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
    }, [itemsDict]);

    const getValueRaw = (item, valuesRaw) => {
        const { name, category } = item;

        const map = {
            'Times played': () => valuesRaw.total.loadouts.toString(),
            'Avg. Level': () => {
                const level = valuesRaw?.values?.avgLevel ?? '';
                return level.toString();
            },
            'Rank Trend': () => {
                let rankValue = valuesRaw.pastValues.rank - valuesRaw.values.rank;
                if (category && category !== 'All') {
                    rankValue = valuesRaw.pastValues.rank_category - valuesRaw.values.rank_category;
                }
                return valuesRaw.values.isNew ? 'New' : rankValue;
            },
            'Pick Rate Trend': () => {
                return valuesRaw.values.isNew
                    ? 'New'
                    : Number((valuesRaw.values.loadouts - valuesRaw.pastValues.loadouts).toFixed(2));
            },
        };

        return map[name]?.();
    };

    const formatValue = (name, value) => {
        if (!Number.isFinite(value)) return value;
        const sign = value > 0 ? '+' : '';
        const isPercent = name === 'Pick Rate Trend';
        return `${sign}${value}${isPercent ? '%' : ''}`;
    };

    const getValueColor = (value) => {
        if (typeof value === 'number') {
            if (value > 0) return "#679552";
            if (value < 0) return "#de7b6c";
            return "#fff000";
        }
        if (value === 'New') return "#fff000";

        return "#FFFFFF";
    };

    const getImageDimensions = () => {
        const { page, category } = filters;
        const mode = isDev ? 'dev' : isMobile ? 'mobile' : 'prod';
        let imgDim = config.imageDimensions[page];

        if (page === 'weapons') {
            imgDim = imgDim[category];
            return { ...options, ...imgDim[mode] };
        }

        return { ...options, ...imgDim[mode] };
    };

    const getChartYOffset = () => {
        const offsets = config.chartYOffset[filters.page];
        if (!offsets) return 0;
        return isDev ? offsets.dev : offsets.prod;
    };

    const getChartXOffset = () => {
        const { page, category } = filters;
        const mode = isDev ? 'dev' : 'prod';
        let offsets = config.chartXOffset[page];
        if (page === 'weapons') {
            offsets = offsets[category]
        }

        return offsets ? offsets[mode] : 0;
    };

    const handleDrawImage = (chart) => {
        const { ctx } = chart;
        const chartHeight = chart.chartArea?.height;
        const dataLength = Object.keys(data).length;
        const step = (chartHeight - options.barSize * dataLength) / dataLength;
        let yOffset = step / 2 + ((options.barSize - options.imageH) / 2);
        ctx.textBaseline = "top";
        ctx.save();

        ctx.font = `${isDev ? '50px' : '16px'} CustomFont`;
        let iconSize = isDev ? 50 : 20;

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";

        Object.keys(data).forEach((key, i) => {
            const image = images[key];

            if (image) {
                const { imageW, imageH, imageX } = getImageDimensions();
                let imageY = i * (options.barSize + step) + yOffset;

                const labelsY = imageY + getChartYOffset();
                let labelsX = imageX + getChartXOffset();
                let labelsPadding = isDev ? 35 : isMobile ? 8 : 15;

                ctx.drawImage(image, imageX, imageY + + (isDev ? 20 : 5), imageW, imageH);

                const valuesRaw = data[key];

                legendItems.forEach((item, j) => {
                    let valueRaw = getValueRaw(item, valuesRaw);
                    if (item.name === 'Name') {
                        valueRaw = itemsDict[key].name;
                    }
                    const valueFormatted = formatValue(item.name, valueRaw);
                    if (item.check) {
                        if (item.src) {
                            let icon = item.src;
                            if (item.name === 'Pick Rate Trend' && valueRaw < 0) {
                                icon = item.altSrc;
                            }
                            ctx.drawImage(icon, labelsX, labelsY - iconSize / 10, iconSize, iconSize);
                            labelsX += iconSize + iconSize / 10;
                        }

                        ctx.fillStyle = getValueColor(valueRaw);
                        ctx.fillText(valueFormatted, labelsX, labelsY);
                        labelsX += ctx.measureText(valueFormatted).width + labelsPadding;
                    }
                })
            }
        });

        ctx.restore();
    };

    const onClick = (event) => {
        const { current: chart } = chartRef;
        if (!chart) { return; }
        if (filters.page === 'armor') { return; }
        const elementAtEvent = getElementAtEvent(chart, event);
        if (elementAtEvent.length > 0) {
            const itemId = Object.keys(data)[elementAtEvent[0].index];
            navigate(`/${filters.page}/${itemId}?f=${filters.faction}&p=${filters.patch.id}`);
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

export default ImageChart;