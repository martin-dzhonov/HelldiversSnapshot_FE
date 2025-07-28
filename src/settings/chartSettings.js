import { isDev, patchPeriods } from "../constants";
import { getCountingSuffix } from "../utils";

export const getSettingsWithMax = (settings, maxY) => {
    settings.scales.y.max = maxY;
    return settings;
}

const formatters = {
    trends: (item) => [`Pick Rate: ${item.dataset.pastValue[item.dataIndex]}% ➜ ${item.dataset.currValue[item.dataIndex]}%`],
    companions: (item) => [`Paired together ${item.raw}% of games`],
    snapshot: (item) => { return [`Pick Rate: ${item.raw}%`]; },//, `${item.dataset.total[item.dataIndex]} times played`
    pickRate: (item) => item.raw >= 0 ? `Pick Rate: ${item.raw}%` : 'No data',
    level: (item) => `${item.raw}% of players`,
    rank: (item) => ``,
};

const datalabelsSettings = ({ color = "white", anchor = 'end', align = 'end', fontSize = 15, formatter, rankMax } = {}) => {
    return {
        color: color,
        anchor: anchor,
        align: align,
        font: {
            family: "CustomFont",
            weight: 'bold',
            size: fontSize,
        },
        formatter: (value) => {
            if (value < 0) {
                return '';
            }

            const rankingValue = rankMax - value - 2;
            return rankMax ? rankingValue + getCountingSuffix(rankingValue) : value + "%";
        }
    }
}

const tooltipSettings = (formatter) => {
    return {
        displayColors: false,
        bodyFont: {
            family: "CustomFont",
            size: 14,
        },
        titleFont: {
            family: "CustomFont",
            size: 15,
        },
        callbacks: {
            label: (item) => formatter(item)
        }
    }
}

const pickratePlugins = {
    title: { display: false },
    legend: { display: false },
    tooltip: tooltipSettings(formatters.pickRate),
    datalabels: {
        display: false
    }
};

const pickratedatalabelsSettings = ({ color = "white", anchor = 'end', align = 'end', fontSize = 15 } = {}) => {
    return {
        color: color,
        anchor: anchor,
        align: align,
        font: {
            family: "CustomFont",
            weight: 'bold',
            size: fontSize,
        },
        formatter: (value) => {
            if (value < 0) {
                return '';
            }

            return value + "%";
        }
    }
}


const rankdatalabelsSettings = ({ color = "white", anchor = 'end', align = 'end', fontSize = 15, rankMax } = {}) => {
    return {
        color: color,
        anchor: anchor,
        align: align,
        font: {
            family: "CustomFont",
            weight: 'bold',
            size: fontSize,
        },
        formatter: (value) => {
            const rankingValue = rankMax - value - 2;
            if (value < 0) {
                return '';
            }
            return rankingValue + getCountingSuffix(rankingValue);
        }
    }
}


export const faction = ({
    min,
    max,
    type
} = {}) => ({
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    onHover: (event, chartElement) => {
        if (chartElement.length) {
            event.native.target.style.cursor = 'pointer';
        } else {
            event.native.target.style.cursor = 'default';
        }
    },
    elements: {
        bar: { borderWidth: 2 }
    },
    layout: {
        padding: { top: 25 },
    },
    scales: {
        x: {
            ticks: {
                display: true,
                font: {
                    family: "CustomFont",
                    size: 15,
                },
                color: "white",
            },
            grid: { drawOnChartArea: false }
        },
        y: {
            min: min ? min : 0,
            max: max,
            ticks: {
                display: false,
                font: { family: "CustomFont", size: 10 },
                color: "white",
            },
            grid: {
                drawBorder: false,
                color: "white",
                drawTicks: false,
                drawOnChartArea: true,
                lineWidth: function (context) {
                    const index = context.index;
                    return index === 0;
                },
            },
        }
    },
    plugins: {
        title: { display: false },
        legend: { display: false },
        tooltip: tooltipSettings(type === 'pick_rate' || type === 'game_rate' ? formatters.pickRate : formatters.rank),
        datalabels: type === 'pick_rate' || type === 'game_rate' ?
            pickratedatalabelsSettings({ fontSize: 16 }) : rankdatalabelsSettings({ fontSize: 16, rankMax: max })
    }
});

export const patch = ({
    min,
    max,
    type,
    isMobile
} = {}) => ({
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: { top: 30, right: 25, bottom: isMobile ? 0: 20, left: isMobile ? 35 : 25 },
    },
    scales: {
        x: {
            ticks: {
                minRotation: 0,
                maxRotation: 10,
                autoSkip: false,
                display: true,
                font: {
                    family: "CustomFont",
                    size: 14,
                },
                color: "white",
                callback: (value, index, values) => {
                    // let labels = patchNames;
                    // if (index === 0 || index === values.length - 1) {
                    //     return labels[index];
                    // }
                    return "";
                },
            },
            grid: {
                drawOnChartArea: false
            }
        },
        y: {
            offset: false,
            min: min ? min : 0,
            max: max,
            ticks: {
                display: false,
            },
            grid: {
                drawBorder: false,
                color: "white",
                drawTicks: false,
                drawOnChartArea: true,
                lineWidth: function (context) {
                    const index = context.index;
                    return index > 0 ? 0 : 1;
                },
            },
            beginAtZero: true
        }
    },
    plugins: {
        title: { display: false },
        legend: { display: false },
        tooltip: tooltipSettings(type === 'pick_rate' || type === 'game_rate' ? formatters.pickRate : formatters.rank),
        datalabels: type === 'pick_rate' || type === 'game_rate' ?
            pickratedatalabelsSettings({ align: 'top', fontSize: 16 }) : rankdatalabelsSettings({ align: 'top', fontSize: 16, rankMax: max })
    }
});

