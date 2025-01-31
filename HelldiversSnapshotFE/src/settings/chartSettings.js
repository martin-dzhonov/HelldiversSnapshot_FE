export const barSize = 24;

export const sectionSize = 40;
export const imageWidth = 36;
export const imageHeight = 36;
export const imageHalfHeight = imageHeight / 2;
export const imageBarOffset = (barSize - imageHeight) / 2;

export const getSettingsWithMax = (settings, maxY) => {
    settings.scales.y.max = maxY;
    return settings;
}

const formatters = {
    trends: (item) => [`Pick Rate: ${item.dataset.pastValue[item.dataIndex]}% ➜ ${item.dataset.currValue[item.dataIndex]}%`],
    companions: (item) => [ `Paired together ${item.raw}% of games`],
    snapshot: (item) => { return [ `Pick Rate: ${item.raw}%`, `${item.dataset.total[item.dataIndex]} times played`];},
    pickRate: (item) => `Pick Rate: ${item.raw}%`
};

const datalabelsSettings = ({ color = "white", fontSize = 15, formatter } = {}) => {
    return {
        color: color,
        anchor: 'end',
        align: 'end',
        font: {
            family: "CustomFont",
            weight: 'bold',
            size: fontSize,
        },
        formatter: (value) => formatter ? formatter(value) : value + "%",
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

export const snapshotItems = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    sectionSize: sectionSize,
    iconSize: imageWidth,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: 45 },
    },
    scales: {
        x: {
            ticks: { display: false},
            grid: { drawOnChartArea: false}
        },
        y: {
            ticks: { display: false },
            grid: { display: false },
            afterFit: (axis) => { axis.width = 50; }
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: tooltipSettings(formatters.snapshot),
        datalabels: datalabelsSettings(),
    }
};

export const snapshotTrendsDown = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    sectionSize: sectionSize,
    iconSize: imageWidth,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: 40 },
    },
    scales: {
        x: {
            ticks: { display: false},
            grid: { drawOnChartArea: false}
        },
        y: {
            ticks: { display: false },
            grid: { drawOnChartArea: false },
            afterFit: (axis) => { axis.width = 50; }
        }
    },
    plugins: {
        ...pickratePlugins,
        tooltip: tooltipSettings(formatters.trends),
        datalabels: datalabelsSettings({color: '#de7b6c', formatter: (value) => { return "-" + value + "%"; }}),
    }
};

export const snapshotTrendsUp = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    sectionSize: sectionSize,
    iconSize: imageWidth,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: 40 },
    },
    scales: {
        x: {
            ticks: { display: false},
            grid: { drawOnChartArea: false}
        },
        y: {
            ticks: { display: false },
            grid: { drawOnChartArea: false },
            afterFit: (axis) => { axis.width = 50; }
        }
    },
    plugins: {
        ...pickratePlugins,
        tooltip: tooltipSettings(formatters.trends),
        datalabels: datalabelsSettings({color: '#679552', formatter: (value) => { return "+" + value + "%"; }}),
    }
};

export const strategemCompanions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    sectionSize: 36,
    iconSize: 34,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: 20 },
    },
    scales: {
        x: {
            min: 0,
            max: 50,
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
        datalabels: datalabelsSettings({fontSize: 14})
    }
};

export const strategemFaction = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        bar: { borderWidth: 2 }
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
            grid: { drawOnChartArea: false}
        },
        y: {
            min: 0,
            ticks: {
                display: true,
                font: { size: 11 },
                color: "white",
                maxTicksLimit: 4,
                callback: function (value, index, ticks) {
                    if (index === ticks.length - 1) return '';
                    return value;
                },
            },
            grid: {
                drawBorder: false,
                color: "white",
                drawTicks: false,
                drawOnChartArea: true,
                lineWidth: function (context) {
                    const index = context.index;
                    const ticksLength = context.scale.ticks.length;
                    return index === ticksLength - 1 ? 0 : 1;
                },
            },
            beginAtZero: true
        }
    },
    plugins: pickratePlugins
};

export const strategemPatch = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    layout: { 
        padding:{ top: 35 }
    },
    scales: {
        x: {
            ticks: {
                minRotation: 0,
                maxRotation: 10,
                display: true,
                font: {
                    family: "CustomFont",
                    size: 14,
                },
                color: "white",
            },
            grid: {
                drawOnChartArea: false
            }
        },
        y: {
            ticks: {
                display: false,
                maxTicksLimit: 3,
            },
            grid: {
                drawBorder: false,
                color: "white",
                drawTicks: false,
                drawOnChartArea: true,
                lineWidth: function (context) {
                    const index = context.index;
                    const ticksLength = context.scale.ticks.length;
                    return index > 0 ? 0 : 1;
                },
            },
            beginAtZero: true
        }
    },
    plugins: pickratePlugins
};

export const strategemOther = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding:{ right: 45 },
    },
    scales: {
        x: {
            ticks: { display: false},
            grid: { drawOnChartArea: false}
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
        datalabels: datalabelsSettings({fontSize: 14})
    },
};
