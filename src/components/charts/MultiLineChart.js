// import "../styles/App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useMemo, useRef, useState } from "react";
// import { itemCategoryColors, strategems } from "../constants";

// import * as settings from "../settings/chartSettings";

// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip as ChartTooltip,
//     Legend,
//     Filler
// } from "chart.js";
// import { Bar } from 'react-chartjs-2';
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     ChartTooltip,
//     Legend,
//     Filler
// );

// const MultiLineChart = ({ data, options, onLineClick, type = 1 }) => {

//     const chartRef = useRef(null);
//     const [images, setImages] = useState({});
//     const [imagesLoaded, setImagesLoaded] = useState(false);

//     const chartHeight = useMemo(() => {
//         if (data) {
//             return data.length * options.sectionSize;
//         }
//     }, [data]);

//     useMemo(() => {
//         if (strategems) {
//             const images = {};
//             let loadedCount = 0;

//             Object.keys(strategems).forEach((imageKey) => {
//                 const image = new Image();
//                 image.src = strategems[imageKey]?.svg;

//                 image.onload = () => {
//                     images[imageKey] = image;
//                     loadedCount += 1;

//                     if (loadedCount === Object.keys(strategems).length) {
//                         setImages(images);
//                         setImagesLoaded(true);
//                     }
//                 };
//             });
//         }
//     }, [strategems]);

//     const dataset = useMemo(() => {
//         if (data) {
//             return {
//                 labels: data.map(([key, values]) => key),
//                 datasets: [
//                     {
//                         label: 'Escalation',
//                         data: data.map(([key, values]) => values.diff > 0 ?  values.pastValue : values.currValue),
//                         meta: data.map(([key, values]) => values),
//                         isPositive: data.map(([key, values]) => values.diff > 0),
//                         backgroundColor:  data.map(([key, values]) => values.diff > 0 ?  'rgb(45, 181, 100)' : "#3447c7"),
//                         stack: 'Stack 0',
//                     },
//                     {
//                         label: 'Omens',
//                         data: data.map(([key, values]) => values.diff > 0 ?  values.diff.toFixed(1) : Math.abs(values.diff).toFixed(1)),
//                         meta: data.map(([key, values]) => values),
//                         isPositive: data.map(([key, values]) => values.diff > 0),
//                         backgroundColor: data.map(([key, values]) => values.diff > 0 ?  "#3447c7" : "rgb(25, 141, 100)"),
//                         stack: 'Stack 0',
//                     },
//                 ]
//             };
//         }
//     }, [data]);

//     const handleDrawImage = (chart) => {
//         const { ctx } = chart;
//         const chartHeight = chart.chartArea?.height;
//         const chartWidth = chart.chartArea?.width;

//         const dataLength = Object.keys(data).length;
//         const step = (chartHeight - settings.barSize * dataLength) / dataLength;
//         const yOffset = step / 2 + settings.imageBarOffset;

//         ctx.save();

//         const imageNames = data.map(([key, values]) => key);

//         imageNames.forEach((imageKey, i) => {
//             const imageY = i * (settings.barSize + step) + yOffset + 80;
//             const image = images[imageKey];
//             const imageSize = options.iconSize;

//             if (image) {
//                 ctx.drawImage(
//                     image,
//                     type === 1 ? 0 : chartWidth + 80,
//                     type === 1 ? imageY : imageY + 30,
//                     imageSize,
//                     imageSize
//                 );
//             }
//         });

//         ctx.restore();
//     };

//     if (!imagesLoaded) {
//         return null;
//     }

//     return (
//         <>{dataset &&
//             <div style={{ width: "100%", height: `${chartHeight}px` }}>
//                 <div className="bar-chart-wrapper">
//                     <Bar ref={chartRef}
//                         options={options}
//                         redraw={true}
//                         plugins={[{
//                             beforeDraw: (chart) => handleDrawImage(chart),
//                             resize: (chart) => handleDrawImage(chart),
//                         }]}
//                         data={dataset} />
//                 </div>
//             </div>
//         }
//         </>
//     );
// };

// export default MultiLineChart;
