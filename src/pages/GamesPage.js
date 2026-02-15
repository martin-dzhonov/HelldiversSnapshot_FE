
import '../styles/App.css';
import '../styles/StrategemsPage.css';
import '../styles/GamesPage.css';
import "react-tabs/style/react-tabs.css";
import { useEffect, useState } from 'react'
import { apiBaseUrl, patchPeriods } from '../constants';
import GamesTable from '../components/GamesTable';
import GamesFilters from '../components/filters/GamesFilters';
import BarChart from '../components/charts/BarChart';
import { useGames } from '../hooks/useGames';
import Loader from '../components/Loader';
import { getDistChartData } from '../utils/utils';
import * as chartsSettings from "../settings/chartSettings";

const defaultFilters = {
    faction: "terminid",
    patch: patchPeriods[patchPeriods.length - 1],
    difficulty: 0,
    mission: "All"
};

const defaultFilterResults = { games: 0, loadouts: 0 };

function GamesPage() {
    const [filters, setFilters] = useState(defaultFilters);
    const [filterResults, setFilterResults] = useState(defaultFilterResults);
    const [type, setType] = useState(0);
    const { data, isLoading } = useGames(filters);
    const [gamesData, setGamesData] = useState(null);
    const [charts, setCharts] = useState(null);

    const galleryCategories = ["GAMES", "DISTRIBUTIONS"];

    useEffect(() => {
        if (data) {
            const { games, distributions } = data;
            const totalLoadouts = games.reduce((sum, game) => sum + game.players.length, 0);
            const resultsCount = {
                games: games.length,
                loadouts: totalLoadouts
            }
            setFilterResults(resultsCount);

            const gamesSorted = games.sort((a, b) => a.id - b.id);
            setGamesData(gamesSorted);

            const distCharts = Object.fromEntries(
                Object.entries(distributions).map(([k, v]) => [k, getDistChartData(v, k)])
            );
            console.log(distCharts)

            setCharts(distCharts);
        }
    }, [data]);

    return (
        <div className="content-wrapper">
            <GamesFilters filters={filters} setFilters={setFilters} />

            <div className="type-buttons-wrapper text-medium">
                {galleryCategories.map((label, index) => (
                    <div
                        key={label}
                        className={`${type === index ? 'snapshot-type-button-active' : 'snapshot-type-button'} text-medium`}
                        onClick={() => setType(index)}>
                        {label}
                    </div>
                ))}
            </div>

            <div className="games-filters-container">
                <div className='games-filters-text'>
                    Games: {filterResults.games}
                    &nbsp;&nbsp;&nbsp;
                    Loadouts: {filterResults.loadouts}
                </div>
            </div>
            <Loader loading={isLoading}>
                {type === 0 && gamesData && (
                    <div className="show-games-table-wrapper">
                        <GamesTable data={gamesData} filters={filters} setFilterResults={setFilterResults} />
                    </div>
                )}

                {type === 1 && charts && (
                    <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="row">
                            <div className="col-xxl-6 col-12">
                                <div className="chart-wrapper">
                                    <div className="chart-title">Games Recorded</div>
                                    <BarChart data={charts.dates} options={chartsSettings.dist_dates} />
                                </div>
                                <div className="chart-wrapper">
                                    <div className="chart-title">Difficulty</div>
                                    <BarChart data={charts.difficulty} options={chartsSettings.dist_games} />
                                </div>
                                <div className="chart-wrapper">

                                    <div className="chart-title">Player Level</div>
                                    <BarChart data={charts.level} options={chartsSettings.dist_y} />
                                </div>

                            </div>
                            <div className="col-xxl-6 col-12">

                                <div className="chart-wrapper">
                                    <div className="chart-title">Planets</div>
                                    <BarChart data={charts.planet} options={chartsSettings.dist_games} />
                                </div>
                                <div className="chart-wrapper">
                                    <div className="chart-title">Missions</div>
                                    <BarChart data={charts.mission} options={chartsSettings.dist_games} />
                                </div>


                            </div>


                        </div>
                    </div>
                )}

            </Loader>

        </div >
    );
}

export default GamesPage;
