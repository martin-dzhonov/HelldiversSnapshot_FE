import { isDev } from "../constants";

export const getSettingsWithMax = (settings, maxY) => {
    settings.scales.y.max = maxY;
    return settings;
}

const formatters = {
    trends: (item) => [`Pick Rate: ${item.dataset.pastValue[item.dataIndex]}% ➜ ${item.dataset.currValue[item.dataIndex]}%`],
    companions: (item) => [`Paired together ${item.raw}% of games`],
    snapshot: (item) => { return [`Pick Rate: ${item.raw}%`, `${item.dataset.total[item.dataIndex]} times played`]; },
    pickRate: (item) => `Pick Rate: ${item.raw}%`,
    trends2: (value) => value > 0 ? `+${value}%` : `-${value}%`
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
    barSize: isDev ? 36 : 30,
    imageWidth: 39,
    imageHeight: 39,
    sectionSize: isDev ? 140 : 43,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: 50 },
    },
    scales: {
        x: {
            // min: 0,
            // max: 30,
            ticks: { display: false },
            grid: { drawOnChartArea: false }
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
        datalabels: datalabelsSettings({fontSize: isDev ? 40 : 17}),
    }
};

export const snapshotWeapons = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    barSize: 34,
    imageWidth: 125,
    imageHeight: 58,
    sectionSize: 67,
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
        datalabels: datalabelsSettings({fontSize: isDev ? 40 : 17}),
    }
};


export const snapshotTrendsUp = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    barSize: 30,
    imageWidth: 30,
    imageHeight: 30,
    sectionSize: 40,
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
            grid: { drawOnChartArea: false },
            afterFit: (axis) => { axis.width = 50; }
        }
    },
    plugins: {
        ...pickratePlugins,
        tooltip: tooltipSettings(formatters.trends),
        datalabels: datalabelsSettings({ color: '#679552', formatter: (value) => { return "+" + value + "%"; } }),
    }
};

export const snapshotTrendsDown = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    barSize: 30,
    imageWidth: 30,
    imageHeight: 30,
    sectionSize: 40,
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
            // position: "right",
            ticks: { display: false },
            grid: { drawOnChartArea: false },
            afterFit: (axis) => { axis.width = 50; }
        }
    },
    plugins: {
        ...pickratePlugins,
        tooltip: tooltipSettings(formatters.trends),
        datalabels: datalabelsSettings({ color: '#de7b6c', formatter: (value) => { return "-" + value + "%"; } }),
    }
};

export const strategemCompanions = {
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
        padding: { right: 30 },
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
        datalabels: datalabelsSettings({ fontSize: 14 })
    }
};

export const strategemFaction = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        bar: { borderWidth: 2 }
    },
    layout: {
        padding: { top: 30 },
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
            min: 0,
            ticks: {
                display: false,
                font: { family: "CustomFont", size: 10 },
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
                    //const ticksLength = context.scale.ticks.length;
                    return index === 0;
                },
            },
            beginAtZero: true
        }
    },
    plugins: { ...pickratePlugins, datalabels: datalabelsSettings({ fontSize: 12 }) }
};

export const strategemPatch = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: { top: 35 }
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
                    const labels = [
                      "Classic",
                      "Escalation of Freedom",
                      "Omens of Tyranny",
                      "Servants of Freedom",
                    ];
                    
                    if (index === 0 || index === values.length - 1) {
                      return labels[index]; // Use predefined labels instead of numbers
                    }
                    return "";
                  },
                
            },
            grid: {
                drawOnChartArea: false
            }
        },
        y: {
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
                    //const ticksLength = context.scale.ticks.length;
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
        datalabels: datalabelsSettings({ fontSize: 14 })
    },
};

const datalabelsSettings2 = ({ color = "white", fontSize = 15, anchor = 'end', formatter } = {}) => {
    return {
        anchor: anchor,
        align: function (context) {
            const dataset = context.chart.data.datasets[context.datasetIndex];
            const isPositive = dataset.isPositive[context.dataIndex];
            if (context.datasetIndex === 1) {
                return isPositive ? 'start' : 'end';
            }
            if (context.datasetIndex === 0) {
                return isPositive ? 'end' : 'start';
            }
        },
        font: {
            family: "CustomFont",
            weight: 'bold',
            size: fontSize,
        },
        formatter: function (value, context) {
            const dataset = context.chart.data.datasets[context.datasetIndex];
            const isPositive = dataset.isPositive[context.dataIndex];

            const meta = dataset.meta[context.dataIndex];

            if (context.datasetIndex === 1) {
                return `${isPositive ? `${meta.currValue}` : `-${value}`} %`;
            }
            if (context.datasetIndex === 0) {
                return `${isPositive ? `` : `${value}%`}`;
            }
        },
        color: function (context) {
            if (context.datasetIndex === 1) {
                const dataset = context.chart.data.datasets[context.datasetIndex];
                const isPositive = dataset.isPositive[context.dataIndex];
                return isPositive ? 'white' : 'red';
            }
            return "white";
        },
    }
}

export const trendsMultiLine = {
    indexAxis: "y",
    sectionSize: 60,
    imageWidth: 34,
    imageHeight: 34,
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        bar: { borderWidth: 4 }
    },
    scales: {
        x: {
            min: 0,
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
                drawOnChartArea: true
            }
        },
        y: {
            ticks: {
                display: true,
                maxTicksLimit: 3,
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
    plugins: { ...pickratePlugins, datalabels: datalabelsSettings2({ fontSize: 14 }), }
};

