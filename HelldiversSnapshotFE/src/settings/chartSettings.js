export const barSize = 24;

export const imageWidth = 36;
export const imageHeight = 36;
export const imageHalfHeight = imageHeight / 2;
export const imageBarOffset = (barSize - imageHeight) / 2;

const percentLoadoutsPlugins = {
    title: { display: false },
    legend: { display: false },
    tooltip: {
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
            label: (item) => `Pick Rate: ${item.raw}%`
        }
    },
    datalabels: {
        display: false,
    },
};

export const strategemLarge = {
    indexAxis: "y",
    maintainAspectRatio: false,
    elements: {
        bar: { borderWidth: 4 }
    },
    responsive: true,
    plugins: percentLoadoutsPlugins,
    scales: {
        x: {
            ticks: {
                display: false,
                font: { size: 13 },
                color: "white",
                stepSize: 10

            },
            grid: {
                drawBorder: false,
                color: "white",
                drawTicks: false,
                drawOnChartArea: false
            }
        },
        y: {
            ticks: {
                padding: 10,
                display: true,
                font: {
                    family: "CustomFont",  // Custom font for x-axis ticks
                    size: 13,
                },
                color: "white",
            },
            grid: {
                drawBorder: false,
                color: "white",
                drawTicks: false,
                drawOnChartArea: false
            },
            beginAtZero: true
        }
    },
};

export const strategemFaction = {
    indexAxis: "x",
    maintainAspectRatio: false,
    elements: {
        bar: { borderWidth: 2 }
    },
    responsive: true,
    plugins: percentLoadoutsPlugins,
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
            grid: {
                drawBorder: false,
                color: "white",
                drawTicks: true,
                drawOnChartArea: false
            }
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
};

export const strategemPatch = {
    indexAxis: "x",
    layout: {
        padding:
            { top: 35 },
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: percentLoadoutsPlugins,
    scales: {
        x: {
            ticks: {
                minRotation: 0, // Minimum rotation angle for the ticks
                maxRotation: 10, // Maximum rotation angle for the ticks
                display: true,
                font: {
                    family: "CustomFont",
                    size: 14,
                },
                color: "white",
            },
            grid: {
                drawBorder: false,
                color: "white",
                drawTicks: false,
                drawOnChartArea: false
            }
        },
        y: {
            ticks: {
                display: false,
                font: { size: 11 },
                color: "white",
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
};

export const snapshotItems = {
    indexAxis: "y",
    sectionSize: 40,
    iconSize: 36,
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        bar: { borderWidth: 4 }
    },
    scales: {
        x: {

            ticks: {
                padding: 10,
                display: true,
                font: {
                    family: "CustomFont",
                    size: 12,
                },
                color: "white",
            },
            grid: {
                drawBorder: false,
                color: "white",
                drawTicks: false,
                drawOnChartArea: true
            }
        },
        y: {
            ticks: { display: false },
            grid: { display: false },
            afterFit: (axis) => { axis.width = 50; }
        }
    },
    plugins: {
        title: {
            display: false
        },
        legend: {
            display: false
        },
        datalabels: {
            display: false,
        },
        tooltip: {
            displayColors: false,
            bodyFont: {
                family: "CustomFont",
                size: 14,
            },
            titleFont: {
                family: "CustomFont",
                size: 14,
            },
            callbacks: {
                label: (item) => {
                    return [
                        `Pick Rate: ${item.raw}%`,
                        `${item.dataset.total[item.dataIndex]} times played`
                    ];
                }
            }
        }
    }
};

export const snapshotTrendsDown = {
    indexAxis: "y",
    sectionSize: 40,
    iconSize: 36,
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        bar: { borderWidth: 4 }
    },
    scales: {
        x: {

            ticks: { display: false, stepSize: 5 },
            grid: {
                drawBorder: false,
                color: "white",
                drawTicks: false,
                drawOnChartArea: false
            }
        },
        y: {
            ticks: { display: false },
            grid: { display: false },
            afterFit: (axis) => { axis.width = 50; }
        }
    },
    plugins: {
        ...percentLoadoutsPlugins,
        tooltip: {
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
                label: (item) => [
                    `Pick Rate: ${item.dataset.pastValue[item.dataIndex]}% ➜ ${item.dataset.currValue[item.dataIndex]}%`
                ]
            }
        },
        datalabels: {
            color: '#de7b6c',
            anchor: 'end',
            align: 'end',
            font: {
                family: "CustomFont",
                weight: 'bold',
                size: 14,
            },
            formatter: (value) => "-" + value + "%",
        },
    }
};

export const snapshotTrendsUp = {
    indexAxis: "y",
    sectionSize: 40,
    iconSize: 36,
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        bar: { borderWidth: 4 }
    },
    scales: {
        x: {

            ticks: { display: false, stepSize: 5 },
            grid: {
                drawBorder: false,
                color: "white",
                drawTicks: false,
                drawOnChartArea: false
            }
        },
        y: {
            ticks: { display: false },
            grid: { display: false },
            afterFit: (axis) => { axis.width = 50; }
        }
    },
    plugins: {
        ...percentLoadoutsPlugins,
        tooltip: {
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
                label: (item) => [
                    `Pick Rate: ${item.dataset.pastValue[item.dataIndex]}% ➜ ${item.dataset.currValue[item.dataIndex]}%`
                ]
            }
        },
        datalabels: {
            color: '#679552',
            anchor: 'end',
            align: 'end',
            font: {
                family: "CustomFont",
                weight: 'bold',
                size: 14,
            },
            formatter: (value) => "+" + value + "%",
        },
    }
};

export const strategemCompanions = {
    indexAxis: "y",
    sectionSize: 36,
    iconSize: 34,

    responsive: true,
    maintainAspectRatio: false,
    elements: {
        bar: { borderWidth: 4 }
    },
    scales: {
        x: {
            min: 0,
            max: 50,
            ticks: { display: false, stepSize: 5 },
            grid: {
                drawBorder: false,
                color: "white",
                drawTicks: false,
                drawOnChartArea: false
            },
            beginAtZero: true
        },
        y: {
            ticks: { display: false },
            grid: { display: false },
            afterFit: (axis) => { axis.width = 50; }
        }
    },
    plugins: {
        ...percentLoadoutsPlugins,
        tooltip: {
            displayColors: false,
            bodyFont: {
                family: "CustomFont",
                size: 14,
            },
            titleFont: {
                family: "CustomFont",
                size: 14,
            },
            callbacks: {
                label: (item) => [
                    `Paired together ${item.raw}% of games`
                ]
            }
        }
    }
};

export const getSettingsWithMax = (settings, maxX) => {
    settings.scales.y.max = maxX;
    return settings;
}