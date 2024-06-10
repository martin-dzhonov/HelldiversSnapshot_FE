
import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as settings from "./settings/chartSettings";
import { baseLabels, baseIconsSvg, itemNames, itemCategories, itemCategoryIndexes, difficultiesNames } from './constants';
import { getItemsByCategory, getItemName, getItemColor, getMissionsByLength } from './utils';
import { terminidData } from './data/terminid';

import { useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import GamesTable from './GamesTable';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {
    Bar, getElementAtEvent,
} from 'react-chartjs-2';

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

function FactionPage() {
    const navigate = useNavigate();
    const ref1 = useRef(null);
    const chartRef = useRef(null);

    const [factionName, setFactionName] = useState('Terminid');
    const [factionData, setFactionData] = useState(null);
    const [showGames, setShowGames] = useState(false);
    const [graphData, setGraphData] = useState(null);
    const [filters, setFilters] = useState({
        type: itemCategories[0],
        typeIndexes: itemCategoryIndexes[0],
        difficulty: 0,
        missionType: "All"
    });
    const [chartFilterData, setChartFilterData] = useState({
        matchCount: 0,
        loadoutCount: 0,
    });

    const fetchFactionData = async (url) => {
        const response = await fetch(`http://localhost:3001${url}`);
        console.log('1')
        const data = await response.json();
        setFactionData(data);
    }

    useEffect(() => {
        if(filters){
            fetchFactionData(`/faction/${factionName.toLocaleLowerCase()}`);
        }
    }, [factionName])

    const dataFiltered = useMemo(() => {
        if (factionData && filters) {
            let validMissions = getMissionsByLength(filters.missionType);
            const filtered = factionData
                .filter((game) => filters.difficulty === 0 ? true : game.difficulty === filters.difficulty)
                .filter((game) => validMissions.includes(game.missionName));
            return filtered;
        }
    }, [filters, factionData]);

    useEffect(() => {
        if (dataFiltered) {
            let metaDictObj = {};
            let loadoutCount = 0;

            dataFiltered.forEach((match) => {
                const players = match.players;
                players.forEach((playerItems) => {
                    let hasItems = false;
                    if (playerItems) {
                        playerItems.forEach((itemName) => {
                            if (itemName !== "") { hasItems = true; }
                            if (metaDictObj[itemName]) { metaDictObj[itemName] += 1; }
                            else { metaDictObj[itemName] = 1; }
                        })
                    }
                    if (hasItems) { loadoutCount++; }
                })
            })

            setChartFilterData({ matchCount: dataFiltered.length, loadoutCount });

            let dataSorted = Object.entries(metaDictObj)
                .filter((item) => getItemsByCategory(filters.type).includes(item[0]))
                .sort(sortDictArray);

            let dataParse = {
                labels: dataSorted.map((item) => getItemName(item[0], "short")),
                datasets: [{
                    data: dataSorted.map((item) => item[1]),
                    backgroundColor: dataSorted.map((item) => getItemColor(item[0])),
                    barThickness: 18,
                }],
            };

            setGraphData(dataParse);
        }
    }, [filters, dataFiltered]);

    useEffect(() => {
        //draw X axis images for each graph
        if (ref1.current) {
            const labels = graphData.labels;
            const dataLength = labels.length;
            const sectionSize = 40;
            const containerHeight = (dataLength * sectionSize) - 28;
            const imgDimensions = 36;

            const ctx = ref1.current.getContext('2d', { willReadFrequently: true });
            ctx.clearRect(0, 0, 75, containerHeight);

            labels.forEach((element, j) => {
                const imageIndex = itemNames.indexOf(element);
                let labelImage = new Image();
                labelImage.setAttribute('crossorigin', 'anonymous');

                labelImage.src = baseIconsSvg[imageIndex];

                let offsetMagic = j;

                if (dataLength > 5) {
                    offsetMagic = j * 3;
                }
                if (dataLength > 10) {
                    offsetMagic = j * 2.8;
                }
                if (dataLength > 15) {
                    offsetMagic = j * 1.15;
                }
                if (dataLength > 40) {
                    offsetMagic = j / 1.7;
                }

                const imageX = (sectionSize * j) + ((sectionSize - imgDimensions) / 2) - offsetMagic;
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


    const onBarClick = (event) => {
        const { current: chart } = chartRef;
        if (!chart) { return; }
        const elementAtEvent = getDatasetElement(getElementAtEvent(chart, event));
        if (elementAtEvent) {
            const elIndex = itemNames.indexOf(elementAtEvent);
            navigate(`/armory/${baseLabels[elIndex]}`)
        }
    };

    const getDatasetElement = (element) => {
        if (!element.length) return;
        const { datasetIndex, index } = element[0];
        return graphData.labels[index];
    };

    const sortDictArray = (a, b) => { return b[1] - a[1] };


    return (
        <div className='content-wrapper'>
            <div className='filters-container'>
                <DropdownButton
                    className='dropdown-button'
                    title={"Faction: " + factionName}>
                    <Dropdown.Item as="button"
                        onClick={() => { setFactionName("Terminid") }}>
                        Terminid
                    </Dropdown.Item>
                    <Dropdown.Item as="button"
                        onClick={() => { setFactionName("Automaton") }}>
                        Automaton
                    </Dropdown.Item>
                </DropdownButton>

                <DropdownButton
                    className='dropdown-button'
                    title={"Strategems: " + filters.type}>
                    {itemCategories.map((category, index) =>
                        <Dropdown.Item as="button"
                            onClick={() => { setFilters({ ...filters, type: category }) }}>
                            {category}
                        </Dropdown.Item>
                    )}
                </DropdownButton>
                <DropdownButton
                    className='dropdown-button'
                    title={filters.difficulty === 0 ? "Difficulty: All" : "Difficulty: " + filters.difficulty}>
                    {difficultiesNames.map((difficultyName) =>
                        <Dropdown.Item as="button"
                            onClick={() => { setFilters({ ...filters, difficulty: difficultyName === "All" ? 0 : Number(difficultyName[0]) }) }}>
                            {difficultyName}
                        </Dropdown.Item>
                    )}
                </DropdownButton>
                <DropdownButton
                    className='dropdown-button'
                    title={"Mission Type: " + filters.missionType}>
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
                <div className='filter-results-text'>Matches: {chartFilterData.matchCount} &nbsp;&nbsp;&nbsp; Loadouts: {chartFilterData.loadoutCount} </div>
                <div className='filter-results-text' style={{ fontSize: '18px', textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => setShowGames(!showGames)}> Show Games </div>
            </div>
            {showGames &&
                <div className='show-games-table-wrapper'>
                    <GamesTable data={dataFiltered} />
                </div>
            }
            {graphData &&
                <div className='bar-container'>
                    <div style={{
                        height: `${graphData.labels.length * 40}px`,
                        position: "relative"
                    }}>
                        <Bar class="bar-factions" style={{
                            backgroundColor: '#181818',
                            padding: "0px 0px 0px 60px",
                        }}
                            ref={chartRef}
                            options={settings.options}
                            width="100%"
                            data={graphData}
                            redraw={true}
                            onClick={onBarClick}
                        />

                        <canvas style={{
                            position: "absolute",
                            top: "0px", left: "0px"
                        }}
                            ref={ref1}
                            width={75}
                            height={(graphData.labels.length * 40) - 28} />
                    </div>
                </div>
            }
        </div>
    );
}

export default FactionPage;
