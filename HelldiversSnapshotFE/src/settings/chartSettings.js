export const barSize = 24;

export const imageWidth = 36;
export const imageHeight = 36;
export const imageHalfHeight = imageHeight / 2;
export const imageBarOffset = (barSize - imageHeight) / 2;

const commonPlugins = {
    title: { display: false },
    legend: { display: false },
    tooltip: {
        displayColors: false,
        callbacks: {
            label: (item) => `In ${item.raw}% of loadouts`
        }
    }
};

const commonScales = {
    x: {
        ticks: {
            display: true,
            font: { size: 14 },
            color: "white"
        },
        grid: {
            drawBorder: false,
            color: "#aaa",
            drawTicks: true,
            drawOnChartArea: false
        }
    },
    y: {
        ticks: {
            display: true,
            font: { size: 10 },
            color: "white"
        },
        grid: {
            drawBorder: false,
            color: "#aaa",
            drawTicks: false,
            drawOnChartArea: true
        },
        beginAtZero: true
    }
};

const commonElements = {
    bar: { borderWidth: 2 }
};

export const strategemLarge = {
    indexAxis: "x",
    maintainAspectRatio: false,
    elements: commonElements,
    responsive: true,
    scales: {
        ...commonScales,
        x: {
            ...commonScales.x,
            ticks: {
                ...commonScales.x.ticks,
                stepSize: 20,
                font: { size: 13 }
            }
        },
        y: {
            ...commonScales.y,
            ticks: {
                ...commonScales.y.ticks,
                stepSize: 10,
                font: { size: 12 }
            }
        }
    },
    plugins: { ...commonPlugins }
};

export const strategemSmall = {
    indexAxis: "x",
    maintainAspectRatio: false,
    elements: commonElements,
    responsive: true,
    scales: {
        ...commonScales,
        x: {
            ...commonScales.x,
            ticks: {
                ...commonScales.x.ticks,
                stepSize: 10
            }
        },
        y: {
            ...commonScales.y,
            ticks: {
                ...commonScales.y.ticks,
                stepSize: 5
            }
        }
    },
    plugins: { ...commonPlugins }
};

export const strategemPatch = {
    indexAxis: "x",
    layout: { padding: { bottom: 22 } },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
        ...commonScales,
        x: {
            ...commonScales.x,
            ticks: { ...commonScales.x.ticks, display: false }
        },
        y: {
            ...commonScales.y,
            ticks: { ...commonScales.y.ticks, display: false },
            grid: { ...commonScales.y.grid, drawOnChartArea: false }
        }
    },
    plugins: { ...commonPlugins }
};

const snapshotScales = {
    x: {
        ticks: { display: false, stepSize: 5 },
        grid: { drawBorder: false, color: "#aaa", drawTicks: false, drawOnChartArea: true }
    },
    y: {
        ticks: { display: false },
        grid: { display: false },
        afterFit: (axis) => { axis.width = 50; }
    }
};

const snapshotPlugins = {
    ...commonPlugins,
    tooltip: {
        displayColors: false,
        callbacks: {
            label: (item) => [
                `${item.raw}% of loadouts`,
                `${item.dataset.total[item.dataIndex]} times played`
            ]
        }
    }
};

const snapshotElements = {
    bar: { borderWidth: 4 }
};

export const snapshotItems = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    elements: snapshotElements,
    scales: snapshotScales,
    plugins: snapshotPlugins
};

export const snapshotTrends = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    elements: snapshotElements,
    scales: snapshotScales,
    plugins: snapshotPlugins
};