import './App.css';

import { useEffect, useMemo, useRef, useState } from 'react'
import * as settings from "./settings/chartSettings";
import { baseLabels, baseIconsSvg, baseLabelsFull, missionNames, graphNames, itemTypesIndexes, difficultiesNames } from './baseAssets';
import { terminidData } from './data/terminid';

import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Table from 'react-bootstrap/Table';
import InfiniteScroll from 'react-infinite-scroll-component';

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
import {
    Bar, getElementAtEvent,
} from 'react-chartjs-2';
import ScreenshotToggle from './screenshotToggle';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// const fetchData = async () => {
//     const response = await fetch("http://localhost:3001/test");
//     const data = await response.json();
//     setFactionData(data);
// }

function FactionPage() {
    const navigate = useNavigate();

    const ref1 = useRef(null);
    const chartRef = useRef(null);

    const [factionData, setFactionData] = useState(null);
    const [showGames, setShowGames] = useState(false);
    const [graphData, setGraphData] = useState(null);
    const [filters, setFilters] = useState({
        faction: "Terminid",
        type: graphNames[0],
        typeIndexes: itemTypesIndexes[0],
        difficulty: 0,
        missionType: "All"
    });
    const [chartFilterData, setChartFilterData] = useState({
        matchCount: 0,
        loadoutCount: 0,
    });

    const stepSize = 10;
    const [page, setPage] = useState(1);


    const sortDictArray = (a, b) => { return b[1] - a[1] };

    useEffect(() => {
        // fetchData();
        setFactionData(terminidData)
    }, []);

    const dataFiltered = useMemo(() => {
        if (filters) {
            let validMissions =
                filters.missionType === "All" ? missionNames :
                    filters.missionType === "Short" ? missionNames.slice(8, missionNames.length) : missionNames.slice(0, 8);

            const filtered = terminidData
                .filter((game) => filters.difficulty === 0 ? true : game.difficulty === filters.difficulty)
                .filter((game) => validMissions.includes(game.type));
            return filtered;
        }

    }, [filters, terminidData]);

    useEffect(() => {
        if (dataFiltered) {
            let metaDictObj = {};
            let loadoutCount = 0;
            dataFiltered.forEach((match) => {
                const players = match.players;
                players.forEach((playerItems) => {
                    let hasItems = false;
                    playerItems.forEach((itemName) => {
                        if (itemName !== "") { hasItems = true; }
                        if (metaDictObj[itemName]) { metaDictObj[itemName] += 1; }
                        else { metaDictObj[itemName] = 1; }
                    })
                    if (hasItems) { loadoutCount++; }
                })
            })

            setChartFilterData({ matchCount: dataFiltered.length, loadoutCount });

            let dataSorted = Object.entries(metaDictObj)
                .filter((item) => baseLabels.slice(filters.typeIndexes[0], filters.typeIndexes[1]).includes(item[0]))
                .sort(sortDictArray);

            let dataParse = {
                labels: dataSorted.map((item) => baseLabelsFull[baseLabels.indexOf(item[0])]),
                datasets: [{
                    data: dataSorted.map((item) => item[1]),
                    backgroundColor: dataSorted.map((item) => getItemColor(item[0])),
                    barThickness: 17,
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
                const imageIndex = baseLabelsFull.indexOf(element);
                let labelImage = new Image();
                labelImage.setAttribute('crossorigin', 'anonymous');
                labelImage.src = baseIconsSvg[imageIndex];

                let offsetMagic = j;

                if (dataLength > 5) {
                    offsetMagic = j * 3;
                }
                if (dataLength > 10) {
                    offsetMagic = j * 1.8;
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
            const elIndex = baseLabelsFull.indexOf(elementAtEvent);
            navigate(`/armory/${baseLabels[elIndex]}`)
        }
    };

    const getDatasetElement = (element) => {
        if (!element.length) return;
        const { datasetIndex, index } = element[0];
        return graphData.labels[index];
    };

    const getItemColor = (item) => {
        const index = baseLabels.indexOf(item);
        return index < 16 ? '#E55A50' : index < 39 ? '#49adc9' : '#679552'
    };

    return (
        <div className='content-wrapper'>
            <div className='filters-container'>
                <DropdownButton
                    className='dropdown-button'
                    title={"Faction: " + filters.faction}>
                    <Dropdown.Item as="button"
                        onClick={() => { setFilters({ ...filters, faction: "Terminid", }) }}>
                        Terminid
                    </Dropdown.Item>
                    <Dropdown.Item as="button" disabled Tooltip='tets'
                        onClick={() => { setFilters({ ...filters, faction: "Terminid", }) }}>
                        Automaton (Soon)
                    </Dropdown.Item>
                </DropdownButton>

                <DropdownButton
                    className='dropdown-button'
                    title={"Strategems: " + filters.type}>
                    {graphNames.map((graph, index) =>
                        <Dropdown.Item as="button"
                            onClick={() => {
                                setFilters({
                                    ...filters,
                                    typeIndexes: itemTypesIndexes[index],
                                    type: graphNames[index]
                                })
                            }}>
                            {graph}
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
                    <Table striped bordered hover size="sm" variant="dark">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Loadouts</th>
                                <th>Difficulty</th>
                                <th>Mission</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataFiltered && dataFiltered.map((game, index) =>
                                <tr>
                                    <td className='filter-results-text' >{index + 1}</td>
                                    <td className='filter-results-text'>
                                        <div class='table-loadout-row-wrapper'>
                                            {game.players.map((loadout) =>
                                                <div class='table-loadout-wrapper'>
                                                    {loadout.map((item) => {
                                                        const itemSvgIndex = baseLabels.indexOf(item);
                                                        return baseLabels[itemSvgIndex] ?
                                                            <img className='armory-img-wrapper' src={baseIconsSvg[itemSvgIndex]} width={40}></img>
                                                            : <div className='armory-img-wrapper'></div>;
                                                    })}
                                                </div>)}
                                        </div>
                                        <td>
                                            <ScreenshotToggle id={game.id} />
                                        </td>
                                    </td>
                                    <td className='filter-results-text'>{game.difficulty}</td>
                                    <td className='filter-results-text'>{game.type}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            }

            {graphData &&
                <div className='bar-container'>
                    <div style={{
                        height: `${graphData.labels.length * 40}px`,
                        position: "relative"
                    }}>
                        <Bar class="bar-factions" style={{
                            backgroundColor: 'black',
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
