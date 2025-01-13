
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

            let labels = Object.keys(currPatchData).map((item) => strategems[item].name);

            let datasets = Object.keys(currPatchData).map((item) => {
                const newValue = Number(currPatchData[item]?.percentageLoadouts);
                const oldValue = Number(prevPatchData[item]?.percentageLoadouts);
                return Number(Number(((newValue - oldValue) / oldValue) * 100).toFixed(1));
            })

            const labelsFiltered = labels.filter((item, index) => {
                if (isFiniteNumber(datasets[index])) {
                    return true;
                }
            })
            const datasetsFiltered = datasets.filter((item, index) => {
                if (isFiniteNumber(item)) {
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
    }, [matchData, filters]);

    return (
        <div className="content-wrapper">
            <Filters filters={filters} setFilters={setFilters} />

            <div className='filter-results-container'>
                <div className='text-small'>
                    Matches: {filterCount.matchCount}
                    &nbsp;&nbsp;&nbsp;
                    Loadouts: {filterCount.loadoutCount} </div>
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
                        Show Games
                    </div>
                </div>
            </div>
            {showGames && (
                <div className="show-games-table-wrapper">
                    <GamesTable data={dataFiltered} />
                </div>
            )}
            <Loader loading={loading}>
                {graphData &&
                    <>
                        <BarChart barData={graphData} filters={filters} options={chartsSettings.snapshotItems}/>
                        <div className='text-small' onClick={() => setShowGraphFull(!showGraphFull)}>Matches:  </div>
                    </>}
            </Loader>

            {/* {timelineGraphData && showTrends &&
                <BarChart2 barData={timelineGraphData} />
            } */}


        </div>
    );
}

export default FactionPage;
