
import '../styles/App.css';
import '../styles/FactionPage.css';
import { useEffect, useMemo, useState } from 'react'
import { useMobile } from '../hooks/useMobile';
import { apiBaseUrl, patchPeriods, strategems } from '../constants';
import { getItemColor, filterByPatch, getMissionsByLength, getStrategemByName, isFiniteNumber, getItemDict } from '../utils';
import * as chartsSettings from "../settings/chartSettings";
import GamesTable from '../components/GamesTable';
import Filters from '../components/Filters';
import Loader from '../components/Loader';
import StrategemChart from '../components/StrategemChart';
import BarChart from '../components/BarChart';

function FactionPage() {
    const { isMobile } = useMobile();
    const [loading, setLoading] = useState(true);
    const [showGames, setShowGames] = useState(false);
    const [showGraphFull, setShowGraphFull] = useState(false);
    const [showTrends, setShowTrends] = useState(false);

    const [matchData, setMatchData] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [timelineGraphData, setTimelineGraphData] = useState(null);

    const [filters, setFilters] = useState({
        faction: "terminid",
        type: "All",
        difficulty: 0,
        mission: "All",
        patch: patchPeriods[0]
    });

    const [filterCount, setFilterCount] = useState({
        matchCount: 0,
        loadoutCount: 0
    });

    const fetchMatchData = async (url) => {
        const response = await fetch(`${apiBaseUrl}${url}`);
        const data = await response.json();

        setMatchData(data);
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        fetchMatchData(`/faction/all`);
    }, []);

    const dataFiltered = useMemo(() => {
        if (matchData && filters) {
            const filtered = matchData.filter((game) => {
                return (
                    game.faction === filters.faction &&
                    (filters.difficulty === 0 || game.difficulty === filters.difficulty) &&
                    filterByPatch(filters.patch, game) &&
                    getMissionsByLength(filters.mission).includes(game.mission)
                );
            });
            return filtered;
        }
    }, [filters, matchData]);

    useEffect(() => {
        if (dataFiltered) {
            let rankedDict = getItemDict(dataFiltered, filters.type);
            if (!showGraphFull) {
                rankedDict = Object.fromEntries(Object.entries(rankedDict).slice(0, 15))
            }

            setFilterCount({
                matchCount: dataFiltered.length,
                loadoutCount: dataFiltered.reduce((sum, item) => sum + item.players.length, 0)
            });

            setGraphData(rankedDict);
        }
    }, [filters, dataFiltered, showGraphFull]);

    useEffect(() => {
        if (matchData && filters) {

            const prevPatchData = getItemDict(matchData
                .filter((game) => game.faction === filters.faction)
                .filter((game) => filterByPatch(patchPeriods[1], game)),
                filters.type
            )
            const currPatchData = getItemDict(matchData
                .filter((game) => game.faction === filters.faction)
                .filter((game) => filterByPatch(patchPeriods[0], game)),
                filters.type
            );

            let diffs = Object.keys(currPatchData)
                .map((item) => {
                    const newValue = Number(currPatchData[item]?.percentageLoadouts);
                    const oldValue = Number(prevPatchData[item]?.percentageLoadouts);
                    return { name: item, value: Number(newValue - oldValue).toFixed(1) };
                })
                .sort((a, b) => b.value - a.value)
                .filter((item) => Math.abs(item.value) > 0.5);

            const up = diffs.filter((item) => item.value > 0);
            const down = diffs.filter((item) => item.value < 0).reverse();

            setTimelineGraphData({
                up: up.reduce((acc, item) => {
                    acc[item.name] = { percentageLoadouts: parseFloat(item.value), total: 10 };
                    return acc;
                }, {}),
                down: down.reduce((acc, item) => {
                    acc[item.name] = { percentageLoadouts: Math.abs(parseFloat(item.value)), total: 10 };
                    return acc;
                }, {}),
            })
        }
    }, [matchData, filters]);

    return (
        <div className="content-wrapper">
            <Filters filters={filters} setFilters={setFilters} />
            <div className='filter-results-container'>
                <div className='text-small' style={{ fontSize: "16px" }}>
                    Matches: {filterCount.matchCount}
                    &nbsp;&nbsp;&nbsp;
                    Loadouts: {filterCount.loadoutCount}
                </div>
                <div className='filter-results-buttons-container'>
                    <div
                        className={'text-small filter-button'}
                        onClick={() => setShowTrends(!showTrends)}>
                        Show Trends
                    </div>
                    <div
                        className={'text-small filter-button'}
                        style={{ paddingLeft: "40px" }}
                        onClick={() => setShowGames(!showGames)}>
                        View Games
                    </div>
                </div>
            </div>
            {showGames && (
                <div className="show-games-table-wrapper">
                    <GamesTable data={dataFiltered} />
                </div>
            )}
            <Loader loading={loading}>
                {timelineGraphData && showTrends &&
                    <div className='row'>
                        <div className="col-6">
                            <StrategemChart barData={timelineGraphData?.up} filters={filters} options={chartsSettings.snapshotItems} />
                        </div>
                        <div className="col-6">
                            <StrategemChart barData={timelineGraphData?.down} filters={filters} options={chartsSettings.snapshotItems} />

                        </div>
                    </div>
                }
                {graphData &&
                    <>
                        <StrategemChart barData={graphData} filters={filters} options={chartsSettings.snapshotItems} />
                        <div className='text-small text-faction-show-all' onClick={() => setShowGraphFull(!showGraphFull)}>Show {showGraphFull ? "Less" : "All"}</div>
                    </>}
            </Loader>
        </div>
    );
}

export default FactionPage;