export const weapons = ({
    axisWidth = 140
} = {}) => ({
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    barSize: isDev ? 44 : 34,
    imageWidth: isDev ? 420: 134,
    imageHeight: isDev ? 200: 60,
    sectionSize: isDev ? 260: 75,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: isDev ? 155 : 50 },
    },
    scales: {
        x: {
            ticks: { display: false },
            grid: { drawOnChartArea: false }
        },
        y: {
            ticks: { display: false },
            grid: { display: false },
            afterFit: (axis) => { axis.width = isDev ? 440 : axisWidth; } //440
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: tooltipSettings(formatters.snapshot),
        datalabels: datalabelsSettings({ fontSize: isDev ? 56 : 18 }),
    }
});

export const strategem = ({
} = {}) => ({
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    barSize: isDev ? 40 : 30,
    imageWidth: isDev ? 110 : 50,
    imageHeight: isDev ? 110 : 50,
    sectionSize: isDev ? 140 : 70,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: isDev ? 130 : 55 },
    },
    scales: {
        x: {
            ticks: { display: false },
            grid: { drawOnChartArea: false }
        },
        y: {
            ticks: { display: false },
            grid: { display: false },
            afterFit: (axis) => { axis.width = isDev ? 140 : 70; }
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: tooltipSettings(formatters.snapshot),
        datalabels: datalabelsSettings({ fontSize: isDev ? 55 : 18 }),
    }
});

export const armor = ({
} = {}) => ({
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    barSize: isDev ? 40 : 30,
    imageWidth: isDev ? 100 : 50,
    imageHeight: isDev ? 100 : 50,
    sectionSize: isDev ? 230 : 70,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: isDev ? 300 : 55 },
    },
    scales: {
        x: {
            ticks: { display: false },
            grid: { drawOnChartArea: false }
        },
        y: {
            ticks: { display: false },
            grid: { display: false },
            afterFit: (axis) => { axis.width = isDev ? 440 : 70; }
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: tooltipSettings(formatters.snapshot),
        datalabels: datalabelsSettings({ fontSize: isDev ? 56 : 18 }),
    }
});

export const companions = ({
    max,
} = {}) => ({
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    barSize: 24,
    imageWidth: 34,
    imageHeight: 34,
    sectionSize: 36,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: 10 },
    },
    scales: {
        x: {
            max: max,
            ticks: { display: false },
            grid: { drawOnChartArea: false },
            beginAtZero: true
        },
        y: {
            ticks: { display: false },
            grid: { drawOnChartArea: false },
            afterFit: (axis) => { axis.width = 50; }
        }
    },
    plugins: {
        ...pickratePlugins,
        tooltip: tooltipSettings(formatters.companions),
        datalabels: datalabelsSettings({ fontSize: 15 })
    }
});

export const snapshotStrategem = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    barSize: isDev ? 40 : 30,
    imageWidth: isDev ? 100 : 50,
    imageHeight: isDev ? 100 : 50,
    sectionSize: isDev ? 140 : 70,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: 55 },
    },
    scales: {
        x: {
            ticks: { display: false },
            grid: { drawOnChartArea: false }
        },
        y: {
            ticks: { display: false },
            grid: { display: false },
            afterFit: (axis) => { axis.width = isDev ? 140 : 70; }
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: tooltipSettings(formatters.snapshot),
        datalabels: datalabelsSettings({ fontSize: isDev ? 40 : 18 }),
    }
};

export const snapshotWeapons = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    barSize: 34,
    imageWidth: 134,
    imageHeight: 60,
    sectionSize: 75,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: 50 },
    },
    scales: {
        x: {
            ticks: { display: false },
            grid: { drawOnChartArea: false }
        },
        y: {
            ticks: { display: false },
            grid: { display: false },
            afterFit: (axis) => { axis.width = 150; }
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: tooltipSettings(formatters.snapshot),
        datalabels: datalabelsSettings({ fontSize: 17 }),
    }
};


export const detailsBase = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: 50 },
    },
    scales: {
        x: {
            ticks: { display: false },
            grid: { drawOnChartArea: false }
        },
        y: {
            ticks: {
                display: true,
                font: {
                    family: "CustomFont",
                    size: 13,
                },
                color: "white",
            },
            grid: { drawOnChartArea: false },
            beginAtZero: true
        }
    },
    plugins: {
        ...pickratePlugins,
        datalabels: datalabelsSettings({ fontSize: 15 })
    },
};

export const level = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: 50 },
    },
    scales: {
        x: {
            ticks: { display: false },
            grid: { drawOnChartArea: false }
        },
        y: {
            ticks: {
                display: true,
                font: {
                    family: "CustomFont",
                    size: 13,
                },
                color: "white",
            },
            grid: { drawOnChartArea: false },
            beginAtZero: true
        }
    },
    plugins: {
        title: { display: false },
        legend: { display: false },
        tooltip: tooltipSettings(formatters.level),
        datalabels: datalabelsSettings({ fontSize: 15 })
    },
};