
import '../styles/App.css';
import '../styles/StrategemsPage.css';
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

function GamesPage() {
    const [filters, setFilters] = useState(defaultFilters);
    const [filterResults, setFilterResults] = useState(0);
    const [type, setType] = useState(1);
    const { data, isLoading } = useGames(filters);
    const [gamesData, setGamesData] = useState(null);
    const [charts, setCharts] = useState(null);

    const galleryCategories = ["DISTRIBUTIONS", "GAMES"];

    useEffect(() => {
        if (data) {
            const { games, distributions } = data;
            const gamesSorted = games.sort((a, b) => a.id - b.id);

            setFilterResults(gamesSorted.length);
            setGamesData(gamesSorted);

            const distCharts = Object.fromEntries(
                Object.entries(distributions).map(([k, v]) => [k, getDistChartData(v)])
            );

            setCharts(distCharts);
        }
    }, [data]);

    return (
        <div className="content-wrapper">
            <GamesFilters filters={filters} setFilters={setFilters} />
            <div className="games-filters-container">
                <div className='filters-result-text'>
                    Games: {filterResults}
                </div>
            </div>
            {/* <div className="type-buttons-wrapper text-medium">
                {galleryCategories.map((label, index) => (
                    <div
                        key={label}
                        className={`${type === index ? 'snapshot-type-button-active' : 'snapshot-type-button'} text-medium`}
                        onClick={() => setType(index)}>
                        {label}
                    </div>
                ))}
            </div> */}
            <Loader loading={isLoading}>
                {type === 0 && charts && (
                    <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="level-graph-wrapper">
                            <div className="strategem-other-title">Player Level</div>
                            <BarChart data={charts.level} options={chartsSettings.level_dist} />
                        </div>
                        <div className="strategem-level-graph-wrapper">
                            <div className="strategem-other-title">Difficulty</div>
                            <BarChart data={charts.difficulty} options={chartsSettings.dist_y} />
                        </div>
                        <div className="strategem-level-graph-wrapper">
                            <div className="strategem-other-title">Mission Type</div>
                            <BarChart data={charts.mission} options={chartsSettings.dist_y} />
                        </div>
                    </div>
                )}
                {type === 1 && gamesData && (
                    <div className="show-games-table-wrapper">
                        <GamesTable data={gamesData} filters={filters} setFilterResults={setFilterResults} />
                    </div>
                )}
            </Loader>

        </div >
    );
}

export default GamesPage;
