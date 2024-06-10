//const missionItem = ref1.current.toDataURL("image/jpeg");
//saveAs(missionItem, `image${i}.png`);

export const options = {
  indexAxis: 'y',
  maintainAspectRatio: false,
  layout: {
    // padding: {
    //   bottom: 80
    // }
  },
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  scales: {
    x: {
      ticks: {
        display: true,
        stepSize: 20,
      },
      grid: {
        drawBorder: false,
        color: '#aaa', 
        drawTicks: false, 
        drawOnChartArea: true
      },
    },
    y: {
      ticks: {
        display: false,
        font: {
          size: 15
        },
        color: 'white'
      },
      grid: {
        drawBorder: false,
        color: '#aaa', 
        drawTicks: false, 
        drawOnChartArea: false 
      },

      beginAtZero: true,
    },
  },
  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    customCanvasBackgroundColor: {
      color: 'lightGreen',
    },
  },

};

export const optionsStrategem = {
  indexAxis: 'x',
  maintainAspectRatio: false,
  elements: {
    bar: {
      borderWidth: 2,
    },
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
        color: 'white'
      },
      grid: {
        drawBorder: false,
        color: '#aaa', 
        drawTicks: true, 
        drawOnChartArea: false
      },
    },
    y: {
      ticks: {
        display: true,
        stepSize: 5,
        font: {
          size: 12
        },
        color: 'white'
      },
      grid: {
        drawBorder: false,
        color: '#aaa', 
        drawTicks: false, 
        drawOnChartArea: true 
      },

      beginAtZero: true,
    },

  },
  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    customCanvasBackgroundColor: {
      color: 'lightGreen',
    },
    tooltip: {
      displayColors: false,
      callbacks: {
        label: (item) => { return `${item.raw}%` }

      },
    },
  },
};
