
import '../styles/App.css';
import '../styles/StrategemsPage.css';
import "react-tabs/style/react-tabs.css";
import { useState } from 'react'
import { patchPeriods } from '../constants';
import GamesTable from '../components/GamesTable';
import GamesFilters from '../components/filters/GamesFilters';

const defaultFilters = {
    faction: "terminid",
    patch: patchPeriods[patchPeriods.length - 1],
    difficulty: 0,
    mission: "All"
};

function GamesPage() {
    const [filters, setFilters] = useState(defaultFilters);
    const [filterResults, setFilterResults] = useState(0);

    return (
        <div className="content-wrapper">
            <GamesFilters filters={filters} setFilters={setFilters} />
            <div className="games-filters-container">
                <div className='filters-result-text'>
                    Games: {filterResults}
                </div>
            </div>
            <div className="show-games-table-wrapper">
                <GamesTable filters={filters} setFilterResults={setFilterResults} />
            </div>
        </div >
    );
}

export default GamesPage;
