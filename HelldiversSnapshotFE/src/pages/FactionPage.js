
import { useEffect, useMemo, useRef, useState } from 'react'
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as settings from "../settings/chartSettings";
import { apiBaseUrl, baseLabels, baseIconsSvg, itemNames, itemCategories, itemCategoryIndexes, difficultiesNames, patchPeriods } from '../constants';
import { getItemsByCategory, getItemName, getItemColor, getMissionsByLength, getRankedDict, isDateBetween, filterByPatch } from '../utils';

import { useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import GamesTable from '../components/GamesTable';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
} from 'chart.js';

import {
    Bar, Line, getElementAtEvent,
} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

function FactionPage() {
    const navigate = useNavigate();
    const ref1 = useRef(null);
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [factionName, setFactionName] = useState('Terminid');
    const [factionData, setFactionData] = useState(null);
    const [showGames, setShowGames] = useState(false);
    const [showTrends, setShowTrends] = useState(false);
    const [graphData, setGraphData] = useState(null);

    const [timelineGraphData, setTimelineGraphData] = useState(null);

    const [filters, setFilters] = useState({
        type: "All",
        difficulty: 0,
        missionType: "All",
        period: {
            id: patchPeriods[1].id,
            start: patchPeriods[1].start,
            end: patchPeriods[1].end
        },
    });
    const [chartFilterData, setChartFilterData] = useState({
        matchCount: 0,
        loadoutCount: 0,
    });

    const fetchFactionData = async (url) => {
        const response = await fetch(`${apiBaseUrl}${url}`);
        const data = await response.json();
        setFactionData(data);
        setLoading(false);
    }

    useEffect(() => {
        if (filters) {
            setLoading(true);
            fetchFactionData(`/faction/${factionName.toLocaleLowerCase()}`);
        }
    }, [factionName])

    const dataFiltered = useMemo(() => {
        if (factionData && filters) {
            const filtered = factionData
                .filter((game) => filterByPatch(filters.period.id, game))
                .filter((game) => filters.difficulty !== 0 ? game.difficulty === filters.difficulty : true)
            // .filter((game) => getMissionsByLength(filters.missionType).includes(game.missionName));

            return filtered;
        }
    }, [filters, factionData]);

    useEffect(() => {
        if (dataFiltered) {

            const rankedDict = getRankedDict(dataFiltered, filters.type);
            const loadoutCount = dataFiltered.reduce((sum, item) => sum + item.players.length, 0);

            setChartFilterData({ matchCount: dataFiltered.length, loadoutCount });
            setGraphData({
                labels: Object.keys(rankedDict).map((item) => getItemName(item, "short")),
                datasets: [{
                    data: Object.values(rankedDict).map((item) => item.percentageLoadouts),
                    backgroundColor: Object.keys(rankedDict).map((item) => getItemColor(item)),
                    total: Object.values(rankedDict).map((item) => item.total),
                    barThickness: 18,
                }],
            });
        }
    }, [filters, dataFiltered]);

    useEffect(() => {
        if (factionData) {
            const labels = patchPeriods.map((item) => item.id);

            const patch300Data = getRankedDict(factionData.filter((game) => filterByPatch("1.000.300", game)), filters.type);
            const patch400Data = getRankedDict(factionData.filter((game) => filterByPatch("1.000.400", game)), filters.type);

            const datasets = Object.keys(patch400Data).map((item) => {
                return {
                    label: item,
                    data: [patch300Data[item]?.percentageLoadouts, patch400Data[item]?.percentageLoadouts],
                    borderColor: getItemColor(item)
                }
            })

            const datasets1 = Object.keys(patch400Data).map((item) => {
                return Number(patch400Data[item]?.percentageLoadouts - patch300Data[item]?.percentageLoadouts).toFixed(1);
            })

            setTimelineGraphData({
                labels: Object.keys(patch400Data).map((item) => getItemName(item, "short")),
                datasets: [{
                    data: datasets1,
                    backgroundColor: Object.keys(patch400Data).map((item) => getItemColor(item)),
                    barThickness: 21,
                }],
            });
        }
    }, [factionData, filters.type]);

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
            navigate(`/armory/${factionName.toLowerCase()}/${baseLabels[elIndex]}`)
        }
    };

    const getDatasetElement = (element) => {
        if (!element.length) return;
        const { datasetIndex, index } = element[0];
        return graphData.labels[index];
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };

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
                    title={"Patch: " + filters.period.id}>
                    {patchPeriods.map((patchPeriod, index) =>
                        <Dropdown.Item as="button"
                            onClick={() => { setFilters({ ...filters, period: patchPeriod }) }}>
                            {`${patchPeriod.id === "All" ? "" : "Patch"} ${patchPeriod.id} : ${patchPeriod.start} - ${patchPeriod.end}`}
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
                <div className='filter-results-container2'>
                <div className='filter-results-text'
                    style={{ fontSize: '18px', textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => setShowTrends(!showTrends)}>
                    Show Trends
                </div>
                <div className='filter-results-text'
                    style={{ fontSize: '18px', textDecoration: "underline", cursor: "pointer", paddingLeft: "40px" }}
                    onClick={() => setShowGames(!showGames)}>
                    Show Games
                </div>
                </div>
            </div>
            {showGames &&
                <div className='show-games-table-wrapper'>
                    <GamesTable data={dataFiltered} />
                </div>
            }

            {timelineGraphData && showTrends &&
                <div className='bar-container2'>
                <div className='strategem-graph-title' style={{paddingLeft: "50px", paddingBottom:"10px"}}>Patch 1.000.300 - 1.000.400</div>
                    <div style={{
                        height: `700px`,
                        position: "relative"
                    }}>
                        <Bar style={{
                            backgroundColor: '#181818',
                            padding: "0px 0px 0px 20px",
                        }}
                            options={settings.optionsTrends}
                            width="100%"
                            height="100px"
                            data={timelineGraphData}
                            redraw={true}
                            onClick={onBarClick}
                        />
                    </div></div>}
            {graphData && (
                loading ?
                    <div className="spinner-faction-container">
                        <div className="lds-dual-ring"></div>
                    </div> :
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
            )}



        </div>
    );
}

export default FactionPage;
