
import '../App.css';
import './FactionPage.css';
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMobile } from '../hooks/useMobile';
import { useNavigate } from "react-router-dom";
import { getElementAtEvent } from 'react-chartjs-2';
import { apiBaseUrl, patchPeriods, strategems } from '../constants';
import { getItemColor, filterByPatch, countPlayerItems, getMissionsByLength, getStrategemByName } from '../utils';
import * as settings from "../settings/chartSettings";
import GamesTable from '../components/GamesTable';
import Filters from '../components/Filters';
import BarGraph from '../components/BarGraph';
import Loader from '../components/Loader';

function FactionPage() {
    const navigate = useNavigate();
    const { isMobile } = useMobile();
    const [loading, setLoading] = useState(true);
    const [factionData, setFactionData] = useState(null);
    const [showGames, setShowGames] = useState(false);
    const [showTrends, setShowTrends] = useState(false);
    const [graphData, setGraphData] = useState(null);
    const [timelineGraphData, setTimelineGraphData] = useState(null);

    const chartRef = useRef(null);
    const chartCanvasRef = useRef(null);

    const [filters, setFilters] = useState({
        faction: "terminid",
        type: "All",
        difficulty: 0,
        mission: "All",
        period: {
            id: patchPeriods[0].id,
            start: patchPeriods[0].start,
            end: patchPeriods[0].end
        }
    });

    const [chartFilterResults, setChartFilterResults] = useState({
        matchCount: 0,
        loadoutCount: 0
    });

    const fetchFactionData = async (url) => {
        const response = await fetch(`${apiBaseUrl}${url}`);
        const data = await response.json();

        setFactionData(data);
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        fetchFactionData(`/faction/all`);
    }, []);

    const dataFiltered = useMemo(() => {
        if (factionData && filters) {
            const filtered = factionData.filter((game) => {
                return (
                    game.faction === filters.faction &&
                    (filters.difficulty === 0 || game.difficulty === filters.difficulty) &&
                    filterByPatch(filters.period, game) &&
                    getMissionsByLength(filters.mission).includes(game.mission)
                );
            });
            return filtered;
        }
    }, [filters, factionData]);

    useEffect(() => {
        if (dataFiltered) {
            const rankedDict = countPlayerItems(dataFiltered, filters.type);

            setChartFilterResults({
                matchCount: dataFiltered.length,
                loadoutCount: dataFiltered.reduce((sum, item) => sum + item.players.length, 0)
            });

            setGraphData({
                labels: Object.keys(rankedDict).map((item) => strategems[item].name),
                datasets: [
                    {
                        data: Object.values(rankedDict).map((item) => item.percentageLoadouts),
                        backgroundColor: Object.keys(rankedDict).map((item) => getItemColor(item)),
                        total: Object.values(rankedDict).map((item) => item.total),
                        barThickness: 18
                    }
                ]
            });
        }
    }, [filters, dataFiltered]);

    useEffect(() => {
        if (factionData && filters) {

            const prevPatchData = countPlayerItems(
                factionData.filter((game) => game.faction === filters.faction).filter((game) => filterByPatch(patchPeriods[1], game)),
                filters.type
            )
            const currPatchData = countPlayerItems(
                factionData.filter((game) => game.faction === filters.faction).filter((game) => filterByPatch(patchPeriods[0], game)),
                filters.type
            );

            let labels = Object.keys(currPatchData).map((item) => strategems[item].name);

            let datasets = Object.keys(currPatchData).map((item) => {
                return Number(currPatchData[item]?.percentageLoadouts - prevPatchData[item]?.percentageLoadouts).toFixed(1);
            })

            setTimelineGraphData({
                labels: labels,
                datasets: [
                    {
                        data: datasets,
                        backgroundColor: Object.keys(currPatchData).map((item) =>
                            getItemColor(item)
                        ),
                        barThickness: 26
                    }
                ]
            });
        }
    }, [factionData, filters]);

    useEffect(() => {
        if (chartCanvasRef.current) {
            const labels = graphData.labels;
            const dataLength = labels.length;
            const sectionSize = 40;
            const containerHeight = dataLength * sectionSize - 28;
            const imgDimensions = 36;

            const ctx = chartCanvasRef.current.getContext("2d", {
                willReadFrequently: true
            });
            ctx.clearRect(0, 0, 75, containerHeight);
            labels.forEach((element, j) => {
                const strategemData = Object.values(strategems).find((strategem) => strategem.name === element);

                let labelImage = new Image();
                labelImage.setAttribute("crossorigin", "anonymous");
                labelImage.src = strategemData.svg;

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

                const imageX =
                    sectionSize * j +
                    (sectionSize - imgDimensions) / 2 -
                    offsetMagic;
                labelImage.onload = () => {
                    ctx.drawImage(
                        labelImage,
                        20,
                        imageX,
                        imgDimensions,
                        imgDimensions
                    );
                };
            });
        }
    }, [graphData]);

    const getDatasetElement = (element) => {
        if (!element.length) return;
        const { index } = element[0];
        return graphData.labels[index];
    };

    const onBarClick = (event) => {
        const { current: chart } = chartRef;
        if (!chart) {
            return;
        }
        const elementAtEvent = getDatasetElement(
            getElementAtEvent(chart, event)
        );
        if (elementAtEvent) {
            const strategem = getStrategemByName(elementAtEvent);
            navigate(
                `/armory/${filters.faction.toLowerCase()}/${strategem.id}`
            );
        }
    };

    return (
        <div className="content-wrapper">
            <Filters
                filters={filters}
                setFilters={setFilters}
            />

            <div className='filter-results-container'>
                <div className='text-small'>Matches: {chartFilterResults.matchCount} &nbsp;&nbsp;&nbsp; Loadouts: {chartFilterResults.loadoutCount} </div>
                <div className='filter-results-container2'>
                    <div className='text-small'
                        style={{ fontSize: '18px', textDecoration: "underline", cursor: "pointer" }}
                        onClick={() => setShowTrends(!showTrends)}>
                        Show Trends
                    </div>
                    <div className='text-small'
                        style={{ fontSize: '18px', textDecoration: "underline", cursor: "pointer", paddingLeft: "40px" }}
                        onClick={() => setShowGames(!showGames)}>
                        Show Games
                    </div>
                </div>
            </div>
            {showGames && (
                <div className="show-games-table-wrapper">
                    <GamesTable data={dataFiltered} />
                </div>
            )}

            {timelineGraphData && showTrends &&
                <div className='bar-container2'>
                    <BarGraph data={timelineGraphData} options={isMobile ? settings.optionsTrendsMobile : settings.optionsTrends} onBarClick={onBarClick} redraw />
                </div>}

            <Loader loading={loading}>
                {graphData &&
                    <div className='bar-container'>
                        <div style={{
                            height: `${graphData.labels.length * 40}px`,
                            position: "relative",
                            padding: "0px 0px 0px 60px",
                        }}>

                            <BarGraph
                                data={graphData}
                                chartRef={chartRef}
                                options={settings.options}
                                onBarClick={onBarClick}
                                redraw
                            />
                            <canvas
                                style={{
                                    position: "absolute",
                                    top: "0px",
                                    left: "0px"
                                }}
                                ref={chartCanvasRef}
                                width={75}
                                height={graphData.labels.length * 40 - 28}
                            />
                        </div>
                    </div>}
            </Loader>
        </div>
    );
}

export default FactionPage;
