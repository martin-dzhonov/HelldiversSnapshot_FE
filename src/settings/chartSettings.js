import { isDev, patchPeriods } from "../constants";
import { getCountingSuffix } from "../utils";

export const getSettingsWithMax = (settings, maxY) => {
    settings.scales.y.max = maxY;
    return settings;
}

const formatters = {
    trends: (item) => [`Pick Rate: ${item.dataset.pastValue[item.dataIndex]}% ➜ ${item.dataset.currValue[item.dataIndex]}%`],
    companions: (item) => [`Paired together ${item.raw}% of games`],
    snapshot: (item) => { return [`Pick Rate: ${item.raw}%`, `${item.dataset.total[item.dataIndex]} times played`]; },
    pickRate: (item) => `Pick Rate: ${item.raw}%`,
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

const pickratedatalabelsSettings = ({ color = "white", anchor = 'end', align = 'end', fontSize = 15, rankMax } = {}) => {
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

            return  value + "%";
        }
    }
}


const rankdatalabelsSettings = ({ color = "white", anchor = 'end', align = 'end', fontSize = 15, formatter, rankMax } = {}) => {
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


export const factionChart2 = ({
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
        ...pickratePlugins,
        datalabels: type === 'pick_rate' || type === 'game_rate' ?
        pickratedatalabelsSettings({ fontSize: 16 }) : rankdatalabelsSettings({ fontSize: 16, rankMax: max })
    }
});



export const factionChart = ({
    min,
    percentMax,
    rankMax,
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
            ...(percentMax && { max: percentMax }),
            ...(rankMax > 0 && { max: rankMax }),
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
        ...pickratePlugins, datalabels: datalabelsSettings({ fontSize: 16, rankMax })
    }
});

export const patchChart2 = ({
    min,
    max,
    type
} = {}) => ({
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: { top: 30, right: 25 },
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
                        return labels[index];
                    }
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
        ...pickratePlugins,
        datalabels: type === 'pick_rate' || type === 'game_rate' ?
        pickratedatalabelsSettings({ align: 'top', fontSize: 16 }) : rankdatalabelsSettings({ align: 'top', fontSize: 16, rankMax: max })
    }
});
 
export const patchChart = ({
    min,
    percentMax,
    rankMax,
} = {}) => ({
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: { top: 30, right: 25 },
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
                        return labels[index];
                    }
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
            ...(percentMax && { max: percentMax }),
            ...(rankMax > 0 && { max: rankMax }),
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
        ...pickratePlugins,
        datalabels: datalabelsSettings({ align: 'top', fontSize: 15, rankMax }),
    }
});

export const snapshotItems = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    barSize: isDev ? 36 : 30,
    imageWidth: 60,
    imageHeight: 60,
    sectionSize: isDev ? 140 : 75,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: 55 },
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
            afterFit: (axis) => { axis.width = 70; }
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: tooltipSettings(formatters.snapshot),
        datalabels: datalabelsSettings({ fontSize: isDev ? 40 : 17 }),
    }
};

export const snapshotWeapons = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    barSize: isDev ? 36 : 34,
    imageWidth: 134,
    imageHeight: 60,
    sectionSize: isDev ? 251 : 75,
    elements: {
        bar: { borderWidth: 4 }
    },
    layout: {
        padding: { right: isDev ? 320 : 50 },
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
        datalabels: datalabelsSettings({ fontSize: isDev ? 47 : 17 }),
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
        datalabels: datalabelsSettings({ fontSize: 15 })
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
            ticks: {
                display: true,
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
        }
    },
    plugins: { ...pickratePlugins, datalabels: datalabelsSettings({ fontSize: 16 }) }
};

export const strategemPatch = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: { top: 35, right: 25 }
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
                    return index > 0 ? 0 : 1;
                },
            },
            beginAtZero: true
        }
    },
    plugins: {
        ...pickratePlugins,
        datalabels: datalabelsSettings({ align: 'top', fontSize: 15 }),
    }
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
        datalabels: datalabelsSettings({ fontSize: 15 })
    },
};