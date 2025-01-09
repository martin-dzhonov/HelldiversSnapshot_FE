//const missionItem = ref1.current.toDataURL("image/jpeg");
//saveAs(missionItem, `image${i}.png`);

export const options = {
    indexAxis: "y",
    maintainAspectRatio: false,
    layout: {
        // padding: {
        //   bottom: 80
        // }
    },
    elements: {
        bar: {
            borderWidth: 2
        }
    },
    responsive: true,
    scales: {
        x: {
            ticks: {
                display: true,
                stepSize: 5
            },
            grid: {
                drawBorder: false,
                color: "#aaa",
                drawTicks: false,
                drawOnChartArea: true
            }
        },
        y: {
            ticks: {
                display: false,
                font: {
                    size: 15
                },
                color: "white"
            },
            grid: {
                drawBorder: false,
                color: "#aaa",
                drawTicks: false,
                drawOnChartArea: false
            },

            beginAtZero: true
        }
    },
    plugins: {
        title: {
            display: false
        },
        legend: {
            display: false
        },
        customCanvasBackgroundColor: {
            color: "lightGreen"
        },
        tooltip: {
            displayColors: false,
            callbacks: {
                label: (item) => {
                    return [
                        `${item.raw}% of loadouts`,
                        `${item.dataset.total[item.dataIndex]} times played`
                    ];
                }
            }
        }
    }
};

