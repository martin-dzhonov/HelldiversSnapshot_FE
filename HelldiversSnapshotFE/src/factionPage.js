import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useRef, useState } from 'react'
import * as settings from "./settings/chartSettings";
import { baseLabels, baseIconsSvg, baseLabelsFull, missionNames, graphNames, itemTypesIndexes } from './baseAssets';
import { terminidData } from './data/terminid';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import logoAutomaton from "./assets/logos/automatonlogo.png"
import logoTerminid from "./assets/logos/termlogo4.png"
import { useNavigate } from "react-router-dom";


import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar,  getElementAtEvent,
} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function FactionPage() {
    const ref1 = useRef(null);
    const [factionData, setFactionData] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [chartData, setChartData] = useState({
        matchCount: 0,
        loadoutCount: 0,
    });
    const [filters, setFilters] = useState({
        faction: "Terminid",
        type: graphNames[0],
        typeIndexes: itemTypesIndexes[0],
        difficulty: 0,
        missionType: "All"
    });

    const chartRef = useRef(null);
    const navigate = useNavigate();

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
            let metaDictObj = {};
            let matchCount = 0;
            let loadoutCount = 0;
            factionData.forEach((match) => {
                const players = match.players;
                let validMissions = missionNames;
                switch (filters.missionType) {
                    case "Long":
                        validMissions = validMissions.slice(0, 7)
                        break;
                    case "Short":
                        validMissions = validMissions.slice(7, 11)
                        break;
                    default:
                        break;
                }

                if ((filters.difficulty === 0 || match.difficulty === filters.difficulty) && validMissions.includes(match.type)) {
                    matchCount++;
                    players.forEach((playerItems) => {
                        let hasItems = false;
                        playerItems.forEach((itemName) => {
                            if(itemName !== ""){
                                hasItems = true;
                            }
                            if (metaDictObj[itemName]) {
                                metaDictObj[itemName] += 1;
                            } else {
                                metaDictObj[itemName] = 1;
                            }
                        })
                        if(hasItems){
                            loadoutCount++;
                        }
                    })
                }
            })

            setChartData({matchCount, loadoutCount});

            let dataSorted = Object.entries(metaDictObj)
                .filter((item) => baseLabels.slice(filters.typeIndexes[0], filters.typeIndexes[1]).includes(item[0]))
                .sort(sortDictArray);

            let dataParse = {
                labels: dataSorted.map((item) => { const index = baseLabels.indexOf(item[0]); return baseLabelsFull[index] }),
                datasets: [{
                    data: dataSorted.map((item) => item[1]),
                    backgroundColor: dataSorted.map((item) => getItemColor(item[0])),
                    barThickness: 16,
                }],
            };
            setGraphData(dataParse);
        }
    }, [filters, factionData]);

    useEffect(() => {
        //draw X axis images for each graph
            if (ref1.current) {
                const labels = graphData.labels;
                const dataLength = labels.length;
                const sectionSize = 40;
                const containerHeight = (dataLength* sectionSize)-28;
                const imgDimensions = 36;

                const ctx = ref1.current.getContext('2d', { willReadFrequently: true });
                ctx.clearRect(0, 0, 75, containerHeight);

                labels.forEach((element, j) => {
                    const imageIndex = baseLabelsFull.indexOf(element);
                    let labelImage = new Image();
                    labelImage.setAttribute('crossorigin', 'anonymous');
                    labelImage.src = baseIconsSvg[imageIndex];

                    let offsetMagic = j;
                  
                    if(dataLength > 5){
                        offsetMagic = j*3;
                    }
                    if (dataLength > 10){
                        offsetMagic = j*1.8;
                    }
                    if(dataLength > 15){
                        offsetMagic = j*1.15;
                    }
                    if(dataLength > 40){
                        offsetMagic = j/1.7;
                    }
                   
                    const imageX = (sectionSize*j) +((sectionSize - imgDimensions)/2) - offsetMagic;
                    labelImage.onload = () => {
                        ctx.drawImage(
                            labelImage,
                            20,
                            imageX,
                            imgDimensions,
                            imgDimensions
                        );
                    }
                });
            }
        
    }, [graphData]);

    const getDatasetElement = (element) => {
        if (!element.length) return;
    
        const { datasetIndex, index } = element[0];
    
        return graphData.labels[index];
      };

    const onClick = (event) => {
        const { current: chart } = chartRef;

    
        if (!chart) {
          return;
        }

        const elementAtEvent = getDatasetElement(getElementAtEvent(chart, event));

        if(elementAtEvent){
            const elIndex = baseLabelsFull.indexOf(elementAtEvent);
            navigate(`/armory/${baseLabels[elIndex]}`)
        }    
    };
    

    return (
        <div className='content-wrapper'>
            <div className='filters-container'>
            <DropdownButton className='dropdown-button' title={"Faction: " + filters.faction}>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, faction: "Terminid", }) }}>
                    Terminid
                </Dropdown.Item>
                <Dropdown.Item as="button" disabled Tooltip='tets'
                    onClick={() => { setFilters({ ...filters, faction: "Terminid", }) }}>
                    Automaton (Soon)
                </Dropdown.Item>
            </DropdownButton>
      
            <DropdownButton  className='dropdown-button' title={"Strategems: " + filters.type}>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, typeIndexes: itemTypesIndexes[0], type: graphNames[0] }) }}>
                    All
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, typeIndexes: itemTypesIndexes[1], type: graphNames[1] }) }}>
                    Eagle/Orbital
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, typeIndexes: itemTypesIndexes[2], type: graphNames[2] }) }}>
                    Support
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, typeIndexes: itemTypesIndexes[3], type: graphNames[3] }) }}>
                    Defensive
                </Dropdown.Item>
            </DropdownButton>
            <DropdownButton  className='dropdown-button' title={filters.difficulty === 0 ? "Difficulty: All" : "Difficulty: " + filters.difficulty}>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, difficulty: 0, }) }}>
                    All
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, difficulty: 7, }) }}>
                    7 - Suicide Mission
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, difficulty: 8, }) }}>
                    8 - Impossible
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, difficulty: 9, }) }}>
                    9 - Helldive
                </Dropdown.Item>
            </DropdownButton>
            <DropdownButton  className='dropdown-button' title={"Mission Type: " + filters.missionType}>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, missionType: "All", }) }}>
                    All
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, missionType: "Long", }) }}>
                    Long (40min)
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, missionType: "Short", }) }}>
                    Short
                </Dropdown.Item>
            </DropdownButton>
           
            </div>
            <div className='filter-results-container'>
                <div className='filter-results-text'>Matches: {chartData.matchCount} &nbsp;&nbsp;&nbsp; Loadouts: {chartData.loadoutCount} </div>
                <div className='filter-results-text'> Time Period: 27/05/2024 - 29/05/2024</div>
            </div>
            {graphData &&
                <div className='bar-container'>
                    <div style={{
                        height: `${graphData.labels.length * 40}px`,
                        position: "relative"
                    }}>
                        <Bar style={{
                            backgroundColor: 'black',
                            padding: "0px 0px 0px 100px",
                        }}
                        ref={chartRef}
                            options={settings.options}
                            width="100%"
                            data={graphData}
                            redraw={true}
                            onClick={onClick}
                        />

                        <canvas style={{
                            position: "absolute",
                            top: "0px", left: "30px"
                        }}
                            ref={ref1}
                            width={75}
                            height={(graphData.labels.length * 40)-28} />
                    </div>
                </div>
            }
        </div>
    );
}

export default FactionPage;
