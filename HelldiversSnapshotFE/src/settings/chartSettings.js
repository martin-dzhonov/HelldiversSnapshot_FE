//const missionItem = ref1.current.toDataURL("image/jpeg");
//saveAs(missionItem, `image${i}.png`);

export const options = {
    indexAxis: 'x',
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 80
      }
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
          display: false,
        },
        grid: {
          drawBorder: true,
          color: '#aaa', // for the grid lines
          drawTicks: true, // true is default 
          drawOnChartArea: false // true is default 
        },
      },    
      y: {
        ticks: {
          display: true,
          stepSize: 10,
          font: {
            size:15
          },
          color: 'white'
        },
        grid: {
          drawBorder: true,
          color: '#aaa', // for the grid lines
          drawTicks: false, // true is default 
          drawOnChartArea: true // true is default 
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
