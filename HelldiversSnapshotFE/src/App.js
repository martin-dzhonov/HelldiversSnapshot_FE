import './App.css';
import { useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import * as settings from "./settings/chartSettings";

import { baseLabels, baseIconsSvg, baseLabelsFull } from './baseAssets';
import { terminidData } from './data/terminid';
import logoAutomaton from "./assets/logos/automatonlogo.png"
import logoTerminid from "./assets/logos/termlogo4.png"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  document.title = "Helldivers Meta Snapshot"
  const graphNames = ["Total", "Strategem", "Support", "Sentry"];
  const [graphData, setGraphData] = useState([]);
  const [factionName, setFactionName] = useState('Terminid');
  const [factionData, setFactionData] = useState(null);

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const refs = [ref1, ref2, ref3, ref4];

  const sortDictArray = (a, b) => { return b[1] - a[1] };

  const getItemColor = (item) => {
    const index = baseLabels.indexOf(item);
    return index < 16 ? '#E55A50' : index < 39 ? '#49adc9' : '#679552'
  };

  const fetchData = async () => {
    const response = await fetch("http://localhost:3001/test");
    const data = await response.json();
    setFactionData(data);
  }

  useEffect(() => {
    setFactionData(terminidData)
    // fetchData();
  }, []);


  useEffect(() => {
    if (factionData) {
      const itemTypesIndexes = [
        [0, 49],
        [0, 16],
        [16, 39],
        [39, 50]]

      let metaDictObj = {};
      factionData.forEach((match) => {
        const players = match.players;
        players.forEach((playerItems) => {
          playerItems.forEach((itemName) => {
            if (metaDictObj[itemName]) {
              metaDictObj[itemName] += 1;
            } else {
              metaDictObj[itemName] = 1;
            }
          })
        })
      })

      const dataArrays = [];
      for (let i = 0; i < graphNames.length; i++) {
        let dataSorted = Object.entries(metaDictObj)
          .filter((item) => baseLabels.slice(itemTypesIndexes[i][0], itemTypesIndexes[i][1]).includes(item[0]))
          .sort(sortDictArray);

        let dataParse = {
          labels: dataSorted.map((item) => { const index = baseLabels.indexOf(item[0]); return baseLabelsFull[index] }),
          datasets: [
            {
              data: dataSorted.map((item) => item[1]),
              backgroundColor: dataSorted.map((item) => getItemColor(item[0])),
              barThickness: 16,
            }
          ],
        };
        dataArrays.push(dataParse);
      }
      setGraphData(dataArrays);
    }
  }, [factionName, factionData]);

  useEffect(() => {
    //draw X axis images for each graph
    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i];
      if (ref.current) {
        const labels = graphData[i].labels;
        const dataLength = labels.length;
        const sectionSize = 1163 / dataLength;
        const imgDimensions = 24;
        const halfStep = (sectionSize - imgDimensions) / 2;

        const ctx = ref.current.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, ref.current.clientWidth, 50)

        labels.forEach((element, j) => {
          const imageIndex = baseLabelsFull.indexOf(element);
          let labelImage = new Image();
          labelImage.setAttribute('crossorigin', 'anonymous');
          labelImage.src = baseIconsSvg[imageIndex];

          const imageX = halfStep + (sectionSize * j);
          labelImage.onload = () => {
            ctx.drawImage(
              labelImage,
              0,
              imageX,
              imgDimensions,
              imgDimensions
            );
          }
        });
      }
    }
  }, [graphData]);

  return (
    <div className="app-bg">
      <div className='app-container'>
        <div className='header-logo'>HELLDIVE.LIVE</div>
      </div>
      {graphData.length > 0 &&
        <div style={{ paddingBottom: "50px" }}>
          {graphData.map((graph, index) =>
            <div style={{
              height: '1250px',
              position: "relative"
            }}>
              <Bar
                style={{
                  backgroundColor: 'black',
                  border: "1px solid white",
                  padding: "30px 40px 30px 100px",
                  borderRadius: "15px"
                }}
                options={settings.options}
                width="100%"
                data={graphData[index]}
                redraw={true}
              />

              <canvas style={{
                position: "absolute",
                top: "30px", left: "50px"
              }}
                ref={refs[index]}
                width={50}
                height={1163} />
            </div>
          )}
        </div>}
    </div>
  );
}

export default App;