export const optionsTrends = {
    indexAxis: "x",
    maintainAspectRatio: false,
    layout: {
        // padding: {
        //   bottom: 80
        // }
    },
    elements: {
        bar: {
            borderWidth: 2
        }
    },
    responsive: true,
    scales: {
        x: {
            ticks: {
                display: false,
                stepSize: 5
            },
            grid: {
                drawBorder: false,
                color: "#aaa",
                drawTicks: false,
                drawOnChartArea: false
            }
        },
        y: {
            ticks: {
                display: false,
                stepSize: 5,
                font: {
                    size: 15
                },
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
    },
    plugins: {
        title: {
            display: false
        },
        legend: {
            display: false
        },
        customCanvasBackgroundColor: {
            color: "lightGreen"
        },
        tooltip: {
            displayColors: false,
            callbacks: {
                label: (item) => {
                    return (item.raw > 0 ? "+" : "-") + item.raw + "%";
                }
            }
        }
    }
};

export const optionsTrendsMobile = {
    indexAxis: "y",
    maintainAspectRatio: false,
    layout: {
        // padding: {
        //   bottom: 80
        // }
    },
    elements: {
        bar: {
            borderWidth: 2
        }
    },
    responsive: true,
    scales: {
        x: {
            ticks: {
                display: false,
                stepSize: 5
            },
            grid: {
                drawBorder: false,
                color: "#aaa",
                drawTicks: false,
                drawOnChartArea: true
            }
        },
        y: {
            ticks: {
                display: false,
                stepSize: 5,
                font: {
                    size: 15
                },
                color: "white"
            },
            grid: {
                drawBorder: false,
                color: "#aaa",
                drawTicks: false,
                drawOnChartArea: false
            },

            beginAtZero: true
        }
    },
    plugins: {
        title: {
            display: false
        },
        legend: {
            display: false
        },
        customCanvasBackgroundColor: {
            color: "lightGreen"
        },
        tooltip: {
            displayColors: false,
            callbacks: {
                label: (item) => {
                    return (item.raw > 0 ? "+" : "-") + item.raw + "%";
                }
            }
        }
    }
};

export const optionsStratagem = {
    indexAxis: "x",
    maintainAspectRatio: false,
    elements: {
        bar: {
            borderWidth: 2
        }
    },
    responsive: true,
    scales: {
        x: {
            ticks: {
                display: true,
                stepSize: 20,
                font: {
                    size: 13
                },
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
                stepSize: 10,
                font: {
                    size: 12
                },
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
    },
    plugins: {
        title: {
            display: false
        },
        legend: {
            display: false
        },
        customCanvasBackgroundColor: {
            color: "lightGreen"
        },
        tooltip: {
            displayColors: false,
            callbacks: {
                label: (item) => {
                    return `In ${item.raw}% of loadouts`;
                }
            }
        }
    }
};

export const stregemSmallOption = {
    indexAxis: "x",
    maintainAspectRatio: false,
    elements: {
        bar: {
            borderWidth: 2
        }
    },
    responsive: true,
    scales: {
        x: {
            ticks: {
                display: true,
                stepSize: 10,
                font: {
                    size: 14
                },
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
                stepSize: 5,
                font: {
                    size: 10
                },
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
    },
    plugins: {
        title: {
            display: false
        },
        legend: {
            display: false
        },
        customCanvasBackgroundColor: {
            color: "lightGreen"
        },
        tooltip: {
            displayColors: false,
            callbacks: {
                label: (item) => {
                    return `In ${item.raw}% of loadouts`;
                }
            }
        }
    }
};

export const patchGraphOptions = {
    indexAxis: "x",
    layout: {
        padding: {
          bottom: 22
        }
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
        x: {
            ticks: {
                display: false,
                stepSize: 10,
                font: {
                    size: 14
                },
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
                display: false,
                stepSize: 10,
                font: {
                    size: 10
                },
                color: "white"
            },
            grid: {
                drawBorder: false,
                color: "#aaa",
                drawTicks: false,
                drawOnChartArea: false
            },

            beginAtZero: true
        }
    },
    plugins: {
        title: {
            display: false
        },
        legend: {
            display: false
        },
        customCanvasBackgroundColor: {
            color: "lightGreen"
        },
        tooltip: {
            displayColors: false,
            callbacks: {
                label: (item) => {
                    return `In ${item.raw}% of loadouts`;
                }
            }
        }
    }
};

export const snapshotChartOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false, 
    elements: {
        bar: {
            borderWidth: 4
        }
    },
    scales: {
        x: {
            ticks: {
                display: false,
                stepSize: 5
            },
            grid: {
                drawBorder: false,
                color: "#aaa",
                drawTicks: false,
                drawOnChartArea: true
            }
        },
        y: {
            ticks: { display: false },
            grid: { display: false },
            afterFit: (axis) => {
                axis.width = 50;
            },
        },
    },
    plugins: {
        title: {
            display: false
        },
        legend: {
            display: false
        },
        customCanvasBackgroundColor: {
            color: "lightGreen"
        },
        tooltip: {
            displayColors: false,
            callbacks: {
                label: (item) => {
                    return [
                        `${item.raw}% of loadouts`,
                        `${item.dataset.total[item.dataIndex]} times played`
                    ];
                }
            }
        }
    }
};

export const snapshotTrendOptions = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false, 
    elements: {
        bar: {
            borderWidth: 4
        }
    },
    scales: {
        x: {
            ticks: {
                display: false,
                stepSize: 5
            },
            grid: {
                drawBorder: false,
                color: "#aaa",
                drawTicks: false,
                drawOnChartArea: true
            }
        },
        y: {
            ticks: { display: false },
            grid: { display: false },
            afterFit: (axis) => {
                axis.width = 50;
            },
        },
    },
    plugins: {
        title: {
            display: false
        },
        legend: {
            display: false
        },
        customCanvasBackgroundColor: {
            color: "lightGreen"
        },
        tooltip: {
            displayColors: false,
            callbacks: {
                label: (item) => {
                    return [
                        `${item.raw}% of loadouts`,
                        `${item.dataset.total[item.dataIndex]} times played`
                    ];
                }
            }
        }
    }
};

export const barSize = 24;

export const imageWidth = 36;
export const imageHeight = 36;
export const imageHalfHeight = imageHeight / 2;
export const imageBarOffset = (barSize - imageHeight) / 2;
