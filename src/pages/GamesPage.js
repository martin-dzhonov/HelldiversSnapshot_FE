
import '../styles/App.css';
import '../styles/StrategemsPage.css';
import "react-tabs/style/react-tabs.css";
import { useEffect, useState } from 'react'
import { useMobile } from '../hooks/useMobile';
import { apiBaseUrl, patchPeriods } from '../constants';
import GamesTable from '../components/GamesTable';
import GamesFilters from '../components/GamesFilters';

function GamesPage() {
    const { isMobile } = useMobile()
    const [filters, setFilters] = useState({
        faction: "terminid",
        patch: patchPeriods[patchPeriods.length - 1],
        difficulty: 0,
        mission: "All"
    });

    const [filterResults, setFilterResults] = useState(0);

    return (
        <div className="content-wrapper">
            <GamesFilters filters={filters} setFilters={setFilters} />
            <div className="tabs-container">
                <div className="end-element">
                    <div className='filters-result-text'>
                        Games: {filterResults}
                    </div>
                </div>
            </div>
            <div className="show-games-table-wrapper">
                <GamesTable filters={filters} setFilterResults={setFilterResults} />
            </div>
        </div >
    );
}

export default GamesPage;
