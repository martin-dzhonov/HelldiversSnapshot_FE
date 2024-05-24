import './App.css';
import { useEffect, useRef, useState } from 'react'
import * as settings from "./settings/chartSettings";
import { baseLabels, baseIconsSvg, metaDictAutomaton, metaDictTerminid, baseLabelsFull, metaDictAutomatonTest, metaDictTerminidTest } from './baseAssets';
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
  const [factionName, setFactionName] = useState('Automaton');
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const refs = [ref1, ref2, ref3, ref4];


  const sortDictArray = (a, b) => { return b[1] - a[1] };

  const getItemColor = (item) => {
    const index = baseLabels.indexOf(item);
    return index < 16 ? '#E55A50' : index < 38 ? '#49adc9' : '#679552'
  };

  useEffect(() => {
    const metaDictObj = factionName === 'Terminid' ? metaDictTerminid : metaDictAutomaton;
    const itemTypesIndexes = [
      [0, 49],
      [0, 16],
      [16,38],
      [38,49]]

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
  }, [factionName]);

  useEffect(() => {
    //draw X axis images for each graph
    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i];
      if (ref.current) {
        const labels = graphData[i].labels;
        const dataLength = labels.length;
        const sectionSize = 1666 / dataLength;
        const imgDimensions = 24;
        const halfStep = (sectionSize - imgDimensions) / 2;

        const ctx = ref.current.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, ref.current.clientWidth, 50)

        labels.forEach((element, j) => {
          const imageIndex = baseLabelsFull.indexOf(element);
          let labelImage = new Image();
          labelImage.setAttribute('crossorigin', 'anonymous');
          labelImage.src = baseIconsSvg[imageIndex];

          const imageX = 122 + (sectionSize * j);
          labelImage.onload = () => {
            ctx.drawImage(
              labelImage,
              imageX,
              10,
              imgDimensions,
              imgDimensions
            );
          }
        });
      }
    }
  }, [graphData]);

  return (
    <div className="App" style={{
      backgroundColor: "black",
    }}>
      <div style={{
        backgroundColor: '#3f3f3f',
        height: "75px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "20px",
        borderBottom: "1px solid white"

      }}>
        <div style={{
          color: 'white',
          fontSize: "20px",
          cursor: "pointer",
          marginLeft: "35px",
          marginRight: "20px",
          paddingLeft: "10px",
          paddingRight: "10px",
          backgroundColor: "red",
          height: "50px",
          display: "flex",
          alignItems: "center",
          borderRadius: "5px",
          fontWeight: "600"
        }}>HELLDIVE.LIVE</div>
        <div
          style={{
            backgroundColor: "#660000",
            color: 'white',
            fontSize: "24px",
            cursor: "pointer",
            height: "30px",
            display: "flex",
            padding: "8px 20px 8px 16px",
            justifyContent: "flex-start",
            alignItems: "center",
            borderRadius: "10px",
            border: `2px solid ${factionName === "Automaton" ? "white" : "grey"}`,
            opacity: factionName === "Automaton" ? "1" : "0.7"
          }}
          onClick={(e) => { setFactionName('Automaton') }}>
          <div style={{ marginRight: "10px" }}>Automaton</div>
          <img style={{ width: "36px", height: "36px" }} src={logoAutomaton}></img>
        </div>
        <div
          style={{
            backgroundColor: "rgba(255,181,0,255)",
            color: 'white',
            fontSize: "24px",
            cursor: "pointer",
            height: "30px",
            display: "flex",
            padding: "8px 20px 8px 16px",
            justifyContent: "flex-start",
            alignItems: "center",
            borderRadius: "10px",
            border: `2px solid ${factionName === "Terminid" ? "white" : "grey"}`,
            opacity: factionName === "Terminid" ? "1" : "0.7"
          }}
          onClick={(e) => { setFactionName('Terminid') }}>
          <div style={{ marginRight: "10px" }}>Terminid</div>
          <img style={{ width: "36px", height: "36px" }} src={logoTerminid}></img>
        </div>
      </div>
      {graphData.length > 0 &&
        <div style={{ paddingBottom: "50px" }}>
          {graphData.map((graph, index) =>
            <div style={{
              height: '750px',
              padding: "40px 50px 20px 50px",
              position: "relative"
            }}>
              <div style={{
                color: 'white',
                fontSize: "24px",
                textAlign: "left",
                paddingBottom: "12px",
                paddingLeft: "15px"
              }}>
                {graphNames[index]}
              </div>
              <Bar
                style={{
                  backgroundColor: 'black',
                  border: "1px solid white",
                  padding: "30px 40px 0px 40px",
                  borderRadius: "15px"
                }}
                options={settings.options}
                width="100%"
                data={graphData[index]}
                redraw={true}
              />

              <canvas style={{
                position: "absolute",
                bottom: "-5px", left: "0"
              }}
                ref={refs[index]}
                width={1864}
                height={50} />
            </div>

          )}
        </div>}
    </div>
  );
}

export default App;
