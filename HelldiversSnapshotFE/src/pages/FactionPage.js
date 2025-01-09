
import '../App.css';
import './FactionPage.css';
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMobile } from '../hooks/useMobile';
import { useNavigate } from "react-router-dom";
import { getElementAtEvent } from 'react-chartjs-2';
import { apiBaseUrl, patchPeriods, strategems } from '../constants';
import { getItemColor, filterByPatch, countPlayerItems, getMissionsByLength, getStrategemByName, isFiniteNumber } from '../utils';
import * as settings from "../settings/chartSettings";
import GamesTable from '../components/GamesTable';
import Filters from '../components/Filters';
import BarGraph from '../components/BarGraph';
import Loader from '../components/Loader';
import BarChart from '../components/BarChart';
import BarChart2 from '../components/BarChart2';

function FactionPage() {
    const { isMobile } = useMobile();
    const [loading, setLoading] = useState(true);
    const [factionData, setFactionData] = useState(null);
    const [showGames, setShowGames] = useState(false);
    const [showGraph, setShowGraph] = useState(false);

    const [showTrends, setShowTrends] = useState(false);
    const [timelineGraphData, setTimelineGraphData] = useState(null);

    const [dict, setDict] = useState(null);

    const [filters, setFilters] = useState({
        faction: "terminid",
        type: "All",
        difficulty: 0,
        mission: "All",
        patch: {
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
                    filterByPatch(filters.patch, game) &&
                    getMissionsByLength(filters.mission).includes(game.mission)
                );
            });
            return filtered;
        }
    }, [filters, factionData]);

    useEffect(() => {
        if (dataFiltered) {
            let rankedDict = countPlayerItems(dataFiltered, filters.type);
            if(!showGraph){
                rankedDict = Object.fromEntries(Object.entries(rankedDict).slice(0, 15))
            }

            setChartFilterResults({
                matchCount: dataFiltered.length,
                loadoutCount: dataFiltered.reduce((sum, item) => sum + item.players.length, 0)
            });

            setDict(rankedDict);
        }
    }, [filters, dataFiltered, showGraph]);

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
                const newValue = Number(currPatchData[item]?.percentageLoadouts);  
                const oldValue = Number(prevPatchData[item]?.percentageLoadouts);
                return Number(Number(((newValue - oldValue) / oldValue) * 100).toFixed(1));
            })

            const labelsFiltered = labels.filter((item, index)=>{
                if(isFiniteNumber(datasets[index])){
                    return true;
                }
            })
            const datasetsFiltered = datasets.filter((item, index)=>{
                if(isFiniteNumber(item)){
                    return true;
                }
            })

            setTimelineGraphData({
                labels: labelsFiltered,
                datasets: [
                    {
                        data: datasetsFiltered,
                        backgroundColor: labelsFiltered.map((item) =>
                            getItemColor(getStrategemByName(item).id)
                        ),
                        barThickness: 15
                    }
                ]
            });
        }
    }, [factionData, filters]);

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
                <BarChart2 barData={timelineGraphData} />
            }

            <Loader loading={loading}>
                {dict &&
                    <> 
                    <BarChart barData={dict} filters={filters} />
                    <div className='text-small' onClick={() => setShowGraph(!showGraph)}>Matches:  </div>
                    </>}
            </Loader>
        </div>
    );
}

export default FactionPage;
 