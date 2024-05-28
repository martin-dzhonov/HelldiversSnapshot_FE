import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


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

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function FactionPage() {
    const [factionData, setFactionData] = useState(null);
    const [graphData, setGraphData] = useState([]);
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const refs = [ref1, ref2, ref3, ref4];

    const graphNames = ["Total", "Strategem", "Support", "Sentry"];
    const missionNames = [
        "LAUNCH ICBM",
        "ENABLE E-710 EXTRACTION",
        "RETRIEVE VALUABLE DATA",
        "SPREAD DEMOCRACY",
        "PURGE HATCHERIES",
        "EMERGENCY EVACUATION",
        "CONDUCT GEOLOGICAL SURVEY",
        "ERADICATE TERMINID SWARM",
        "BLITZ: SEARCH AND DESTROY"
    ]
    const itemTypesIndexes = [
        [0, 49],
        [0, 16],
        [16, 39],
        [39, 50]]
    const [filters, setFilters] = useState({
        faction: "Terminid",
        type: itemTypesIndexes[0],
        difficulty: 0,
        missionType: ""
    });


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
            factionData.forEach((match) => {
                const players = match.players;
                if (filters.difficulty === 0 || match.difficulty === filters.difficulty) {
                    players.forEach((playerItems) => {
                        playerItems.forEach((itemName) => {
                            if (metaDictObj[itemName]) {
                                metaDictObj[itemName] += 1;
                            } else {
                                metaDictObj[itemName] = 1;
                            }
                        })
                    })
                }
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
    }, [filters, factionData]);

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
                ctx.clearRect(0, 0, 50, 1163);

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
        <>
            <DropdownButton id="dropdown-item-button" title={filters.difficulty === 0 ? "Difficulty: All" : "Difficulty: " + filters.difficulty}>
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
            <DropdownButton id="dropdown-item-button" title={filters.difficulty === 0 ? "Strategems: All" : "Strategems: " + filters.difficulty}>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, difficulty: 7, }) }}>
                    All
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, difficulty: 8, }) }}>
                    Eagle
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, difficulty: 8, }) }}>
                    Orbital
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, difficulty: 9, }) }}>
                    Support
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, difficulty: 9, }) }}>
                    Defensive
                </Dropdown.Item>
            </DropdownButton>
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
                </div>
            }
        </>
    );
}

export default FactionPage;
